import { Router } from 'express'
import {
  fetchArticles,
  getArticles,
  getOneArticle,
  postArticle,
  postComment,
  updateArticle,
  deleteArticle,
  postLike,
} from './controllers/articleController'

const router = Router()

router.get('/', async (req, res) => {
  const posts = await fetchArticles()

  res.render('index', { posts })
})

router.get('/api/articles', getArticles)
router.get('/api/articles/:id', getOneArticle)
router.post('/api/articles', postArticle)
router.post('/api/articles/:id/comment', postComment)
router.post('/api/articles/:id/like', postLike)
router.put('/api/articles/:id', updateArticle)
router.delete('/api/articles/:id', deleteArticle)

router.use((req, res) => {
  res.status(404).render('404')
})

export default router