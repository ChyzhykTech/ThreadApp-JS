import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  SET_EXPANDED_POST,
  SOFT_REMOVE_POST
} from './actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length)
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.post, ...state.posts]
      };
    case SOFT_REMOVE_POST:
      return {
        ...state,
        posts: [...state.posts.filter(post => post.id !== action.postId)]
      };
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post
      };
    default:
      return state;
  }
};
