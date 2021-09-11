const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const User = require('../models/user');
const { verifyAccessToken } = require('../helpers/jwt')




router.get(`/`, async (req, res) =>{
    
     Product.find().then(
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

router.get('/:id', async (req,res) =>{
    Product.findById(req.params.id).then(
        result => {
            if(!result){
                res.status(403).send("product not found")
            }
            res.send(result)
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
    Product.findByIdAndUpdate(
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
    if(!user) return res.status(400).send('Invalid product');

    
    let product = new Product({
        name: req.body.name,
        user: req.body.user,
        
    })

    product.save().then(
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
    Product.findByIdAndRemove(req.params.id).then(
        product => {
            if(product){
                return res.status(200).json({
                    success: true,
                    message: 'the product was deleted'
                })
            } else {
                return res.status(404).json({
                    success: false, message: 'product was not found'
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
