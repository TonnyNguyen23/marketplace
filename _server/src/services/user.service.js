import createError from 'http-errors'
import { User } from '../models'

/**
 * Create user
 * @param {Object} body
 * @returns {Promise<user>}
 */
const createUser = async userBody => {
  const user = await getUserByAddress(userBody.address)
  if (user) {
    throw createError.BadRequest('Address already exists')
  }
  const newUser = await User.create(userBody)
  return newUser
}

/**
 * Get users by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<users>}
 */
const queryUsers = async (filter, options) => {
  const customLabels = {
    docs: 'users',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalUsers',
  }
  options = { ...options, customLabels }
  const users = await User.paginate(filter, options)
  return users
}

/**
 * Find user by id
 * @param {ObjectId} userId
 * @returns {Promise<user>}
 */
const getUserById = async userId => {
  const user = await User.findById(userId)
  return user
}

/**
 * Find user by email
 * @param {string} address
 * @returns {Promise<user>}
 */
const getUserByAddress = async address => {
  const user = await User.findOne({ address })
  return user
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserById = async (userId, body) => {
  const user = await getUserById(userId)

  if (!user) {
    throw createError.NotFound()
  }

  if (body.email && (await getUserByEmail(body.email))) {
    throw createError.BadRequest('Email already exists')
  }

  Object.assign(user, body)
  await user.save()
  return user
}

/**
 * Update user by id
 * @param {ObjectId} userAddress
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserByAddress = async (userAddress, body) => {
  const user = await getUserByAddress(userAddress)

  if (!user) {
    throw createError.NotFound()
  }

  if (body.email && (await getUserByEmail(body.address))) {
    throw createError.BadRequest('Email already exists')
  }

  Object.assign(user, body)
  await user.save()
  return user
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserPasswordById = async (userId, body) => {
  const user = await getUserById(userId)
  if (!user) {
    throw createError.NotFound()
  }
  Object.assign(user, body)
  await user.save()
  return user
}

/**
 * Delte user by id
 * @param {ObjectId} userId
 * @returns {Promise<user>}
 */
const deleteUserById = async userId => {
  const user = await getUserById(userId)
  if (!user) {
    throw createError.NotFound()
  }
  const result = await user.remove()
  return result
}

export default {
  createUser,
  queryUsers,
  getUserById,
  updateUserById,
  getUserByAddress,
  deleteUserById,
  updateUserPasswordById,
  updateUserByAddress,
}
