const express = require('express')
const router = express.Router();
const Project = require('../models/project')
const User = require('../models/user');

const { verifyAccessToken } = require('../helpers/jwt')
const { authRole, authGetProject } = require('../helpers/auth')
const { canViewProject } = require('../helpers/permissions')
const { default: jwtDecode } = require('jwt-decode');

var xml = require('xml');




router.get(`/`, verifyAccessToken, async (req, res) =>{
    
    Project.find().then(
        projects => {
            //let filtered = projects.filter(isAdded
               // let abcde = JSON.stringify(project.user) 
               // project.includes(decoded.userId)
               // console.log(abcde)
                
           // )
           if(!projects){
            res.status(403).send("projects not found")
        }
           
            res.send(projects)
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err,
                success: false
            })
        }
    )

})

router.get('/:id', verifyAccessToken, authGetProject(), async (req,res) =>{
    Project.findById(req.params.id).then(
        result => {
            res.send(result)
            if(!result){
                res.status(403).send("project not found")
            }
        }
    ).catch(
        err => {
            res.status(403).json({
                error: err,
                success: false
            })
        }
    )


 
})

router.put('/update/:id', verifyAccessToken, async (req,res) =>{
    Project.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            
        },
        {
            new: true
        }
    ).then(
        result => {
            if(!result){
                res.status(403).send("product not found")
            }
            res.send(result)
        }
    ).catch(
        err => {
            res.status(400).send(err)
        }
    )

   

    
})

router.post('/create', verifyAccessToken, async (req, res) =>{
    const user = await User.findById(req.body.user)
    if(!user) return res.status(400).send('Parametros invalidos');

    let project = new Project({
        name: req.body.name,
        user: req.body.user,
        
    })

    project.save().then(
        result => {
            
            res.status(201).json(result)
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err,
                success: false
            })
        }
    )

    
})

router.delete('/delete/:id', verifyAccessToken, (req,res)=>{
    Project.findByIdAndRemove(req.params.id).then(
        project => {
            if(project){
                return res.status(200).json({
                    success: true,
                    message: 'the project was deleted'
                })
            } else {
                return res.status(404).json({
                    success: false, message: 'project was not found'
                })
            }
        }
    ).catch(
        err => {
            return res.status(400).json({
                success: false, error: err
            })
        }
    )
})


module.exports = router;