import express from 'express'
import 'dotenv/config'
import multer from 'multer'
import cors from 'cors'
import mongoose from 'mongoose'
import { loginValidation, postCreateValidation, registerValidation } from './validations/validations.js'
import checkAuth from './utils/checkAuth.js'
import { auth, login, register } from './controllers/UserController.js'
import {create, getAll, getOne, getTags, remove, update} from './controllers/PostController.js'
import { handleErrors } from './utils/handleErrors.js'

const app = express() // Создание екпресс приложения

const storage = multer.diskStorage({
  destination:(_,__,cb) => {
    cb(null, 'uploads')
  },
  filename:(_,file,cb) => {
    cb(null, file.originalname)
  }
}) // Загрузка изображений на сервер
const upload = multer({storage})

app.use(express.json()) // Работа с json в запросах на сервер
app.use(cors())
app.use('/uploads', express.static('uploads'))

mongoose
	.connect(
		process.env.MONGODB_CONNECT
	)
	.then(() => {
		console.log('Connect to MongoDB')
	})
	.catch(err => console.log(err)) // Подключение к базе данных

app.post('/auth/register', registerValidation, handleErrors, register) // Создание пользователя
app.post('/auth/login', loginValidation, handleErrors, login) // Авторизация пользователя
app.get('/auth/me', checkAuth, auth) // Проверка авторизации пользователя

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url:`/uploads/${req.file.originalname}`
  })
})

app.get('/posts', getAll) // Получение всех статей
app.get('/posts/:id', getOne) // Получение одной статьи
app.get('/tags', getTags)// Запрос на получение тегов
app.post('/posts', checkAuth, postCreateValidation, create) // Создание поста
app.delete('/posts/:id', checkAuth,  remove) // Удаление поста
app.patch('/posts/:id', checkAuth, postCreateValidation, update) // Обновление поста



app.listen(process.env.PORT || 4444, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server Ok')
}) // Запуск сервера
