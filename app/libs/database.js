import mongoose from 'mongoose'

const {
    DB_URI = 'mongodb://127.0.0.1:27017/daily_notes',
} = process.env

let instance = null

export const initializeDB = async () => {
    if (!instance)
        instance = await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    return instance
}

export const DBError = err => {
    console.error(err)
    const DBError = new Error('DB Error ' + err.message)
    DBError.status = 500

    throw DBError
}

export const toObjectId = string => {
    let result

    try {
        result = mongoose.Types.ObjectId(string)
    } catch (error) {
        const paramError = new Error('Invalid ObjectId')
        paramError.status = 403

        throw paramError
    }

    return result
}