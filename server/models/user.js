const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
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
    type: Schema.Types.ObjectId
    // ref: 'users'
  },
  directsubordinates: [Schema.Types.ObjectId]
});

// const DEFAULT_PROJECTION = { phone: '800-000-0000', __v: 0 };

const User = mongoose.model('user', UserSchema);

const getUsers = async (params = { page: 0, pageSize: 10 }) => {
  let flow = User.find({});
  if (params.page && params.pageSize) {
    //   flow.select(DEFAULT_PROJECTION);
    flow.skip(params.page * params.pageSize);
    flow.limit(params.pageSize);
  }
  return await flow.catch(err => {
    console.log(err);
    throw new Error('error getting users from db');
  });
};

const getUserById = async userId => {
  return await User.findOne({ _id: userId }).catch(err => {
    console.log(err);
    throw new Error(`error getting user by id: ${userId}`);
  });
};

const createUser = async userData => {
  const newUser = new User({
    name: userData.name,
    rank: userData.rank,
    sex: userData.sex,
    startdate: userData.startdate,
    phone: userData.phone,
    email: userData.email,
    avatar: userData.avatar,
    superior: userData.superior,
    superiorname: userData.superiorname
  });
  return await newUser.save().catch(err => {
    console.log(err);
    throw new Error('error creating user');
  });
};

const addUserSubordinates = async (userId, dsId) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { directsubordinates: dsId } },
    { new: true }
  ).catch(err => {
    console.log(err);
    throw new Error('error adding user subordinates');
  });
};

const transferUserSubordinates = async (userId, ds) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: {
        directsubordinates: {
          $each: [...ds]
          // $position: 0
        }
      }
    },
    { new: true }
  ).catch(err => {
    console.log(err);
    throw new Error('error transfering user subordinates');
  });
};

const deleteUserSubordinates = async (userId, dsId) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: {
        directsubordinates: dsId
      }
      // { $pull: { array: { $in: [ "a", "b" ] } } delete many
    },
    { new: true }
  ).catch(err => {
    console.log(err);
    throw new Error('error deleting user subordinates');
  });
};

const deleteUserSuperior = async supId => {
  return await User.updateMany(
    { superior: supId },
    { $set: { superior: null, superiorname: null } },
    { new: true }
  ).catch(err => {
    console.log(err);
    throw new Error('error deleting user superior');
  });
};

const deleteUserById = async userId => {
  // connot add {new: true}, why?
  return await User.findByIdAndDelete({ _id: userId }).catch(err => {
    console.log(err);
    throw new Error(`error deleting user by id: ${userId}`);
  });
};

const updateUserById = async (userId, userData) => {
  if (userData.superior === '' || userData.superiorname === '') {
    // if you don't pass sth, it may send an empty string
    // while id is not a simple string
    userData.superior = null;
    userData.superiorname = null;
  }
  return await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userData.name,
        rank: userData.rank,
        sex: userData.sex,
        startdate: userData.startdate,
        phone: userData.phone,
        email: userData.email,
        avatar: userData.avatar,
        superior: userData.superior,
        superiorname: userData.superiorname
      }
    },
    { new: true }
  ).catch(err => {
    console.log(err);
    throw new Error(`error updating user by id: ${userId}`);
  });
};

const updateUserSuperior = async (supId, newSupId, newSupName) => {
  return await User.updateMany(
    { superior: supId },
    { $set: { superior: newSupId, superiorname: newSupName } },
    { new: true }
  ).catch(err => {
    console.log(err);
    throw new Error('error updating user superior');
  });
};

module.exports = {
  model: User,
  getUsers,
  getUserById,
  createUser,
  addUserSubordinates,
  deleteUserSubordinates,
  deleteUserSuperior,
  deleteUserById,
  transferUserSubordinates,
  updateUserById,
  updateUserSuperior
};
