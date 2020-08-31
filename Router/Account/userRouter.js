var router = require('express').Router();
var userController = require('../../Controller/Account/userController');
const auth = require('../../Middleware/authentication');

router.post('/signin',userController.signIn);
router.post('/signup',userController.signUp);
router.post('/uploadphoto',auth,userController.uploadPhoto);
router.get('/profile/:_id?', auth, userController.userProfile);



module.exports = router;