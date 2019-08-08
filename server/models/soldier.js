const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoldierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  startdate: {
    type: Date,
    // required: true,
    default: Date.now
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    // required: true,
    default: '../../public/avatar/default.png'
  },
  superiorname: {
    type: String
  },
  superior: {
    type: Schema.Types.ObjectId,
    ref: 'soldiers'
  },
  directsubordinates: [
    {
      //   soldierId: {
      type: Schema.Types.ObjectId,
      ref: 'soldiers'
      //   }
    }
  ]
});

const Soldier = mongoose.model('soldier', SoldierSchema);

module.exports = Soldier;
