//IMPORT LIBRARIES
const express = require('express')
const router = express.Router()

//import a model
const Post = require('../models/post')

//import middlewares
const upload = require('../middleware/upload-photo')
const auth = require('../middleware/auth')


//POST request - create post
router.post('/new-post', [auth, upload.single('photo')], async(req,res) => {
    try {
        let post = new Post()
        post.photo = req.file.location
        post.description = req.body.description
        post.user = req.userData._id

        await post.save()

        return res.json({
            success: true,
            message: 'Successfully create a post',
            post: post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error to created a post'
        })
    }
})

router.post('/posts',auth, async(req,res) => {
    try {
        let posts = await Post.find().populate('user')

        return res.json({
            success: true,
            posts: posts
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
})

router.post('/post/:id',auth,async(req,res) => {
    const _id = req.params.id
    try {
        let post = await Post.findOne({_id}).populate('user')

        return res.json({
            success: true,
            post: post
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
})

module.exports = router