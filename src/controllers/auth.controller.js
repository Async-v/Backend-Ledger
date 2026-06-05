const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')
const TokenBlackListModel = require('../models/blackList.model')


/** 
* - user register controller
* - POST /api/auth/register
*/

async function userRegisterController(req, res) {

    const { email, password, name } = req.body

    const isExists = await userModel.findOne({ email: email })
    if (isExists) {
        return res.status(422).json({
            status: "failed",
            message: "User already exists with this email."
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)
}

/**
 * - user login controller
 * - POST /api/auth/login
*/

async function userLoginController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email: email }).select("+password")
    if (!user) {
        return res.status(401).json({
            message: "Email or Password is Invaild"
        })
    }

    const isVaildPassword = await user.comparePassword(password)
    if (!isVaildPassword) {
        return res.status(401).json({
            message: "Email or Password is Invaild"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}

/**
 * - user logout controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await TokenBlackListModel.create({ 
        token: token
    })
    
    res.clearCookie("token")
    return res.status(200).json({
        message: "User logged out successfully"
    })
}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}