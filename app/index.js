import express from 'express'
import { config } from 'dotenv'

config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const { PORT = 3000 } = process.env

app.listen(PORT, async () => {
  console.log(`Server starts listen on: ${PORT}`)
})