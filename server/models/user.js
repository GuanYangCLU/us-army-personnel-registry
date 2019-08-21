const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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

// Use mongoose paginate
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('user', UserSchema);

const getAllUsers = async () => {
  let flow = User.find({});
  return await flow.catch(err => {
    console.log(err);
    throw new Error('error getting users from db');
  });
};

const getUsers = async params => {
  const { pageSize, pageNumber, sortType, searchText, superiorId } = params;
  let regex = new RegExp(searchText, 'gim');
  let query = {
    $or: [
      { name: regex },
      { rank: regex },
      { sex: regex },
      // { startdate: regex },
      { phone: regex },
      { email: regex },
      { superiorname: regex }
    ]
  };
  if (superiorId) {
    query = {
      ...query,
      $and: [{ superior: superiorId }]
    };
  }

  const sortOrder = [
    {}, // 0
    { name: 1 }, // 1
    { name: -1 }, // 2
    { sex: 1 }, // 3
    { sex: -1 }, // 4
    { rank: 1 }, // 5
    { rank: -1 }, // 6
    { startdate: 1 }, // 7
    { startdate: -1 }, // 8
    { phone: 1 }, // 9
    { phone: -1 }, // 10
    { email: 1 }, // 11
    { email: -1 }, // 12
    { superiorname: 1 }, // 13
    { superiorname: -1 } // 14
  ];
  const options = {
    // select: '',
    sort: sortOrder[sortType], // obj e.g. { name: -1 }
    // populate: '',
    lean: true, // return JSON not doc
    // offset: 20,
    page: pageNumber,
    limit: pageSize
  };
  let flow = User.paginate(query, options);
  // if (params.page && params.pageSize) {
  //   //   flow.select(DEFAULT_PROJECTION);
  //   flow.skip(params.page * params.pageSize);
  //   flow.limit(params.pageSize);
  // }
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
  // cannot add {new: true}, why?
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

const getSubordinates = async userId => {
  try {
    let rs = await getUserById(userId);
    let rsArr = rs.directsubordinates;
    // let rs = await getUserById(userId).directsubordinates;
    if (rs.directsubordinates.length === 0) return [];
    for (let i = 0; i < rs.length; i++) {
      let ds = await getSubordinates(rs[i]);
      let dsArr = ds.directsubordinates;
      rsArr = [...rsArr, ...dsArr];
    }
    return rsArr;
  } catch (err) {
    console.log(err);
    throw new Error('error geting user subordinates');
  }
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
  updateUserSuperior,
  getAllUsers,
  getSubordinates
};
