import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth'; //auth 리듀서를 아래에 넣었기 때문에 auth 에서 바뀐 것은 당연히 store.auth 로 들어가게된다.
import profile from './profile';

//여기서 connect 를 통해서 받는 state 에는 state.action 으로 들어가지 않을까?
export default combineReducers({
  alert,
  auth,
  profile,
});
