const initState = {
  config: {
    pageSize: 6,
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
  // lock: true
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
        // lock: false
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
      // console.log(payload, 'payload');
      return {
        ...state,
        users: payload,
        // users: [],
        // deleteId: payload._id,
        isLoading: false
      };
    // case 'SET_SUPERIOR_LIST_SUCCESS':
    //   return {
    //     ...state,
    //     users: payload,
    //     isLoading: false
    //   };
    case 'CHANGE_SORT_TYPE':
      state.config.sortType = payload.sortType;
      state.config.pageNumber = 1;
      return state;
    case 'CHANGE_SEARCH_TEXT':
      state.config.searchText = payload.searchText;
      state.config.pageNumber = 1;
      return state;
    default:
      return state;
  }
};

export default users;
