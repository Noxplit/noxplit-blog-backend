import {body} from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный email').isEmail(),
  body('password', 'Неверный пароль').isLength({min:5}),
  body('fullName', 'Неверное имя пользователя').isLength({min:5}),
  body('avatarUrl', 'Неверный URL адрес').optional().isURL(),
]
export const loginValidation = [
  body('email', 'Неверный email').isEmail(),
  body('password', 'Неверный пароль').isLength({min:5}),

]

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min:5}).isString(),
  body('text', 'Введите текст статьи').isLength({min:10}).isString(),
  body('tags', 'Неверное формат тегов').optional().isArray(),
  body('imageUrl', 'Неверный формат изображения').optional().isURL(),
]