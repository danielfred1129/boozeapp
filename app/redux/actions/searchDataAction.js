  import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';

const {
	 SEARCHTEXT_CHANGE,
  	SEARCHDATA_REQUEST,
  	SEARCHDATA_SUCCESS,
  	SEARCHDATA_FAILED } = ActionTypes;

export function changeSearchText(searchText) {
    return {
        type: SEARCHTEXT_CHANGE,
        searchText: searchText
    };
}

export function loadSearchProductData(searchText, selectedID, clientToken) {

  var sub_url = '';
  var id = '';

  for(var i = 0; i < selectedID.length; i ++){

      sub_url += 'suppliers[]=' + selectedID[i].id +'&';
  }

  //console.log('Search API',(API_Config.baseUrl + '/search?term='+ searchText + '&' + sub_url));

  return {

    types: [SEARCHDATA_REQUEST, SEARCHDATA_SUCCESS, SEARCHDATA_FAILED],
    promise: request.get(API_Config.baseUrl + '/search?term='+ searchText + '&' + sub_url)

      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
  };
}