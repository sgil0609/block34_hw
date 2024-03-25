const router = require('express').Router();

router.use('/customers', require('./customers')); 
router.use('/restaurant', require('./restaurant'));
router.use('/reservation', require('./reservation'));

module.exports = router;