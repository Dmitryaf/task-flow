import { Response, Router } from "express";
import { authMiddleWare, AuthRequest } from "../middleware/auth";

const router = Router();

interface Task {
    id: number;
    userId: number;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
}

let tasks: Task[] = []
let taskId = 1;

router.use(authMiddleWare);

router.get('/', (req: AuthRequest, res: Response) => {
    const userTasks = tasks.filter(task => task.userId === req.userId)
    res.json(userTasks)
})

router.post('/', (req: AuthRequest, res: Response) => {
    const { title, status = 'todo' } = req.body

    if (!title) {
        return res.status(400).json({ error: 'Title is required' })
    }

    const newTask: Task = {
        id: taskId++,
        userId: req.userId!,
        title,
        status,
        createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    res.status(201).json(newTask)
})

router.put('/:id', (req: AuthRequest, res: Response) => {
    const idParam = req.params.id
    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({ error: 'Invalid task id' })
    }
    const taskId = parseInt(idParam)
    const { title, status } = req.body

    const task = tasks.find((task) => task.id === taskId && task.userId === req.userId)
    if (!task) {
        return res.status(404).json({ error: 'Task not found' })
    }

    if (title !== undefined) {
        task.title = title
    }
    if (status !== undefined) {
        task.status = status
    }

    res.json(task)
})


router.delete('/:id', (req: AuthRequest, res: Response) => {
    const idParam = req.params.id
    if (Array.isArray(idParam) || !idParam) {
        return res.status(400).json({ error: 'Invalid task id' })
    }
    const taskId = parseInt(idParam)
    const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === req.userId)

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' })
    }

    tasks.splice(taskIndex, 1)
    res.status(204).send()
})

export default router
