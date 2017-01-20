import {AsyncStorage} from 'react-native';
import {ActionTypes} from '../../constants';

const {DETAILPAGE_SUCCESS, PREVPAGE_SUCCESS, SAVETABID_SUCCESS, TABTYPE_SUCCESS, CURRENTPAGE_SUCCESS,PRODUCTDATA_SUCCESS,LISTTYPEID_SUCCESS} = ActionTypes;
var initialState = {error: null, saveTabID: null, prevPage: null, tabType: null, currentPage: null };


export default function tabInfo(state = initialState, action) {
	
	switch(action.type) {
		case DETAILPAGE_SUCCESS:
			return {
				...state,
				error: null,
				isDetail: action.isDetail,
			};
		case PREVPAGE_SUCCESS:
			return {
				...state,
				error: null,
				prevPage: action.prevPage,
			};
		case SAVETABID_SUCCESS:
			return {
				...state,
				error: null,
				saveTabID: action.saveTabID,
			};
		case TABTYPE_SUCCESS:
			return {
				...state,
				error: null,
				tabType: action.tabType,
			};
		case CURRENTPAGE_SUCCESS:
			return {
				...state,
				error: null,
				currentPage: action.currentPage,
			};
		case PRODUCTDATA_SUCCESS:
			return {
				...state,
				error: null,
				productData: action.productData,
			};
		case LISTTYPEID_SUCCESS:
			return {
				...state,
				error: null,
				listTypeID: action.listTypeID,
			};
		default: 
			return state;
	}
	return state;
}