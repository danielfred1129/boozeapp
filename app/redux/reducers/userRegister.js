import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';


const {
  SIGNUP_REQUESTED, SIGNUP_SUCCESS, SIGNUP_FAILED,
  PASSWORDTOKEN_REQUESTED, PASSWORDTOKEN_SUCCESS, PASSWORDTOKEN_FAILED,
  CLIENTTOKEN_REQUESTED, CLIENTTOKEN_SUCCESS, CLIENTTOKEN_FAILED, FORGOTPASSWORD_REQUESTED, FORGOTPASSWORD_SUCCESS, FORGOTPASSWORD_FAILED,
} = ActionTypes;

var initialState = {signUpResult: null, signUpError:null, signInResult: null, passwordTokenResult: null, passwordTokenError:null, clientTokenResult: null, forgotPasswordResult:null, loading: false, error: null};

export default function userRegister(state = initialState, action) {
	switch(action.type) {
		case SIGNUP_REQUESTED:
			return {
				...state,
				loading: true,
				signUpResult: null,
				signUpError: null
			};
		case SIGNUP_SUCCESS:
			return {
				...state,
				loading: false,
				signUpResult: action.result.data
			};
		case SIGNUP_FAILED:
			return {
				...state,
				loading: false,
				signUpError: action.error.response.data
			};
		case PASSWORDTOKEN_REQUESTED:
			return {
				...state,
				loading: true,
				passwordTokenResult: null,
				passwordTokenError: null
			};
		case PASSWORDTOKEN_SUCCESS:
			return {
				...state,
				loading: false,
				passwordTokenResult: action.result.data
			};
		case PASSWORDTOKEN_FAILED:
			return {
				...state,
				loading: false,
				passwordTokenError: action.error.response.data
			};
		case CLIENTTOKEN_REQUESTED:
			return {
				...state,
				loading: true,
				clientTokenResult: null,
				error: null
			};
		case CLIENTTOKEN_SUCCESS:
			return {
				...state,
				loading: false,
				clientTokenResult: action.result.data
			};
		case CLIENTTOKEN_FAILED:
			return {
				...state,
				loading: false,
				clientTokenResult: action.error.response.data
			};
		case FORGOTPASSWORD_REQUESTED:
			return {
				...state,
				loading: true,
				forgotPasswordResult: null,
				error: null
			};
		case FORGOTPASSWORD_SUCCESS:
			return {
				...state,
				loading: false,
				forgotPasswordResult: action.result.data
			};
		case FORGOTPASSWORD_FAILED:
			return {
				...state,
				loading: false,
				forgotPasswordResult: action.error.response.data
			};

		default: 
			return state;
	}
	return state;
}