import { Schema, model } from 'mongoose'

const ArticleSchema = new Schema({
  title: {
    type: Schema.Types.String,
    required: [true, 'Title cannot be empty']
  },
  contents: {
    type: Schema.Types.String
  },
  author: {
    type: Schema.Types.String,
    required: [true, 'Author cannot be empty']
  },
  liked: {
    type: Schema.Types.Number,
    default: 0,
    min: [0, 'Liked cannot be negative']
  },
  comments: {
    type: Schema.Types.Array,
    default: []
  },
  createdAt: {
    type: Schema.Types.Date,
    default: 0,
    min: [0, 'CreatedAt cannot be negative']
  }
})

const Articles = model('Articles', ArticleSchema)

export default Articles