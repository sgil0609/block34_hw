const router = require('express').Router();
const { fetchCustomer, deleteReservation, createReservation } = require('../../db');

router.get('/', async (req, res, next) => {
  try {
    const Customers = await fetchCustomer();
    res.status(200).send(Customers);
  } catch (error) {
    next(error)
  }
})

router.delete('/:customer_id/:reservation/:id', async (req, res, next) => {
  try {
    await deleteReservation({customer_id: req.params.customer_id, id: req.params.id});
    res.status(204);
  } catch (error) {
    next(error)
  }
})

router.post('/:customer_id/:reservation', async (req, res, next) => {
  try {
    const Reservation = await createReservation({customer_id: req.params.customer_id, restaurant_id: req.body.restaurant_id, party_count: req.body.party_count, date:req.body.date});
    res.status(201).send(Reservation);
  } catch (error) {
    next(error)
  }
})

module.exports = router;