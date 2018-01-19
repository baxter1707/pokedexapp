
const expressValidator = require('express-validator')
const mustacheExpress = require('mustache-express')
const methodOverride = require('method-override')
const session = require('express-session')
const bodyParser = require('body-parser')
const models = require('./models')
const express = require('express')
const multer = require('multer')
const path = require('path')
const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use('/uploads', express.static('uploads'))
app.use('/public', express.static('public'))
app.engine('mustache', mustacheExpress())
app.use(methodOverride('_method'))
app.set('view engine', 'mustache')
app.use(expressValidator())
app.set('views', './views')

app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true
}))

const storage = multer.diskStorage({
  destination : './uploads/',
  filename : ( (req,file,cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  })
})

const upload = multer({
  storage : storage
})

// STARTING POINT FOR THE ROUTES / GETS
// REDIRECT TO THE HOME PAGE


// Displat the user's caught pokemon
app.get('/userpokemon', (req,res) => {
  models.users.findAll({
    where : {
      id : 29
    }, include : [{
      required : false,
      model : models.pokemon
    }], raw : false
  }).then((user) => {
    res.render("userspokemon", {user:user})
  })
})

app.get('/', (req,res) => {
  res.redirect('/home')
})

// ROUTE FOR HOME PAGE AND DISPLAY ALL POKEMON
app.get('/home',(req,res) => {
  models.pokemon.findAll({
    order: [
      ['pokeid']
    ]
  }).then(pokemon => {
    res.render('home', {
      pokemon:pokemon,
      username : req.session.username,
      userId : req.session.userId
    })
  })
})

app.get('/jsonpokemon', (req,res) => {
  models.pokemon.findAll({
    order: [
      ['pokeid']
    ]
  }).then((pokemon) =>{
    res.json({pokemon:pokemon})
  })
})

app.get('/home/grass', (req,res)=> {
  models.pokemon.findAll({
    where:{
      type : 'Grass'
    }
  }).then((pokemon) =>{
    res.render('pokemontype', {pokemon:pokemon, username : req.session.username})
  })
})

app.get('/home/bug', (req,res)=> {
  models.pokemon.findAll({
    where:{
      type : 'Bug'
    }
  }).then((pokemon) =>{
    res.render('pokemontype', {pokemon:pokemon, username : req.session.username})
  })
})

app.get('/home/flying', (req,res)=> {
  models.pokemon.findAll({
    where:{
      type : 'Flying'
    }
  }).then((pokemon) =>{
    res.render('pokemontype', {pokemon:pokemon, username : req.session.username})
  })
})

app.get('/home/fire', (req,res)=> {
  models.pokemon.findAll({
    where:{
      type : 'Fire'
    }
  }).then((pokemon) =>{
    res.render('pokemontype', {pokemon:pokemon, username : req.session.username})
  })
})

app.get('/home/normal', (req,res)=> {
  models.pokemon.findAll({
    where:{
      type : 'Normal'
    }
  }).then((pokemon) =>{
    res.render('pokemontype', {pokemon:pokemon, username : req.session.username})
  })
})

app.get('/home/electric', (req,res)=> {
  models.pokemon.findAll({
    where:{
      type : 'Electric'
    }
  }).then((pokemon) =>{
    res.render('pokemontype', {pokemon:pokemon, username : req.session.username})
  })
})

// ROUTE FOR USERS TO BE DISPLAYED IN A JSON FORMAT
app.get('/home/users', (req,res) => {
  models.users.findAll().then((users) =>{
    res.send(users)
  })
})

app.get('/home/createpokemon', (req,res) => {
  res.render('createpokemon')
})

// ROUTE FOR REGISTERUER PAGE
app.get('/home/registeruser', (req,res) => {
  res.render('registeruser')
})

// ROUTE FOR LOGIN PAGE
app.get('/home/userlogin', (req,res) => {
    res.render('userlogin')
})

// LOGOUT USER
app.get('/home/userlogout', (req,res) => {
  req.session.destroy((err) => {})
  res.redirect('/home')
})

// USER ID ROUTE
app.get('/home/:id', (req,res) => {
  res.render('showuser', {
    username : req.session.username
  })
})

// SHOW POKEMON ID ROUTE
app.get('/home/pokemon/:id', (req,res) => {
  models.pokemon.findAll({
    where:{
      id : req.params.id
    }
  }).then((pokemon) => {
    res.render('showpokemon', {
      pokemon : pokemon,
      username : req.session.username
    })
  })
})

// ROUTE FOR JSON OF POKEMON
app.get('/home/pokemon/:id/json', (req,res) => {
  models.pokemon.findAll({
    where:{
      id : req.params.id
    }
  }).then((pokemon) =>{
    res.json({pokemon:pokemon})
  })
})

// POKEMON UPDATE ROUTE
app.get('/home/pokemon/:id/update', (req,res) => {
  models.pokemon.findAll({where: { id : req.params.id}}).then((pokemon) => {
    res.render('updatepokemon',{
      pokemon : pokemon,
      username : req.session.username
    })
  })
})

// STARTING POINT FOR THE POSTS
// REGISTERING THE USER
app.post('/home/registeruser', (req,res) => {
  const user = models.users.build({
    username: req.body.username, password: req.body.password,
    firstname: req.body.firstname, lastname: req.body.lastname,
    email: req.body.email
  })
  user.save().then((user) => {
    req.username = user.username
    req.session.authenticated = true
    res.redirect('/home/userlogin')
  })
})

// LOGGING IN THE USER
app.post('/home/userlogin', (req,res) => {
  var user = models.users.findOne({
    where:{
      username : req.body.username,
      password : req.body.password
    }
    // give me the user
  }).then(user => {
    if(user.password == req.body.password) {
      req.session.username = req.body.username
      req.session.userId = user.dataValues.id
      req.session.authenticated = true
      res.redirect('/home')
    } else {
      res.send('Login attempt failed')
    }
  })
})

// INSERTING POKEID AND USERID INTO USERTOPOKEMON TABLE
app.post('/home/catchpokemon/:id', (req,res) => {
  models.usertopokemon.create({
    userid : req.session.userId,
    pokeid : req.params.id
  }).then(() => {
    res.send('You have added a new pokemon')
  })
})

// CREATE A POKEMON
app.post('/home/createpokemon', upload.single('pokemonimg'), (req,res) => {
  models.pokemon.create({
    pokeid: req.body.pokeid,
    name: req.body.name,
    type: req.body.type,
    hp: req.body.hp,
    attack: req.body.attack,
    defense: req.body.defense,
    spattack: req.body.spattack,
    spdefense: req.body.spdefense,
    speed: req.body.speed,
    total: req.body.total,
    attackone: req.body.attackone,
    attacktwo: req.body.attacktwo,
    attackthree: req.body.attackthree,
    attackfour: req.body.attackfour,
    desc: req.body.desc,
    weakness: req.body.weakness,
    image: req.file.path
  }).then((pokemon) => {
    res.redirect('/home')
  })
})

// EDIT POKEMON
app.put('/home/pokemon/:id/update?', upload.single('pokemonimg'), (req,res) => {
  models.pokemon.update({
    pokeid: req.body.pokeid,
    name: req.body.name,
    desc: req.body.desc,
    type: req.body.type,
    hp: req.body.hp,
    attack: req.body.attack,
    defense: req.body.defense,
    spattack: req.body.spattack,
    spdefense: req.body.spdefense,
    speed: req.body.speed,
    total: req.body.total,
    attackone: req.body.attackone,
    attacktwo: req.body.attacktwo,
    attackthree: req.body.attackthree,
    attackfour: req.body.attackfour,
    desc: req.body.desc,
    weakness: req.body.weakness,
    image: req.file.path
  }, { where : {
    id : req.params.id
  }}).then(() => {
    res.redirect('/home')
  })
})


// LISTEN TO ROUTES
app.listen(3000, () =>{
  console.log('We are live on channel 3000')
})
