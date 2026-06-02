const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controllers/account.contoller')

const router = express.Router()

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post('/', authMiddleware.authMiddleware, accountController.createAccountController)

module.exports = router