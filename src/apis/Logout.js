import { removeJobs, removePosts, removeUser } from "../redux/actions/UserAction";

export const Logout = (dispatch, navigate) => {
    localStorage.removeItem("empToken");
    dispatch(removeUser());
    dispatch(removeJobs());
    dispatch(removePosts());
    navigate('/signin');
  };