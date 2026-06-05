import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routes/auth'
import taskRouter from './routes/tasks'

const app = express()

app.use(cors())
app.use(express.json())

// Роуты
app.use('/api/auth', authRouter)
app.use('/api/auth', taskRouter)


app.get('api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})