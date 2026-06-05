import bcrypt from "bcryptjs"
import { Request, Response, Router } from "express"
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

// Временное хранилище

interface User {
    id: number
    email: string
    name: string
    password: string
}

const users: User[] = []

router.post('/register', async (req: Request, res: Response) => {
    console.log("🚀 ~ req.body:", req.body)
    const { email, name, password } = req.body

    if (!email || !name || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    if (users.find((user) => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user: User = {
        id: users.length + 1,
        password: hashedPassword,
        email,
        name,
    }
    users.push(user)

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '7d'
    })

    res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = users.find((user) => user.email === email)
    if (!user) {
        return res.status(400).json({ error: 'Invalid password or email' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid password' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d'
    })

    res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name }
    })
})

export default router