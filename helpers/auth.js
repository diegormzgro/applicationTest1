const User = require('../models/user')
const Project = require('../models/project')
const createError = require('http-errors')



const { default: jwtDecode } = require('jwt-decode');
const {ROLE, canViewProject } = require('./permissions')


function authRole(role){
    
    return async (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]

        let decoded = jwtDecode(token)
        //console.log(decoded)

        //const myemail = req.body.email;
       let user = await User.findById(decoded.userId)
      // console.log(user)

       if(!user) {
           return res.status(400).send('invalid request')
       }

        if(user.role !== role) {
            res.status(401)
            return res.send('you dont have permissions for this resource')
        }

        next()
    }
}

function authGetProject() {
    return async (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]

        let decoded = jwtDecode(token)
        //console.log(decoded)

        //const myemail = req.body.email;
        let project = await Project.findById(req.params.id)
      //  console.log(project)
        if(!project) {
            return res.status(400).send('invalid request')
        }
        
        let abcde = JSON.stringify(project.user) 
        let var1 = `"${decoded.userId}"`
        
      //  console.log(var1, abcde )

       if(var1 !== abcde){
           res.status(401)
           return res.send('Resources Not allowed for you')
       }

       next()
      
      

      // }
    

       
    }
}

function scopedProjects(req, res, next) {

}


module.exports = {
    authRole, 
    authGetProject
}