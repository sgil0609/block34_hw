const router = require('express').Router();
const { fetchRestaurant } = require('../../db');

router.get('/', async (req, res, next) => {
  try {
    const restaurant = await fetchRestaurant();
    res.status(200).send(restaurant);
  } catch (error) {
    next(error)
  }
});

module.exports = router;