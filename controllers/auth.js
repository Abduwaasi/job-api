import { StatusCodes } from "http-status-codes"
import BadRequest from "../errors/bad-request.js"
import UnAuthenticatedError from "../errors/unAuthenticated.js"
import users from "../models/users.js"
import UserModel from "../models/users.js"

const register = async (req, res) => {
    const user = await UserModel.create({ ...req.body })
    const token = user.createJwt()
    res.status(StatusCodes.CREATED).json({ user, token })
}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequest("Please provide email or password")
    }
    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new UnAuthenticatedError("Invalid Credential")
    }

    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        throw new UnAuthenticatedError("Invalid credentials")
    }
    const token = user.createJwt()
    res.status(StatusCodes.OK).json({
        user: {
            name: user.name
        },
        token
    })
}

export { register, login }