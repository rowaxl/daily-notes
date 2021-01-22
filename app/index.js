import "core-js/stable"
import "regenerator-runtime/runtime"
import express from 'express'
import path from 'path'
import { config } from 'dotenv'
import cors from 'cors'

import router from './router'

import { initializeDB } from './libs/database'

config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// common error handler
app.use((error, req, res, next) => {
  if (error) {
    res.status(error.status)
    res.json({ error: error.message })
    return
  }

  next(error)
})

app.use(router)

const {
  PORT = 3000,
  NODE_ENV
} = process.env


app.listen(PORT, async () => {
  console.log(`Server starts listen on: ${PORT}`)

  const result = await initializeDB()

  if (!result) {
    console.log('Failed to connect MongoDB')
    return process.exit(1)
  }

  console.log(`${NODE_ENV} MongoDB Ready`)
})