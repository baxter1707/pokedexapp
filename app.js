
const expressValidator = require('express-validator')
const mustacheExpress = require('mustache-express')
const methodOverride = require('method-override')
const session = require('express-session')
const bodyParser = require('body-parser')
const models = require('./models')
const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')

const storage =multer.diskStorage({
  destination: './uploads/',
  filename: ((req,file,cb)=>{
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  })
})

const upload= multer({
  storage:storage
})

app.use(bodyParser.urlencoded({extended:false}))
app.use('/public', express.static('public'))
app.engine('mustache', mustacheExpress())
app.use(methodOverride('_method'))
app.set('view engine', 'mustache')
app.use(expressValidator())
app.set('views', './views')
app.use('/uploads', express.static('uploads'))

app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true
}))
/*
models.users.create({

})

models.users.destroy({
  where:{
    id : 34
  }
})
*/

// STARTING POINT FOR THE ROUTES / GETS
// REDIRECT TO THE HOME PAGE
app.get('/', (req,res) => {
  res.redirect('/home')
})

//REDIRECT FROM ACCOUNT TO CREATE Pokemon
app.get('/home/createpokemon', (req,res) =>{
  if(req.session.username != 'baxter1707'){
        res.send("Invalid credentials")
      }else{
        res.render('createpokemon')
      }
  })

// ROUTE FOR HOME PAGE AND DISPLAY ALL POKEMON
app.get('/home',(req,res) => {
  models.pokemon.findAll({
    order: [
      ['pokeid']
    ]
  }).then(pokemon => {
    res.render('home', {
      // access the keys through the view engine
      // access pokemon by calling "pokemon"
      pokemon:pokemon,
      // access the stored session username by calling "username"
      username : req.session.username,
      userId : req.session.userId
    })
  })
})

// ROUTE FOR USERS TO BE DISPLAYED IN A JSON FORMAT
app.get('/home/users', (req,res) => {
  models.users.findAll().then((users) =>{
    res.send(users)
  })
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
  // protocol to end the session (destroy the stored cookie/logout the user)
  req.session.destroy((err) => {})
  res.redirect('/home')
})

// USER ID ROUTE
app.get('/home/:id', (req,res) => {
    models.users.findAll({
      where:{
        id: req.params.id
      }
    }).then((user) =>{
    res.render('showuser', {
      user : user,
      username : req.session.username,
      userid : req.session.userId
    })
  })
})

// SHOW POKEMON ID ROUTE
app.get('/home/pokemon/:id', (req,res) => {
  models.pokemon.findAll({
    where:{
      id: req.params.id
    }
  }).then((pokemon) => {
    res.render('showpokemon', {
      pokemon : pokemon,
      username : req.session.username
    })
  })
})

// STARTING POINT FOR THE POSTS
// REGISTERING THE USER
app.post('/home/registeruser', (req,res) => {
  // assign to user to a constant thencreate a user based on the information
  // given through the mustache template
  const user = models.users.build({
    username: req.body.username, password: req.body.password,
    firstname: req.body.firstname, lastname: req.body.lastname,
    email: req.body.email
  })
  // save the user
  user.save().then((user) => {
    req.username = user.username
    // authenticate the user
    req.session.authenticated = true
    res.redirect('/home/userlogin')
  })
})

// LOGGING IN THE USER
app.post('/home/userlogin', (req,res) => {
  // find the user in the database, assign it to a variable "user"
  var user = models.users.findOne({
    where:{
      username : req.body.username,
      password : req.body.password
    }
    // give me the user
  }).then(user => {
    // if password in "user" matches the entered password through the body
    if(user.password == req.body.password) {
      // assign it to a session. The username is now stored in a session
      //and can be accessed anywhere as shown in the "app.get('/home')"
      req.session.username = req.body.username
      // same goes for the id.
      req.session.userId = user.dataValues.id
      // authenticat the login action like done in registering the user
      req.session.authenticated = true
      res.redirect('/home')
    } else {
      res.send('Login attempt failed')
    }
  })
})

app.post('/home/catchpokemon/:id', (req,res) => {
  models.usertopokemon.create({
    userid : req.session.userId,
    pokeid : req.params.id
  }).then(()=> {
    res.send('Captured')
  })
})

//INSERTING POKEID AND USERID INTO USERTOPOKEMON table
app.post('/home/catchpokemon/:id', (req,res) =>{
  models.usertopokemon.create({
    userid: req.session.userId,
    pokeid: req.params.id
  }).then(function(){
    res.send('You have added a new pokemon')
  })
})

//Creating a Pokemon for the database
app.post('/home/createpokemon', upload.single('pokemonimg'), (req,res)=>{
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
  }).then(function(){
    res.redirect('/home')
  })
})

//EDIT pokemon
app.put('/home/pokemon/:id/update?',upload.single('pokemonimg'),(req,res) =>{
  models.pokemon.update({
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
  },{where: {
    id: req.params.id
  }}).then(function(){
    res.redirect('/home')
  })
})

app.get('/home/pokemon/:id/update',(req,res) => {
  models.pokemon.findAll({
    where: {id:req.params.id}
  }).then(function(pokemon){
    res.render('updatepokemon',{
      pokemon: pokemon,
      username: req.session.username
    })
  })
})


//VIEW User pokemon
app.get('/home/:id/showuserpokemon', (req,res) => {
  models.users.findAll({
      where : {
        id : req.session.userId
      }, include : [{
        required : false,
        model : models.pokemon
      }], raw : false
}).then((user) => {
      res.render('viewuserpokemon', {user:user})
    })
  })







// app.delete('/home/pokemon/:id', (req,res) =>{
//   models.pokemon.destroy({
//     where: {id:req.params.id}
//   }).then(function(){
//     res.redirect('/home')
//   })
// })



// models.users.findAll({
//     where : {
//       id : req.session.userId
//     }, include : [{
//       required : false,
//       model : models.pokemon
//     }], raw : false
//   }).then((pokemon) => {
//     res.render('viewuserpokemon', {pokemon:pokemon})
// console.log(pokemon)
//   })
// })


// LISTENING TO ROUTES
app.listen(3000, () =>{
  console.log('We are live on channel 3000')
})
