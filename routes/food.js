const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const foodCtrl = require('../controllers/food');
const multer = require('../middleware/multer-config');

router.get('/', auth, foodCtrl.getAllSauce);
router.post('/', auth, multer, foodCtrl.createSauce);
router.post('/:id/like', foodCtrl.like);
//router.post('/:id/dislike', foodCtrl.dislike);
router.get('/:id', auth, foodCtrl.getOneSauce);
router.put('/:id', auth, multer, foodCtrl.modifySauce);
router.delete('/:id', auth, foodCtrl.deleteSauce);

module.exports = router;