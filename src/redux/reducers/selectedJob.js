import { actionTypes } from "../constants/actionTypes";

const initialState = {
    job: ''
}
export const selectedJobReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SET_SELECTED_JOB: {
            return { job: payload };
        }
        case actionTypes.REMOVE_SELECTED_JOB: {
            return { };
        }
        default:
            return state;
    }
}