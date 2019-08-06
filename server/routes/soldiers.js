const express = require('express');
const router = express.Router();
const Soldier = require('../models/soldier');

router.get('/', (req, res) => {
  Soldier.find()
    .then(soldiers => res.status(200).json(soldiers))
    .catch(err => res.status(404).json({ error: 'No soldier found' }));
});

// Incase we need this API
router.get('/:soldierId', (req, res) => {
  Soldier.findById({ _id: req.params.soldierId })
    .then(soldier => res.status(200).json(soldier))
    .catch(err =>
      res.status(404).json({ error: 'No soldier found by this id' })
    );
});

// Create soldier
router.post('/', (req, res) => {
  const newSoldier = new Soldier({
    name: req.body.name,
    rank: req.body.rank,
    sex: req.body.sex,
    startdate: req.body.startdate,
    phone: req.body.phone,
    email: req.body.email,
    avatar: req.body.avatar,
    superior: req.body.superior
    //   directsubordinates: []
  });

  const filter = { _id: req.body.superior };

  Soldier.findOne(filter)
    .then(res => {
      res.directsubordinates = [
        ...res.directsubordinates,
        { soldierId: newSoldier._id }
      ];
      // Soldier.findOneAndUpdate(filter, {
      //     directsubordinates: [...res.directsubordinates, { soldierId: newSoldier._id }]
      //   }, { new: true })
      res
        .save()
        .then(() => {
          newSoldier
            .save()
            .then(soldier => res.status(200).json(soldier))
            .catch(err =>
              res.status(500).json({ error: 'Failed to create' + err })
            );
        })
        .catch(err =>
          res.status(500).json({ error: 'Failed to create' + err })
        );
    })
    .catch(err => res.status(500).json({ error: 'Failed to create' + err }));
});

// Edit soldier
router.put('/:soldierId', (req, res) => {
  Soldier.findByIdAndUpdate(req.params.soldierId, {
    $set: {
      name: req.body.name,
      rank: req.body.rank,
      sex: req.body.sex,
      startdate: req.body.startdate,
      phone: req.body.phone,
      email: req.body.email,
      avatar: req.body.avatar,
      superior: req.body.superior
      // directsubordinates: []
    }
  })
    .then(soldier => res.status(200).json(soldier))
    .catch(err => res.status(500).json({ error: 'Failed to edit' }));
});

// Delete soldier
router.delete('/:soldierId', (req, res) => {
  Soldier.findByIdAndDelete({ _id: req.params.soldierId })
    .then(soldier => res.status(200).json(soldier))
    .catch(err => res.status(500).json({ error: 'Failed to delete' }));
});

module.exports = router;
