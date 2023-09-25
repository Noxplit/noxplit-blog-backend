import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { handleErrors } from '../utils/handleErrors.js'



export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new User({
			fullName: req.body.fullName,
			email: req.body.email,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			},
		)

		const { passwordHash, ...global } = user._doc
		res.json({
			...global,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Не удалось зарегистрировать' })
	}
} // функционал для регистрации пользователя

export const login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' })
		}
		const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)
		if (!isValid) {
			return res.status(403).json({ message: 'Логин или пароль не подходит' })
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			},
		)

		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (error) {
		res.status(400).json({ message: 'Не удалось авторизоваться' })
	}
}

export const auth = async (req, res) => {
	try {
		const user = await User.findById(req.userId)
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData
		})
	} catch (error) {
		return res.status(404).json({
			message: 'Не удалось получить данные о пользователе',
		})
	}
}
