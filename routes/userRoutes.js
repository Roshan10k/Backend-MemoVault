//import the express library
const express =require('express')

const router=express.Router();
const userController =require('../controllers/userController.js');



router.post('/create_user',userController.createUser);
router.get('/show_user',userController.getUsers);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);


module.exports=router;
