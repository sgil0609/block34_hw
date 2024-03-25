const router = require('express').Router();
const { fetchReservation } = require('../../db');

router.get('/', async (req, res, next) => {
  try {
    const reservations = await fetchReservation();
    res.status(200).send(reservations);
  } catch (error) {
    next(error)
  }
});
module.exports = router;