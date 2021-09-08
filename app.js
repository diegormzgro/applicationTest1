const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { verifyAccessToken } = require('./helpers/jwt')

require('dotenv/config');


const producsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const projectsRouter = require('./routers/projects')

//Midleware
app.use(express.json());


//routes
app.use('/products', producsRouter)
app.use('/users', usersRouter)
app.use('/projects', projectsRouter)


app.get('/dashboard', verifyAccessToken, (req, res) => {
    res.send('Dashboard page')
})

app.get('*', function(req, res){
    res.send('route not found', 404);
  });


//DATABASE connection
mongoose.connect(process.env.CONNECTIONDB)
.then(()=>{
    console.log('Database connectino is ready')
})
.catch(()=>{
    console.log(err)
})
// middleware to catch non-existing routes


app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })

app.listen(3001, ()=>{
    console.log('server is running in http://localhost:3001')
})