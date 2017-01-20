import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';

const {VideoFeature_REQUESTED, VideoFeature_SUCCESS, VideoFeature_FAILED} = ActionTypes;
export function loadVideoFeatureList(clientToken) {
	return {
    types: [VideoFeature_REQUESTED, VideoFeature_SUCCESS, VideoFeature_FAILED],
    promise: request.get(API_Config.baseUrl + '/videos')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', clientToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
	};
}
