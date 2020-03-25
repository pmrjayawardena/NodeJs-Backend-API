const express = require('express');

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');
const User = require('../models/User');

const advancedResults = require('../middleware/advancedResults');

const courseRouter = require('./courses');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
//Re-route into other resouce routers

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
