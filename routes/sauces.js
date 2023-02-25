// Import express
const express = require('express');
const router = express.Router();

// Import middelware auth and multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import controllers
const sauceCtrl = require('../controllers/sauces');


// Root create
router.post('/', auth, multer, sauceCtrl.createSauce);
// Root all sauces
router.get('/', auth, sauceCtrl.getAllSauces);
// Root one sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); 
// Root update
router.put('/:id', auth, multer, sauceCtrl.updateOne); 
// Root delete
router.delete('/:id', auth, sauceCtrl.delete);
// Root like/dislike
router.post('/:id/like', auth,  sauceCtrl.likes);



module.exports = router;