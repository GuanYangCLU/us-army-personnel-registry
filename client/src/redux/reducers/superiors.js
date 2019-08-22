const initState = {
  // config: {
  //   pageSize: 3,
  //   pageNumber: 1,
  //   sortType: 0,
  //   searchText: '__NO_SEARCH_TEXT__',
  //   superiorId: '__NO_SUPERIOR_ID__'
  // },

  superiorList: [],
  error: null,
  isLoading: false
  // lock: true
};

const superiors = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_SUPERIOR_LIST_START':
      return { ...state, isLoading: true };
    case 'SET_SUPERIOR_LIST_SUCCESS':
      return {
        ...state,
        superiorList: payload,
        isLoading: false
      };

    case 'SET_SUPERIOR_LIST_ERROR':
      return { ...state, ...payload, isLoading: false };
    default:
      return state;
  }
};

export default superiors;
