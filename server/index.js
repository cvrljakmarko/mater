const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}))
app.use(express.json())

// --- Helpers for ID policy ---
const toNumber = (idStr) => {
    // handles "0027" -> 27 (and tolerates non-digits if any)
    const n = parseInt(String(idStr).replace(/\D/g, ''), 10)
    return Number.isFinite(n) ? n : 0
}
const toId = (n) => String(n).padStart(4, '0')

// --- Load once into memory ---
function loadInitialTariffs() {
    const file = path.join(__dirname, 'data/users.json')
    const raw = fs.readFileSync(file, 'utf-8')
    return JSON.parse(raw)
}

let users = loadInitialTariffs()

// Compute next number from current max
let nextSeq = users.reduce((max, t) => Math.max(max, toNumber(t.id)), 0) + 1

// --- Routes ---

// READ (all)
app.get('/api/users', (req, res) => {
    res.json(users)
})

// READ (by id)
app.get('/api/users/:id', (req, res) => {
    const t = users.find(x => String(x.id) === String(req.params.id))
    if (!t) return res.status(404).json({ error: 'User not found' })
    res.json(t)
})

// CREATE (auto-assign ID, in-memory only)
app.post('/api/users', (req, res) => {
    const { name, email, status } = req.body || {}

    const requiredFields = ['name', 'email', 'status']
    const missingFields = requiredFields.filter(f => !req.body?.hasOwnProperty(f))
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` })
    }

    const id = toId(nextSeq++)
    const newUser = { id, name, email, status }

    users.push(newUser)

    res.status(201).json(newUser)
})

app.put('/api/users/:id', (req, res) => {
    const id = String(req.params.id)
    const { name, email, status } = req.body || {}
    const requiredFields = ['name', 'email', 'status']
    const missingFields = requiredFields.filter(f => !req.body?.hasOwnProperty(f))
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` })
    }

    const i = users.findIndex(u => String(u.id) === id)
    if (i === -1) return res.status(404).json({ error: 'User not found' })
    users[i] = { ...users[i], name: String(name).trim(), email, status }
    return res.json(users[i])
})

app.patch('/api/users/:id', (req, res) => {
    const id = String(req.params.id)
    const i = users.findIndex(u => String(u.id) === id)
    if (i === -1) return res.status(404).json({ error: 'User not found' })
    const next = { ...users[i] }
    if (typeof req.body?.name === 'string') next.name = req.body.name.trim()
    if (typeof req.body?.email === 'string') next.email = req.body.email.trim()
    if (typeof req.body?.status === 'string') next.status = req.body.status.trim()
    users[i] = next
    return res.json(users[i])
})

app.delete('/api/users/:id', (req, res) => {
    const id = String(req.params.id)
    const i = users.findIndex(u => String(u.id) === id)
    if (i === -1) return res.status(404).json({ error: 'User not found' })

    users.splice(i, 1)
    return res.status(204).send()
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
