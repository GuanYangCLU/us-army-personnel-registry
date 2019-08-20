const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const UserService = require('../services/user');
const UserController = require('../controllers/user');

// searchText, sortType, pageSize or limit, pageNumber or page/offset
// params : mongoose paginate
// For frontend, ban __NO_SEARCH_TEXT__ input as the invalid input

router.get(
  '/:pageSize/:pageNumber/:sortType/:searchText/:superiorId',
  async (req, res) => {
    try {
      if (req.params.searchText === '__NO_SEARCH_TEXT__') {
        req.params.searchText = '';
      }
      if (req.params.superiorId === '__NO_SUPERIOR_ID__') {
        req.params.superiorId = null;
      }
      const query = {
        pageSize: req.params.pageSize,
        pageNumber: req.params.pageNumber,
        sortType: req.params.sortType,
        searchText: req.params.searchText,
        superiorId: req.params.superiorId
      };
      const users = await UserModel.getUsers(query);
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json({ error: 'No user found: ' + err });
    }
  }
);

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

// Get Valid superior choices (Loop Check)
router.get('/loopsafe/:userId', async (req, res) => {
  try {
    // res an array
    const validSuperiors = await UserService.getValidSuperiors(
      req.params.userId
    );
    res.status(200).json({
      code: 0,
      data: { validSuperiors }
    });
  } catch (err) {
    res
      .status(404)
      .json({ error: 'No valid superiors found by this id: ' + err });
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
