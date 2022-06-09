const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const creatJWT = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_PASS,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('error...1'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('error...2'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = creatJWT(user.id, email, role)
        return res.json({token})

    }


    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('error...'))
        }
        let comparePassword = bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('error...'))
        }
        const token = creatJWT(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = creatJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()