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

// router.put('/:soldierId', (req, res) => {
//   Soldier.findById({ _id: req.params.soldierId }).then(soldier => {
//     const oldSuperior = soldier.superior;
//     const newSuperior = req.body.superior;
//     if (newSuperior.toString() !== oldSuperior.toString()) {
//       // delete ref from old superior: 'soldier.superior'
//       Soldier.findById({ _id: oldSuperior })
//         .then(soldier => {
//           //   console.log('A ', oldSuperior);
//           //   console.log('B ', soldier.directsubordinates);
//           soldier.directsubordinates = [
//             ...soldier.directsubordinates.filter(
//               ds => ds.soldierId.toString() !== req.params.soldierId.toString()
//             )
//           ];
//           //   console.log('C ', soldier.directsubordinates);
//           soldier
//             .save()
//             .then(() => {
//               // add ref to new superior: 'req.body.superior'
//               Soldier.findById({ _id: newSuperior }).then(soldier => {
//                 soldier.directsubordinates = [
//                   ...soldier.directsubordinates,
//                   { soldierId: req.params.soldierId }
//                 ];
//                 soldier.save().then(() => {
//                   Soldier.findByIdAndUpdate(req.params.soldierId, {
//                     $set: {
//                       name: req.body.name,
//                       rank: req.body.rank,
//                       sex: req.body.sex,
//                       startdate: req.body.startdate,
//                       phone: req.body.phone,
//                       email: req.body.email,
//                       avatar: req.body.avatar,
//                       superior: req.body.superior
//                       // directsubordinates: []
//                     }
//                   })
//                     .then(soldier => res.status(200).json(soldier))
//                     .catch(err =>
//                       res.status(500).json({ error: 'Failed to edit' })
//                     );
//                 });
//               });
//             })
//             .catch(err =>
//               res.status(500).json({ error: 'Failed to delete' + err })
//             );
//         })
//         .catch(err =>
//           res.status(500).json({ error: 'Failed to delete' + err })
//         );
//     }
//   });
// });

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
