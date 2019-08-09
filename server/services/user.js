const UserModel = require('../models/user');

const createUserWithoutSuperior = async userData => {
  try {
    // Unify data format
    userData = { ...userData, superior: null, superiorname: null };
    return await UserModel.createUser(userData);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to create new user in service: ' + err);
  }
};

const createUserWithSuperior = async userData => {
  try {
    const user = await UserModel.createUser(userData);
    // Must create user then we can get user's id
    await UserModel.addUserSubordinates(userData.superior, user._id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error('Failed to create new user in service: ' + err);
  }
};

// -------------------
const deleteUserNoSupNoSub = async userId => {
  try {
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in service: ' + err);
  }
};

const deleteUserNoSupHasSub = async userId => {
  try {
    await UserModel.deleteUserSuperior(userId);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in service: ' + err);
  }
};

const deleteUserHasSupNoSub = async (userId, superiorId) => {
  try {
    // const ds = 0;
    await UserModel.deleteUserSubordinates(superiorId, userId, []);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in service: ' + err);
  }
};

const deleteUserHasSupHasSub = async (
  userId,
  superiorId,
  directsubordinates
) => {
  try {
    await UserModel.deleteteUserSubordinates(
      superiorId,
      userId,
      directsubordinates
    );
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in service: ' + err);
  }
};

// {
//   Soldier.findById({ _id: req.params.soldierId })
//     .then(soldier => {
//       // soldier to be deleted
//       const deleteId = req.params.soldierId;
//       const deleteDs = [...soldier.directsubordinates];
//       const superiorId = soldier.superior;

//       Soldier.findById({ _id: superiorId })
//         .then(soldier => {
//           //   console.log('A ', soldier.directsubordinates);
//           //   console.log('B ', deleteId);
//           soldier.directsubordinates = [
//             ...soldier.directsubordinates.filter(
//               ds => ds.soldierId.toString() !== deleteId.toString()
//               // here, two types are different by testing
//             ),
//             ...deleteDs
//           ];
//           //   console.log('C ', soldier.directsubordinates);
//           soldier
//             .save() // save is necessary!
//             .then(() => {
//               Soldier.findByIdAndDelete({ _id: req.params.soldierId })
//                 .then(soldier => res.status(200).json(soldier))
//                 .catch(err =>
//                   res.status(500).json({ error: 'Failed to delete' })
//                 );
//             })
//             .catch(err =>
//               res.status(500).json({ error: 'Failed to delete' + err })
//             );
//         })
//         .catch(err =>
//           res.status(500).json({ error: 'Failed to delete' + err })
//         );
//     })
//     .catch(err => res.status(500).json({ error: 'Failed to create' + err }));
// }
module.exports = {
  createUserWithoutSuperior,
  createUserWithSuperior,
  deleteUserNoSupNoSub,
  deleteUserNoSupHasSub,
  deleteUserHasSupNoSub,
  deleteUserHasSupHasSub
};
