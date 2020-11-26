const express = require('express');
const app = express();
const router = express.Router();
const {model:{User,Restaurant,Reservation}}=require('../db')
const chalk = require('chalk');
const path = require('path');

router.use(express.json())

router.use('/dist', express.static(path.join(__dirname, '../dist')));

router.use((err, req, res, next) => {
    console.log(chalk.red(err.stack));
    res.status(500).send({ error: err.message });
  });

router.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, '../index.html'))
);

router.get('/api/users', async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (ex) {
    next(ex);
  }
});

router.get('/api/restaurants', async (req, res, next) => {
  try {
    res.send(await Restaurant.findAll());
  } catch (ex) {
    next(ex);
  }
});

router.get('/api/reservations', async (req, res, next) => {
    try {
      res.send(await Reservation.findAll({
          include:[Restaurant]
      }));
    } catch (ex) {
      next(ex);
    }
  });

router.get('/api/users/:userId/reservations', async (req, res, next) => {
  try {
    res.send(
      await Reservation.findAll({
        where: { userId: req.params.userId },
        include: [Restaurant],
        order: ['id']
      })
    );
  } catch (ex) {
    next(ex);
  }
});

router.post('/api/users/:userId/reservations', async (req, res, next) => {
  try {
    const reservation = await Reservation.create({
        userId: req.params.userId,
        restaurantId: req.body.restaurantId
      })
res.send(reservation);
  } catch (ex) {
    next(ex);
  }
});

router.delete('/api/reservations/:id', async (req, res, next) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    await reservation.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router

