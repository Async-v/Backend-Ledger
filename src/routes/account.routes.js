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

/**
 * - GET /api/accounts/
 * - Get all accounts of the authenticated user
 * - Protected Route
 */
router.get('/', authMiddleware.authMiddleware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 * - Get balance of a specific account
 */
router.get('/balance/:accountId', authMiddleware.authMiddleware, accountController.getAccountBalanceController)

module.exports = router