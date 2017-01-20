import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';

const {VideoFeature_REQUESTED, VideoFeature_SUCCESS, VideoFeature_FAILED} = ActionTypes;
var initialState = {videolist: null, loading: false, error: null};

export default function VideoFeature(state = initialState, action) {
	switch(action.type) {
		case VideoFeature_REQUESTED:
			return {
				...state,
				loading: true,
				videolist: null,
				error: null
			};
		case VideoFeature_SUCCESS:
			return {
				...state,
				loading: false,
				videolist: action.result.body
			};
		case VideoFeature_FAILED:
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
