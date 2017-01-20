import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';


const {ProductTypes_REQUESTED, ProductTypes_SUCCESS, ProductTypes_FAILED} = ActionTypes;
var initialState = {categoryTypes: null, loading: false, error: null};

export default function productTypes(state = initialState, action) {

	switch(action.type) {
		case ProductTypes_REQUESTED:
			return {
				...state,
				loading: true,
				categoryTypes: null,
				error: null
			};
		case ProductTypes_SUCCESS:
			return {
				...state,
				loading: false,
				categoryTypes: action.result.body
			};
		case ProductTypes_FAILED:
			return {
				...state,
				loading: false,
				error: action.result
			};
		default:
			return state;
	}
	return state;
}
