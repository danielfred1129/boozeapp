import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';


const {ProductGalleryListOfTypes_REQUESTED, ProductGalleryListOfTypes_SUCCESS, ProductGalleryListOfTypes_FAILED} = ActionTypes;


var initialState = {galleryListofTypes: null, loading: false, error: null};

export default function ProductGalleryListofTypes(state = initialState, action) {

	switch(action.type) {
		case ProductGalleryListOfTypes_REQUESTED:
		console.log('requested')
			return {
				...state,
				loading: true,
				galleryListofTypes: null,
				error: null
			};
		case ProductGalleryListOfTypes_SUCCESS:
		console.log('successed')
			return {
				...state,
				loading: false,
				galleryListofTypes: action.result.body
			};
		case ProductGalleryListOfTypes_FAILED:
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
