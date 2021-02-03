const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type,login,token,x-token');
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

const users = []

const tmp_salt = bcrypt.genSaltSync(9)
users.push({
    id: 1,
    login: 'trin',
    salt: tmp_salt,
    hash: bcrypt.hashSync('123', tmp_salt)
})

let tokens = []

// tokens.push({ login: 'trin', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRyaW4iLCJpYXQiOjE2MTIzNjIzNDl9.3ZLIhTVwEtjfxrWRiUv6yd51f4USVquDU7KL1c6u0ZY' })

const usersList = [
    { id: 1, name: 'Semen', group: 'main' },
    { id: 2, name: 'Vasya', group: 'main' },
    { id: 3, name: 'Peter', group: 'main' },
    { id: 4, name: 'Sasha', group: 'main' },
    { id: 5, name: 'Ira', group: 'main' },
    { id: 6, name: 'Kostya', group: 'main' },
]
const privateKey = "KnowledgeCity"

let currentId = 0

app.post('/registration', (req, res) => {
    const sameUser = users.find((user) => user.login == req.body.login)
    if (!sameUser) {
        const salt = bcrypt.genSaltSync(9)
        const hash = bcrypt.hashSync(req.body.password, salt)

        users.push({
            id: currentId,
            login: req.body.login,
            salt: salt,
            hash: hash
        })

        currentId++

        res.json({ login: req.body.login, hash: hash })
    } else {
        res.status(401).send({ error: "User is already exists" })
    }
})

app.post('/auth', (req, res) => {
    const { login, password } = req.body
    const userInBase = users.find((user) => user.login === login)
    if (!userInBase) {
        return res.status(401).send({ error: "Invalid Login/password" })
    }

    const isValid = bcrypt.compareSync(password, userInBase.hash)
    if (!isValid) {
        return res.status(401).send({ error: 'Invalid Login/password' })
    }

    tokens = tokens.filter((token) => token.login !== login)
    const newToken = jwt.sign({ login, password }, privateKey)
    tokens.push({ login, token: newToken })
    res.json({ login, token: newToken })
})

app.get('/users', (req, res) => {
    const auth = checkToken(req)
    if (auth) {
        return res.json(usersList)
    }
    return res.status(401).send({ success: false, error: 'invalid login/password' })
})

app.get('/check_token', (req, res) => {
    const auth = checkToken(req)
    if (auth) {
        return res.status(200).send({ success: true })
    }
    return res.status(401).send({ success: false, error: 'invalid login/password' })
})

const checkToken = (req) => {
    const token = req.headers['x-token']
    if (tokens.find(item => item.token === token)) {
        return true
    }
    return false
}


app.listen(5000, () => console.log("App listening on port 5000"))
