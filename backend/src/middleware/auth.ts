import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

export interface AuthRequest extends Request {
    userId?: number
}

export const authMiddleWare = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
        req.userId = decoded.id
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid token' })
    }
}