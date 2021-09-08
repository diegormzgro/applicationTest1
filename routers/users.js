const express = require('express')
const router = express.Router();
const User = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { verifyAccessToken } = require('../helpers/jwt')
const { authRole } = require('../helpers/auth')

router.get(`/`, verifyAccessToken, authRole('ADMIN'),  async (req, res) =>{
    
    User.find().then(
        result => {
            res.status(200).send(result)
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

router.get('/admin', verifyAccessToken, authRole('ADMIN'), (req, res) => {
    res.send('Admin page')
})

router.get('/client', verifyAccessToken, authRole('CLIENT'), (req, res) => {
    res.send('Client page')
})

router.get('/seller', verifyAccessToken, authRole('SELLER'), (req, res) => {
    res.send('Seller page')
})



router.get('/dashboard', verifyAccessToken, (req, res) => {
    res.send('Dashboard users page, only users logged ')
})

router.post('/', (req, res) =>{
    let user = new User({
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
    })

    user.save().then(
        result => {
            res.status(201).json(result)
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err,
                success: false,
                message: 'cannot create user'
            })
        }
    )

    
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return res.status(400).send('User not  found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id
            },
            'secret',
            {expiresIn: '5d'}
        )
       
       
        res.status(200).send({
            user: user.email,
            role: user.role,
            token: token
        })
    }
    else {
        res.status(400).send('password is wrong')
    }
})

module.exports = router;