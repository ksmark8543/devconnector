import { combineReducers } from 'redux';
import alert from './alert';

//여기서 connect 를 통해서 받는 state 에는 state.action 으로 들어가지 않을까?
export default combineReducers({
  alert,
});
