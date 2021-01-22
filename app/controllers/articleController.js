import ArticleModel from '../models/Articles'
import { DBError, toObjectId } from '../libs/database'

export const fetchArticles = async () => {
  return await ArticleModel.find({}).catch(DBError)
}

export const getArticles = async (req, res) => {
  const articles = await ArticleModel.find({}).catch(DBError)

  res.json({ articles })
}

export const getOneArticle = async (req, res) => {
  const objectId = toObjectId(req.params.id)

  const result = await ArticleModel.findOne({ _id: objectId }).catch(DBError)

  if (!result) {
    const APIError = new Error('Failed to find Article')
    APIError.status = 404

    throw APIError
  }

  res.json({ result })
}

export const postArticle = async (req, res) => {
  const newArticle = new ArticleModel({
    ...req.body,
    liked: 0,
    createdAt: new Date()
  })

  const result = await newArticle.save({ validateBeforeSave: true }).catch(DBError)

  if (!result) {
    const APIError = new Error('Failed to create Article')
    APIError.status = 403

    throw APIError
  }

  res.status(200).json({ result })
}

export const postComment = async (req, res) => {
  const _id = toObjectId(req.params.id)

  if (!_id) {
    res.status(404).send({ message: 'Invalid ID' })
    return
  }

  const target = await ArticleModel.findById({ _id })

  if (!target) {
    const APIError = new Error('Cannot found the Article')
    APIError.status = 404

    throw APIError
  }

  const newComment = {
    ...req.body,
    date: new Date()
  }

  target.comments.push(newComment)

  const result = await ArticleModel.updateOne(
    { _id },
    { comments: target.comments }
  ).catch(DBError)

  if (!result) {
    const APIError = new Error('Failed to create comments')
    APIError.status = 403

    throw APIError
  }

  res.status(200).json({ result })
}

export const postLike = async (req, res) => {
  const _id = toObjectId(req.params.id)

  if (!_id) {
    res.status(404).send({ message: 'Invalid ID' })
    return
  }

  const target = await ArticleModel.findById({ _id })

  if (!target) {
    const APIError = new Error('Cannot found the Article')
    APIError.status = 404

    throw APIError
  }

  const result = await ArticleModel.updateOne(
    { _id },
    { liked: parseInt(req.body.liked) }
  ).catch(DBError)

  if (!result) {
    const APIError = new Error('Failed to create comments')
    APIError.status = 403

    throw APIError
  }

  res.status(200).json({ result })
}

export const updateArticle = async (req, res) => {
  const objectId = toObjectId(req.params.id)

  const target = await ArticleModel.findOne({ _id: objectId })

  if (!target) {
      const APIError = new Error('Cannot found the Article')
      APIError.status = 404

      throw APIError
  }

  const result = await ArticleModel.updateOne(
      { _id: objectId },
      { ...req.body }
  ).catch(DBError)

  if (!result) {
      const APIError = new Error('Failed to update Article')
      APIError.status = 403

      throw APIError
  }

  res.status(200).json({ result })
}

export const deleteArticle = async (req, res) => {
  const objectId = toObjectId(req.params.id)

  const target = await ArticleModel.findOne({ _id: objectId })

  if (!target) {
      const APIError = new Error('Cannot found the Article')
      APIError.status = 404

      throw APIError
  }

  const result = await ArticleModel.deleteOne({ _id: objectId }).catch(DBError)

  if (!result) {
      const APIError = new Error('Failed to delete Article')
      APIError.status = 403

      throw APIError
  }

  res.status(200).json({ result })
}
