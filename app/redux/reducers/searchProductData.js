import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';


const {SEARCHDATA_REQUEST, SEARCHDATA_SUCCESS, SEARCHDATA_FAILED} = ActionTypes;


var initialState = {searchData: null, loading: false, error: null};

export default function searchProductData(state = initialState, action) {

	switch(action.type) {
		case SEARCHDATA_REQUEST:
			return {
				...state,
				loading: true,
				searchData: null,
				error: null
			};
		case SEARCHDATA_SUCCESS:
			return {
				...state,
				loading: false,
				searchData: action.result.body
			};
		case SEARCHDATA_FAILED:
		console.log("TTTTT", action);
			return {
				...state,
				loading: false,
				error: action.error
			};
		default:
			return state;
	}
	return state;
}
