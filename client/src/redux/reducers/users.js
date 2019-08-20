const initState = {
  config: {
    pageSize: 3,
    pageNumber: 1,
    sortType: 0,
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: '__NO_SUPERIOR_ID__'
  },
  // pageInfo: {
  //   hasPrevPage: false,
  //   hasNextPage: true,
  //   prevPage: null,
  //   nextPage: 2
  // },
  // pageInfo: {
  //   totalDocs: 10,
  //   totalPages: 4,
  //   // pagingCounter: 1,
  // },
  users: [],
  error: null,
  deleteError: null,
  isLoading: false
};

const users = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER_LIST_START':
      return { ...state, isLoading: true };
    case 'SET_USER_LIST_SUCCESS':
      // console.log(payload.users.length, ' == ', payload.config.pageSize);
      // if (
      //   payload.users.length / payload.config.pageSize ===
      //   payload.config.pageNumber
      // ) {
      state.config.pageNumber++;
      return {
        ...state,
        ...payload,
        // config: { pageNumber },
        isLoading: false
      };
    // } else {
    //   return {
    //     ...state,
    //     isLoading: false
    //   };
    // }
    case 'SET_USER_LIST_ERROR':
      return { ...state, ...payload, isLoading: false };
    case 'DELETE_USER_START':
      return { ...state, isLoading: true };
    case 'DELETE_USER_ERROR':
      return { ...state, ...payload, isLoading: false };
    case 'DELETE_USER_SUCCESS':
      //   // console.log(payload._id, ' in reducer');
      //   // console.log(users); // this users is THIS REDUCER ITSELF, NOT the array
      //   // totally wrong, users.filter return undefined
      //  // either pass users in payload or make another http call to get list
      return {
        ...state,
        // users: [...users.filter(user => user._id !== payload._id)],
        // users: [],
        // deleteId: payload._id,
        isLoading: false
      };

    default:
      return state;
  }
};

export default users;
