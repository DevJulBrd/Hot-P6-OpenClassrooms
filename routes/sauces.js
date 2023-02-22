const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauces');



router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce); 
router.put('/:id', auth, multer, sauceCtrl.updateOne); 
router.delete('/:id', auth, sauceCtrl.delete);
router.post('/:id/like', auth, sauceCtrl.likes);



module.exports = router;