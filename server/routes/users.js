//LIBRARIES IMPORT
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//USER and Middleware import 
const upload = require('../middleware/upload-photo')
const User = require('../models/user')
const auth = require('../middleware/auth')


//POST request - register
router.post('/signup', upload.single('photo'), async(req,res) => {
        if(!req.body.email || !req.body.password){
            res.json({
                success: false,
                message: 'Please enter email or password'
            })
        }else{
            try {
                const name = req.body.name
                const email = req.body.email
                const password = req.body.password
                const encryptedPassword = bcrypt.hashSync(password, 10)
                const photo = req.file.location
                
                const newUser = {
                    name: name,
                    email: email,
                    password: encryptedPassword,
                    photo:photo
                }

                const user = await User.create(newUser)
                
                console.log(user);
                res.json({
                    success: true,
                    message: 'User created'
                })

            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: 'Error to create a user'
                })
            }


        }
    
})

//POST request - login
router.post('/signin', async(req,res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        var user = await User.findOne({email:email})
    
        //NO USER
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
    
        //if email and password ok
      if (bcrypt.compareSync(password, user.password)) {
    
        //we delete de password field
        user.set("password", undefined, { strict: false });
    
        const token = jwt.sign({ userData: user }, process.env.SECRET, {
          expiresIn: 60 * 60 * 24 * 30
        });
    
        const toSend = {
          success: true ,
          token: token,
          userData: user
        };
    
        return res.json(toSend);
        }
        
    } catch (error) {
        return res.status(400).json({
            message: 'Ocurred an error',
            error: error
        })
    }

})

//POST request - get user
router.post('/user/:id', auth, async(req,res) => {
    const _id = req.params.id

    try {
        let foundUser = await User.findOne({_id})
        if (foundUser) {
            res.json({
                success: true,
                user: foundUser
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
})

module.exports = router