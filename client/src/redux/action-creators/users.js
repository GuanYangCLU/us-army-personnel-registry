import axios from 'axios';

const setUserListStart = () => {
  return {
    type: 'SET_USER_LIST_START',
    payload: { error: null, deleteError: null } // init
  };
};

const setUserListSuccess = (data, config) => {
  // if (config !== null) {
  //   console.log('IAM CONF: ', config);
  //   return {
  //     type: 'SET_USER_LIST_SUCCESS',
  //     payload: { users: data, pageInfo, config }
  //   };
  // } else {
  //   return {
  //     type: 'SET_USER_LIST_SUCCESS',
  //     payload: { users: data, pageInfo }
  //   };
  // }
  return {
    type: 'SET_USER_LIST_SUCCESS',
    payload: { users: data, config }
  };
};

const setUserListError = err => {
  return {
    type: 'SET_USER_LIST_ERROR',
    payload: { error: err }
  };
};

const noMoreUsers = () => {
  return {
    type: 'NO_MORE_USERS',
    payload: { alertContent: 'No more soldiers!' }
  };
};

export const setUserList = config => dispatch => {
  dispatch(setUserListStart());
  const { pageSize, pageNumber, sortType, searchText, superiorId } = config;
  // console.log(config);
  // console.log(pageNumber, searchText);
  axios
    .get(
      `http://localhost:5000/api/users/${pageSize}/${pageNumber}/${sortType}/${searchText}/${superiorId}`
    )
    .then(res => {
      // console.log('success', res.data.docs);
      // const pageInfo = {
      //   hasPrevPage: res.data.hasPrevPage,
      //   hasNextPage: res.data.hasNextPage,
      //   prevPage: res.data.prevPage,
      //   nextPage: res.data.nextPage
      // };
      dispatch(setUserListSuccess(res.data.docs, config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const loadNextPage = (config, users) => dispatch => {
  // if (payload.users.length / payload.config.pageSize < payload.config.pageNumber - 1) {
  //   dispatch(fixPageNumber);
  //   return
  // // }
  // dispatch(setUserListStart());
  const { pageSize, pageNumber, sortType, searchText, superiorId } = config;
  // console.log(config);
  axios
    .get(
      `http://localhost:5000/api/users/${pageSize}/${pageNumber}/${sortType}/${searchText}/${superiorId}`
    )
    .then(res => {
      // console.log('success', res.data.docs);
      // const pageInfo = {
      //   hasPrevPage: res.data.hasPrevPage,
      //   hasNextPage: res.data.hasNextPage,
      //   prevPage: res.data.prevPage,
      //   nextPage: res.data.nextPage
      // };

      // if (!res.data.hasNextPage) {
      //   // dispatch(noMoreUsers());
      //   throw new Error('No more soldiers');
      // } else {
      // setTimeout(() => {
      dispatch(setUserListSuccess(users.concat(res.data.docs), config));
      // setUsers(fakeD);
      // }, 1500);
      // }
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const resetConfig = () => dispatch => {
  dispatch(setUserListStart());
  // Initialize Config
  const config = {
    pageSize: 6,
    pageNumber: 1,
    sortType: 0,
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: '__NO_SUPERIOR_ID__'
  };
  // console.log(config);
  // console.log(pageNumber, searchText);
  axios
    .get(
      `http://localhost:5000/api/users/${config.pageSize}/${
        config.pageNumber
      }/${config.sortType}/${config.searchText}/${config.superiorId}`
    )
    .then(res => {
      // console.log('WWsuccess', res.data.docs);
      // console.log('WOW: ', config);
      // config = {
      //   ...config,
      //   pageNumber: 2
      // };
      // const pageInfo = {
      //   hasPrevPage: false,
      //   hasNextPage: true,
      //   prevPage: null,
      //   nextPage: 2
      // };
      config.pageNumber++;
      dispatch(setUserListSuccess(res.data.docs, config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

const setSuperiorListStart = () => {
  return {
    type: 'SET_SUPERIOR_LIST_START',
    payload: { error: null } // init
  };
};

const setSuperiorListSuccess = users => {
  return {
    type: 'SET_SUPERIOR_LIST_SUCCESS',
    payload: users
  };
};

const setSuperiorListError = err => {
  return {
    type: 'SET_SUPERIOR_LIST_ERROR',
    payload: { error: err } // init
  };
};

export const setSuperiorList = id => dispatch => {
  dispatch(setSuperiorListStart());
  axios
    .get(`http://localhost:5000/api/users/loopsafe/${id}`)
    .then(res => {
      console.log(res.data);
      dispatch(setSuperiorListSuccess(res.data.data.validSuperiors));
    })
    .catch(err => dispatch(setSuperiorListError(err)));
};

// --------------

const createUserStart = () => {
  return {
    type: 'CREATE_USER_START',
    payload: {}
  };
};

const createUserSuccess = () => {
  // data: user obj: {fn, ln, sex, age, pw}
  return {
    type: 'CREATE_USER_SUCCESS'
    // payload: userData
  };
};

const createUserError = err => {
  return {
    type: 'CREATE_USER_ERROR',
    payload: { error: err }
  };
};

export const createUser = userData => dispatch => {
  dispatch(createUserStart());
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (userData.superior) {
    axios
      .get(`http://localhost:5000/api/users/${userData.superior}`)
      .then(res => {
        // console.log(res.data);
        // console.log(res.data.data.user.name);
        userData = { ...userData, superiorname: res.data.data.user.name };
        axios
          .post('http://localhost:5000/api/users', userData, config)
          .then(res => dispatch(createUserSuccess())) // res.data
          .catch(err => dispatch(createUserError(err)));
      })
      .catch(err => dispatch(createUserError(err)));
  } else {
    // need clear superior?
    axios
      .post('http://localhost:5000/api/users', userData, config)
      .then(res => dispatch(createUserSuccess())) // res.data
      .catch(err => dispatch(createUserError(err)));
  }
};

export const initUser = () => dispatch => {
  dispatch({
    type: 'INIT_USER',
    payload: {
      firstname: '',
      lastname: '',
      sex: '',
      age: '',
      password: '',
      createSuccess: false,
      error: null
    }
  });
};

// ---------

const editUserStart = () => {
  return {
    type: 'EDIT_USER_START',
    payload: {}
  };
};

const editUserSuccess = () => {
  // data: user obj: {fn, ln, sex, age, pw}
  return {
    type: 'EDIT_USER_SUCCESS'
    // payload: userData
  };
};

const editUserError = err => {
  return {
    type: 'EDIT_USER_ERROR',
    payload: { error: err }
  };
};

export const editUser = (
  id,
  userData,
  initEdit,
  users,
  configData
) => dispatch => {
  dispatch(editUserStart());

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (userData.superior) {
    axios
      .get(`http://localhost:5000/api/users/${userData.superior}`)
      .then(res => {
        // console.log(res.data);
        // console.log(res.data.data.user.name);

        userData = { ...userData, superiorname: res.data.data.user.name };
        axios
          .put(`http://localhost:5000/api/users/${id}`, userData, config)
          .then(res => {
            dispatch(editUserSuccess()); // res.data

            // other method:
            // history.push('/');
            let {
              pageSize,
              pageNumber,
              sortType,
              searchText,
              superiorId
            } = configData;
            const index = users.indexOf(
              users.filter(user => user._id.toString() === id.toString())[0]
            );
            pageNumber = Math.ceil((index + 1) / pageSize);
            users = users.splice(0, pageSize * (pageNumber - 1));

            console.log(index);
            console.log(pageNumber, '???@@@');
            console.log(users, '@@@');

            dispatch(
              loadNextPage(
                {
                  pageSize,
                  pageNumber,
                  sortType,
                  searchText,
                  superiorId
                },
                users
              )
              // setUserListSuccess(users, {
              //   pageSize,
              //   pageNumber,
              //   sortType,
              //   searchText,
              //   superiorId
              // })
            );
            initEdit();
          })
          .catch(err => dispatch(editUserError(err)));
      })
      .catch(err => dispatch(editUserError(err)));
  } else {
    userData = { ...userData, superiorname: '' };
    axios
      .put(`http://localhost:5000/api/users/${id}`, userData, config)
      .then(res => {
        dispatch(editUserSuccess()); // res.data
        // other method:
        // history.push('/');
        let {
          pageSize,
          pageNumber,
          sortType,
          searchText,
          superiorId
        } = configData;
        const index = users.indexOf(
          users.filter(user => user._id.toString() === id.toString())[0]
        );
        pageNumber = Math.ceil((index + 1) / pageSize);
        users = users.splice(0, pageSize * (pageNumber - 1));
        console.log(pageSize);
        console.log(pageNumber, '???');
        console.log(users, '###');
        dispatch(
          loadNextPage(
            {
              pageSize,
              pageNumber,
              sortType,
              searchText,
              superiorId
            },
            users
          )
        );
        initEdit();
      })
      .catch(err => dispatch(editUserError(err)));
  }
};

// -------

export const initEdit = () => dispatch => {
  // console.log('init dispatch');
  dispatch({
    type: 'INIT_EDIT',
    payload: {
      avatar:
        'https://s.yimg.com/aah/priorservice/us-army-new-logo-magnet-15.gif',
      name: '',
      sex: '',
      rank: '',
      startdate: '',
      phone: '',
      email: '',
      superior: '',
      editSuccess: false,
      error: null
    }
  });
};

// --------

const deleteUserStart = () => {
  return {
    type: 'DELETE_USER_START',
    payload: {}
  };
};

const deleteUserSuccess = users => {
  // console.log(userData);
  return {
    type: 'DELETE_USER_SUCCESS',
    payload: users
  };
};

const deleteUserError = err => {
  return {
    type: 'DELETE_USER_ERROR',
    payload: { deleteError: err }
  };
};

export const deleteUser = (id, users) => dispatch => {
  dispatch(deleteUserStart());
  axios
    .delete(`http://localhost:5000/api/users/${id}`)
    .then(() => {
      users = users.filter(user => user._id.toString() !== id.toString());
      dispatch(deleteUserSuccess(users)); //might use if we need deleted id
      // Reload this page
      // How about it is the last row of page?
      // const index = users.indexOf(user);

      // if (users.length % config.pageSize === 1 && users.length > 1) {

      // }
      // config = { ...config, pageNumber: config.pageNumber - 1 };
      // users = users.slice(
      //   0,
      //   Math.floor(users.length / config.pageSize) * config.pageSize
      // );
      // dispatch(setUserList(config));
    })
    .catch(err => dispatch(deleteUserError(err)));
};

// --------

const getUserStart = () => {
  return {
    type: 'GET_USER_START',
    payload: {}
  };
};

const getUserSuccess = userData => {
  // console.log(userData);
  return {
    type: 'GET_USER_SUCCESS',
    payload: { user: userData }
  };
};

const getUserError = err => {
  return {
    type: 'GET_USER_ERROR',
    payload: { error: err }
  };
};

export const getUser = (id, setUserData) => dispatch => {
  dispatch(getUserStart());
  axios
    .get(`http://localhost:5000/api/users/${id}`)
    .then(res => {
      console.log(res.data);
      const {
        avatar,
        name,
        sex,
        rank,
        startdate,
        phone,
        email,
        superior,
        superiorname
      } = res.data.data.user;
      const userData = {
        avatar,
        name,
        sex,
        rank,
        startdate,
        phone,
        email,
        superior: superior ? superior : '',
        superiorname: superiorname ? superiorname : ''
      };
      dispatch(getUserSuccess(userData));
      setUserData(userData);
    })
    .catch(err => dispatch(getUserError(err)));
};

export const changeSortType = typ => dispatch => {
  dispatch({
    type: 'CHANGE_SORT_TYPE',
    payload: { sortType: typ }
  });
};

export const changeSearchText = query => dispatch => {
  if (!query) query = '__NO_SEARCH_TEXT__';
  dispatch({
    type: 'CHANGE_SEARCH_TEXT',
    payload: { searchText: query }
  });
};

export const getSuperior = id => dispatch => {
  if (!id) return;
  dispatch(setUserListStart());
  const config = {
    pageSize: 6,
    pageNumber: 1,
    sortType: 0,
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: '__NO_SUPERIOR_ID__'
  };
  axios
    .get(`http://localhost:5000/api/users/${id}`)
    .then(res => {
      console.log('getSup: ', res.data);
      dispatch(setUserListSuccess([res.data.data.user], config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const getSubordinates = (id, len) => dispatch => {
  if (len === 0) return;
  dispatch(setUserListStart());
  const config = {
    pageSize: 6,
    pageNumber: 1,
    sortType: 0,
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: id
  };
  axios
    .get(
      `http://localhost:5000/api/users/${config.pageSize}/${
        config.pageNumber
      }/${config.sortType}/${config.searchText}/${config.superiorId}`
    )
    .then(res => {
      console.log('getSup: ', res.data);
      config.pageNumber++;
      dispatch(setUserListSuccess(res.data.docs, config));
    })
    .catch(err => dispatch(setUserListError(err)));
};
