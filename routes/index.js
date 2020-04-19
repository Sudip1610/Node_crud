const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Post= require('../models/Posts');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  User.findOne({name:req.user.name}).
    populate('posts').
    exec((err,post)=>{
      if(err){
        return handleError(err);
      }
      res.render('dashboard',{
        user:post
      })
    })
);

router.get('/createPost', ensureAuthenticated, (req, res) =>
  res.render('post',{
    user:req.user
  })
);

//Delete
router.get('/delete/:id',ensureAuthenticated, (req, res) =>{
  console.log(req.params.id);
  Post.findByIdAndRemove(req.params.id).then(
    () => {
      req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
      res.redirect('/dashboard')
    }
  ).catch(
    (error) => {
      req.flash('error', err)
      res.redirect('/dashboard')
      });
})

router.get('/edit/:id',ensureAuthenticated, (req, res) =>{
  res.render('post_edit',{
    user:req.user
  })
})

router.post('/update/:id',ensureAuthenticated, async(req, res) =>{
    await Post.findOneAndUpdate({_id:req.params.id}, 
      {title: req.body.title,body:req.body.body}, {
      new: true
    }).then(()=>{
      req.flash('success', 'Customer updated successfully! id = ' + req.params.id)
      res.redirect('/dashboard')
    }).catch((err)=>{
      console.log(err);
      res.redirect('/dashboard')
    })
    
});


module.exports = router;
