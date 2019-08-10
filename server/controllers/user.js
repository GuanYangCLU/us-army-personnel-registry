const UserService = require('../services/user');
const UserModel = require('../models/user');

const createNewUser = async userData => {
  try {
    if (!userData.superior || !userData.superiorname) {
      return await UserService.createUserWithoutSuperior(userData);
    } else {
      return await UserService.createUserWithSuperior(userData);
    }
  } catch (err) {
    console.log(err);
    throw new Error('Failed to create new user in controller: ' + err);
  }
};

const deleteUser = async userId => {
  try {
    const user = await UserModel.getUserById(userId);

    if (!user.superior) {
      if (user.directsubordinates.length === 0) {
        // No Sup && No Sub
        return await UserService.deleteUserNoSupNoSub(userId);
      } else {
        // No Sup but Has Sub
        return await UserService.deleteUserNoSupHasSub(userId);
      }
    } else {
      if (user.directsubordinates.length === 0) {
        // Has Sup but No Sub
        return await UserService.deleteUserHasSupNoSub(userId, user.superior);
      } else {
        // Has Sup && Has Sub
        return await UserService.deleteUserHasSupHasSub(
          userId,
          user.superior,
          user.superiorname,
          user.directsubordinates
        );
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('Failed to delete user in controller: ' + err);
  }
};

const updateUser = async (userId, userData) => {
  try {
    const user = await UserModel.getUserById(userId);

    // Name check
    if (user.name.toString() !== userData.name.toString()) {
      if (user.directsubordinates.length > 0) {
        await UserModel.updateUserSuperior(userId, userId, userData.name);
      }
    }

    if (!user.superior) {
      if (!userData.superior) {
        // No Sup -> No Sup
        return await UserService.updateUserNoSupUpdate(userId, userData);
      } else {
        // No Sup -> Has Sup
        return await UserService.updateUserNoSupToHasSup(userId, userData);
      }
    } else {
      if (!userData.superior) {
        // Has Sup -> No Sup
        return await UserService.updateUserHasSupToNoSup(
          userId,
          user.superior,
          userData
        );
      } else {
        if (user.superior.toString() === userData.superior.toString()) {
          // Has Sup A -> Has Sup A
          return await UserService.updateUserNoSupUpdate(userId, userData);
        } else {
          // Has Sup A -> Has Sup B
          return await UserService.updateUserHasSupAToHasSupB(
            userId,
            user.superior,
            userData
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update user in controller: ' + err);
  }
};

module.exports = {
  createNewUser,
  deleteUser,
  updateUser
};
