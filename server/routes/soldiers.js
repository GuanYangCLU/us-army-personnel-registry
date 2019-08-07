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
    .then(soldier => {
      soldier.directsubordinates = [
        ...soldier.directsubordinates,
        { soldierId: newSoldier._id }
      ];
      // Soldier.findOneAndUpdate(filter, {
      //     directsubordinates: [...res.directsubordinates, { soldierId: newSoldier._id }]
      //   }, { new: true })
      soldier
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
  Soldier.findById({ _id: req.params.soldierId }).then(soldier => {
    const oldSuperior = soldier.superior;
    const newSuperior = req.body.superior;
    if (newSuperior.toString() !== oldSuperior.toString()) {
      // delete ref from old superior: 'soldier.superior'
      Soldier.findById({ _id: oldSuperior })
        .then(soldier => {
          //   console.log('A ', oldSuperior);
          //   console.log('B ', soldier.directsubordinates);
          soldier.directsubordinates = [
            ...soldier.directsubordinates.filter(
              ds => ds.soldierId.toString() !== req.params.soldierId.toString()
            )
          ];
          //   console.log('C ', soldier.directsubordinates);
          soldier
            .save()
            .then(() => {
              // add ref to new superior: 'req.body.superior'
              Soldier.findById({ _id: newSuperior }).then(soldier => {
                soldier.directsubordinates = [
                  ...soldier.directsubordinates,
                  { soldierId: req.params.soldierId }
                ];
                soldier.save().then(() => {
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
                    .catch(err =>
                      res.status(500).json({ error: 'Failed to edit' })
                    );
                });
              });
            })
            .catch(err =>
              res.status(500).json({ error: 'Failed to delete' + err })
            );
        })
        .catch(err =>
          res.status(500).json({ error: 'Failed to delete' + err })
        );
    }
  });
});

// Delete soldier
router.delete('/:soldierId', (req, res) => {
  Soldier.findById({ _id: req.params.soldierId })
    .then(soldier => {
      // soldier to be deleted
      const deleteId = req.params.soldierId;
      const deleteDs = [...soldier.directsubordinates];
      const superiorId = soldier.superior;

      Soldier.findById({ _id: superiorId })
        .then(soldier => {
          //   console.log('A ', soldier.directsubordinates);
          //   console.log('B ', deleteId);
          soldier.directsubordinates = [
            ...soldier.directsubordinates.filter(
              ds => ds.soldierId.toString() !== deleteId.toString()
              // here, two types are different by testing
            ),
            ...deleteDs
          ];
          //   console.log('C ', soldier.directsubordinates);
          soldier
            .save() // save is necessary!
            .then(() => {
              Soldier.findByIdAndDelete({ _id: req.params.soldierId })
                .then(soldier => res.status(200).json(soldier))
                .catch(err =>
                  res.status(500).json({ error: 'Failed to delete' })
                );
            })
            .catch(err =>
              res.status(500).json({ error: 'Failed to delete' + err })
            );
        })
        .catch(err =>
          res.status(500).json({ error: 'Failed to delete' + err })
        );
    })
    .catch(err => res.status(500).json({ error: 'Failed to create' + err }));
});

module.exports = router;
