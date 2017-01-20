import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';

const {DELIVERY_REQUESTED, DELIVERY_SUCCESS, DELIVERY_FAILED, DELIVERYDATA_SAVE} = ActionTypes;

export function getDeliveryHours(supplier_id, passwordToken) {

  return {
    types: [DELIVERY_REQUESTED, DELIVERY_SUCCESS, DELIVERY_FAILED],

    promise: request.get(API_Config.baseUrl 
      +'/supplier/get_delivery_hours/' + supplier_id)

      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', passwordToken)
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Credentials', '*')
      .promise()
  };
}

export function saveDeliveryData(data) {
    return {
        type: DELIVERYDATA_SAVE,
        deliveryDataArr: data
    };
}
