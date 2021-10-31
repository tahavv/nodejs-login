if(process.env.NODE_ENV !== 'poduction'){
    require('dotenv').config()
}

const express = require('express')
const bcrypt=require('bcrypt')
const passport=require('passport')
const flash=require('express-flash')
const session=require('express-session')
const app = express()
const port=process.env.PORT || 3000

const initializePassport = require('./passport-config')
initializePassport(passport, 
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
    )

const users = []

//middlewares
app.use(express.static(__dirname + '/views/styles'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render('index.ejs')
})

//login page
app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.post('/login',passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))

//sigin page
app.get('/register',(req,res)=>{
    res.render('signin.ejs')
})

app.post('/register', async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
          id: Date.now().toString(),
          username: req.body.name,
          email: req.body.email,
          password: hashedPassword
        })
        res.redirect('/login')
      } catch {
        res.redirect('/register')
      }
      console.log(users)
})

app.listen(port, () => console.log(`App listining on http://localhost:${port}`))