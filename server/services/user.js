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
const updateUserNoSupUpdate = async (userId, userData) => {
  try {
    // console.log(userData);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update user in service: ' + err);
  }
};

const updateUserNoSupToHasSup = async (userId, userData) => {
  try {
    await UserModel.addUserSubordinates(userData.superior, userId);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update user in service: ' + err);
  }
};

const updateUserHasSupToNoSup = async (userId, superiorId, userData) => {
  try {
    // const ds = 0;
    await UserModel.deleteUserSubordinates(superiorId, userId);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update user in service: ' + err);
  }
};

const updateUserHasSupAToHasSupB = async (userId, superiorId, userData) => {
  try {
    await UserModel.addUserSubordinates(userData.superior, userId);
    await UserModel.deleteUserSubordinates(superiorId, userId);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update user in service: ' + err);
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
    await UserModel.deleteUserSubordinates(superiorId, userId);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in service: ' + err);
  }
};

const deleteUserHasSupHasSub = async (
  userId,
  superiorId,
  superiorName,
  directsubordinates
) => {
  try {
    await UserModel.transferUserSubordinates(superiorId, directsubordinates);
    await UserModel.deleteUserSubordinates(superiorId, userId);
    await UserModel.updateUserSuperior(userId, superiorId, superiorName);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in service: ' + err);
  }
};

const getValidSuperiors = async userId => {
  try {
    const allUsers = await UserModel.getAllUsers();
    const subordinates = await UserModel.getSubordinates(userId);
    const subList = subordinates.map(id => id.toString());
    const invalidList = [...subList, userId];
    // _id is an object, not a string, use immutable compare
    return allUsers.filter(
      user => invalidList.indexOf(user._id.toString()) === -1
    );
  } catch (err) {
    console.log(err);
    throw new Error('Failed to get valid superior in service: ' + err);
  }
};

module.exports = {
  createUserWithoutSuperior,
  createUserWithSuperior,
  deleteUserNoSupNoSub,
  deleteUserNoSupHasSub,
  deleteUserHasSupNoSub,
  deleteUserHasSupHasSub,
  updateUserNoSupUpdate,
  updateUserNoSupToHasSup,
  updateUserHasSupToNoSup,
  updateUserHasSupAToHasSupB,
  getValidSuperiors
};
