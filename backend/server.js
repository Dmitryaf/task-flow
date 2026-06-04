const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'secret-key';

const users = [];

app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exist' })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email, name, password: hashedPassword };
    users.push(user);

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, name } })
})

app.post('api/auth/login', await(req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);

    if(!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})


app.get('api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})