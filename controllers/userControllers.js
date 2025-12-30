const createError = require("http-errors")
const { successResponse } = require("../response/response")
const bcrypt = require("bcrypt")
const UserModel = require("../model/useModel")
const { createToken } = require("../helper/jwt")

exports.userGet = async (req, res, next) => {
    try {
        if (!req.user) {
            throw createError(401, "login first")
        }
        const user = await UserModel.findById(req.user.id).select("-password")
        if (!user) {
            throw createError(401, "user not found")
        }
        successResponse(res, { statusCode: 200, message: "user found", data: user })
    } catch (error) {
        next(error)
    }
}

exports.sginUp = async (req, res, next) => {
    try {
        const { fullName, email, password, } = req.body
        if (!fullName || !email || !password) {
            throw createError(400, "all fields are required")
        }
        const user = await UserModel.findOne({ email })
        if (user) {
            throw createError(400, "user already exist, please login.")
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await UserModel.create({
            fullName,
            email,
            password: hashPassword,
        })
        if (!newUser) {
            throw createError(400, "user not created")
        }
        successResponse(res, { statusCode: 200, message: "registraion complited", data: newUser })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw createError(400, "all fields are required")
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw createError(400, "user not found, please sign up.")
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw createError(400, "email or password not match")
        }
        const token = await createToken({ id: user._id, email: user.email,  role: user.role }, process.env.SECRET_KEY, "1d")
        if (!token) {
            throw createError(400, "token not generated")
        }
        const hidePassword = await UserModel.findOne({ email }).select("-password")
        successResponse(res, { statusCode: 200, message: "login success", data: { token, user: hidePassword } })

    } catch (error) {
        next(error)
    }
}


