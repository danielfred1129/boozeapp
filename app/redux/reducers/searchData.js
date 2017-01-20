import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';

const {SEARCHTEXT_CHANGE} = ActionTypes;
var initialState = {error: null, searchText: null};

export default function searchData(state = initialState, action) {
	
	switch(action.type) {
		case SEARCHTEXT_CHANGE:
			const result = Object.assign({}, state, {
				'searchText': action.searchText
			});
			return result;
		default: 
			return state;
	}
	return state;
}