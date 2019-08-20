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
  // }
  dispatch(setUserListStart());
  const { pageSize, pageNumber, sortType, searchText, superiorId } = config;
  console.log(config);
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
      setTimeout(() => {
        dispatch(setUserListSuccess(users.concat(res.data.docs), config));
        // setUsers(fakeD);
      }, 1500);
      // }
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const resetConfig = () => dispatch => {
  dispatch(setUserListStart());
  // Initialize Config
  const config = {
    pageSize: 3,
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
      console.log('WWsuccess', res.data.docs);
      console.log('WOW: ', config);
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

// --------------

const createUserStart = () => {
  return {
    type: 'CREATE_USER_START',
    payload: {}
  };
};

const createUserSuccess = userData => {
  // data: user obj: {fn, ln, sex, age, pw}
  return {
    type: 'CREATE_USER_SUCCESS',
    payload: userData
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
  axios
    .post('http://localhost:5000/api/users', userData, config)
    .then(res => dispatch(createUserSuccess(res.data)))
    .catch(err => dispatch(createUserError(err)));
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

const editUserSuccess = userData => {
  // data: user obj: {fn, ln, sex, age, pw}
  return {
    type: 'EDIT_USER_SUCCESS',
    payload: userData
  };
};

const editUserError = err => {
  return {
    type: 'EDIT_USER_ERROR',
    payload: { error: err }
  };
};

export const editUser = (userData, history, initEdit) => dispatch => {
  dispatch(editUserStart());
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  axios
    .put(`http://localhost:5000/api/users/${userData.id}`, userData, config)
    .then(res => {
      dispatch(editUserSuccess(res.data));
      // other method:
      history.push('/');
      initEdit();
    })
    .catch(err => dispatch(editUserError(err)));
};

// -------

export const initEdit = () => dispatch => {
  // console.log('init dispatch');
  dispatch({
    type: 'INIT_EDIT',
    payload: {
      firstname: '',
      lastname: '',
      sex: '',
      age: '',
      password: '',
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

const deleteUserSuccess = () => {
  // console.log(userData);
  return {
    type: 'DELETE_USER_SUCCESS'
    // payload: userData
  };
};

const deleteUserError = err => {
  return {
    type: 'DELETE_USER_ERROR',
    payload: { deleteError: err }
  };
};

export const deleteUser = id => dispatch => {
  dispatch(deleteUserStart());
  axios
    .delete(`http://localhost:5000/api/users/${id}`)
    .then(() => {
      dispatch(deleteUserSuccess()); //might use if we need deleted id
      dispatch(setUserList());
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
      const { firstname, lastname, sex, age } = res.data;
      const userData = { firstname, lastname, sex, age };
      dispatch(getUserSuccess(userData));
      setUserData(userData);
    })
    .catch(err => dispatch(getUserError(err)));
};
