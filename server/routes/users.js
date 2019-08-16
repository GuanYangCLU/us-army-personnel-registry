const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
// const UserService = require('../services/user');
const UserController = require('../controllers/user');

// searchText, sortType, pageSize or limit, pageNumber or page/offset
// params : mongoose paginate

router.get('/:pageSize/:pageNumber/:sortType/:searchText', async (req, res) => {
  try {
    if (req.params.searchText === '__NO_SEARCH_TEXT__') {
      req.params.searchText = '';
    }
    const query = {
      pageSize: req.params.pageSize,
      pageNumber: req.params.pageNumber,
      sortType: req.params.sortType,
      searchText: req.params.searchText
    };
    const users = await UserModel.getUsers(query);
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

module.exports = router;
