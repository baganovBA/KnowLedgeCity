const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type,login,token');
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

const users=[]
let tokens=[]
const usersList=[
    {id:1, name:'Semen', group:'main'},
    {id:2, name:'Vasya', group:'main'},
    {id:3, name:'Peter', group:'main'},
    {id:4, name:'Sasha', group:'main'},
    {id:5, name:'Ira', group:'main'},
    {id:6, name:'Kostya', group:'main'},
]
const privateKey ="KnowledgeCity"
 
let currentId = 0 

app.post('/registration', (req,res)=>{
    const sameUser = users.find((user)=>user.login == req.body.login)
    if(!sameUser){
        const salt = bcrypt.genSaltSync(9)
        const hash = bcrypt.hashSync(req.body.password, salt)

        users.push({
            id:currentId,
            login:req.body.login,
            salt:salt,
            hash:hash
        })

        currentId++

        res.json({login:req.body.login, hash:hash})
    }
    else{
        res.status(401).send({error:"User is already exists"})
    }
})

app.post('/auth', (req,res)=>{
    const {login, password} = req.body
    const userInBase = users.find((user)=> user.login === login)
    if(!userInBase){
        res.status(401).send({error: "Invalid Login/password"})
    }
    console.log(userInBase)
    const isValid = bcrypt.compareSync(password, userInBase.hash)
    if(!isValid){
        res.status(401).send({error:'Invalid Login/password'})
    }else{

        tokens = tokens.filter((token)=> token.login !== login)
        const newToken = jwt.sign({login:req.body.login}, privateKey)
        tokens.push({login, token:newToken})
        res.json({login, token:newToken})
    }
})

app.get('/users', (req,res)=>{
    console.log(req.headers)
    const userToken = tokens.find((token) => token.login == req.headers.login)
    if(!userToken){
        res.status(401).send({error:"Invalid authorization"})
    }
    if(userToken.token === req.headers.token){
        res.json(usersList)
    }
    res.status(410).send({error:"Invalid authorization"})
})



app.listen(5000, ()=> console.log("App listening on port 5000"))