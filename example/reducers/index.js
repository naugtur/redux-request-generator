import { combineReducers } from "redux";
import { reducers } from "../requests"

import T from "../actions/ACTION_TYPES"
import {handleActions} from "redux-actions"

const navigationReducer = handleActions({
    [T.NAVIGATION]: (state, {location}) => ({ location })
}, { location: null });


export default combineReducers({
    navigation: navigationReducer,
    ...reducers
});
