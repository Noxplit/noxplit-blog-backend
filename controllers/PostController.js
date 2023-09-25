import Post from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await Post.find().populate('user').exec()
		res.json(posts)
	} catch (error) {
		return res.status(500).json({
			message: `Статьи не найдены ${error}`,
		})
	}
}

export const getOne = (req, res) => {
	try {
		const postsId = req.params.id
		Post.findOneAndUpdate(
			{
				_id: postsId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'before',
			},
		).populate('user').exec().then((doc, err) => {
			if (err) {
				return res.status(500).json({
					message: `Не удалось вернуть статью`,
				})
			}

			if (!doc) {
				return res.status(404).json({
					message: 'Статья не найдена',
				})
			}

			res.json(doc)
		})
	} catch (error) {
		return res.status(500).json({
			message: `Статьи не найдены ${error}`,
		})
	}
}
export const getTags = async(req, res) => {
	try {
    const posts = await Post.find().exec()
    const tags = posts.map(obj => obj.tags).flat().slice(0,5)
		res.json(tags)
	} catch (error) {
		return res.status(500).json({
			message: `Теги не найдены ${error}`,
		})
	}
}
export const remove = (req, res) => {
	try {
		const postsId = req.params.id
		Post.findOneAndDelete({
			_id: postsId,
		}).then((doc, err) => {
			if (err) {
				return res.status(500).json({
					message: `Не удалось удалить статью`,
				})
			}

			if (!doc) {
				return res.status(404).json({
					message: 'Статья не найдена',
				})
			}
			res.json({
				success: true,
			})
		})
	} catch (error) {
		return res.status(500).json({
			message: `Статьи не найдены ${error}`,
		})
	}
}
export const update = (req, res) => {
	try {
		const postsId = req.params.id
		Post.findOneAndUpdate({
      _id: postsId
    }, {
      title: req.body.title,
			text: req.body.text,
			tags: req.body.tags.split(','),
			imageUrl: req.body.imageUrl,
			user: req.userId,
    }).then()
    res.json({success:true})
	} catch (error) {
		return res.status(500).json({
			message: `Не удалось обновить статью ${error}`,
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new Post({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags.split(','),
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})
		const post = await doc.save()
		res.json(post)
	} catch (error) {
		return res.status(500).json({
			message: error,
		})
	}
}
