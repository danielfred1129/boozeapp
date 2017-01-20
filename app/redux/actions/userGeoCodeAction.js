import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';


const {GoogleAddress_REQUESTED, GoogleAddress_SUCCESS, GoogleAddress_FAILED} = ActionTypes;


export function getUserGeoCodeInfo(GoogleAddress, clientToken) {

  return {
    types: [GoogleAddress_REQUESTED, GoogleAddress_SUCCESS, GoogleAddress_FAILED],
    promise: request.get(API_Config.baseUrl + '&address=' + GoogleAddress)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
  };
}
