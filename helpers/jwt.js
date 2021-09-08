const jwt = require('jsonwebtoken');
const createError = require('http-errors')
const User = require('../models/user');
const { default: jwtDecode } = require('jwt-decode');



module.exports = {
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]


        jwt.verify(token, 'secret', (err, payload) =>{
            if(err){
                return next(createError.Unauthorized())
            }

            req.payload = payload
            next()
        })
    },

   
}