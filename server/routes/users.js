const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
// const UserService = require('../services/user');
const UserController = require('../controllers/user');

router.get('/', async (req, res) => {
  try {
    const users = await UserModel.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ error: 'No user found: ' + err });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.userId);
    res.status(200).json({
      code: 0,
      data: { user }
    });
  } catch (err) {
    res.status(404).json({ error: 'No user found by this id: ' + err });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const user = await UserController.createNewUser(req.body);
    res.status(200).json({
      code: 0,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create: ' + err });
  }
});

// Edit user
router.put('/:userId', async (req, res) => {
  try {
    const user = await UserController.updateUser(req.params.userId, req.body);
    res.status(200).json({
      code: 0,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update: ' + err });
  }
});

// Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const user = await UserController.deleteUser(req.params.userId);
    res.status(200).json({
      code: 0,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' + err });
  }
});

// Sort user
// sortType, searchWord, pageNumber

// params : mongoose paginate
router.get('/sort/:sortType', async (req, res) => {
  try {
    const user = await UserController.sortUsers(req.params.sortType);
    res.status(200).json({
      code: 0,
      data: { user }
    });
  } catch (err) {
    res.status(404).json({ error: 'No user found : ' + err });
  }
});

module.exports = router;
