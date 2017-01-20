import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config, client_credentials} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';
import axios from 'axios';

const {
  SIGNUP_REQUESTED, SIGNUP_SUCCESS, SIGNUP_FAILED, 
  PASSWORDTOKEN_REQUESTED, PASSWORDTOKEN_SUCCESS, PASSWORDTOKEN_FAILED,
  CLIENTTOKEN_REQUESTED, CLIENTTOKEN_SUCCESS, CLIENTTOKEN_FAILED,
  FORGOTPASSWORD_REQUESTED, FORGOTPASSWORD_SUCCESS, FORGOTPASSWORD_FAILED,
} = ActionTypes;

const {CLIENT_SECRET, CLIENT_ID} = client_credentials;

export function loadSignUpResult(first_name, last_name, phone_number, email
  , password, password_confirmation, prefer_beer, prefer_wine, prefer_liquor, ofage, clientToken) {
  
  return {
        types: [SIGNUP_REQUESTED, SIGNUP_SUCCESS, SIGNUP_FAILED],
        hasPost: 'true',
        promise:
            axios({
                method: 'post',
                url: API_Config.baseUrl + '/customer',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': clientToken
                },
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                    prefer_beer: prefer_beer,
                    prefer_wine: prefer_wine,
                    prefer_liquor: prefer_liquor,
                    ofage: ofage,
                }
            })
        
    };
}


export function getPasswordToken(email_address, password) {
  return {
        types: [PASSWORDTOKEN_REQUESTED, PASSWORDTOKEN_SUCCESS, PASSWORDTOKEN_FAILED],
        hasPost: 'true',
        promise:
            axios({
                method: 'post',
                url: API_Config.baseUrl_token + '/oauth/token',
                headers: {'Accept': 'application/json'},
                data: {
                    grant_type: 'password',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    username: email_address,
                    password: password
                }
            })
        
    };
}


export function getClientToken() {
    console.log('client_id:', CLIENT_ID);
    console.log('client_secret:', CLIENT_SECRET);
    console.log('API_Config.baseUrl_token:', API_Config.baseUrl_token);
  return {
        types: [CLIENTTOKEN_REQUESTED, CLIENTTOKEN_SUCCESS, CLIENTTOKEN_FAILED],
        hasPost: 'true',
        promise:
            axios({
                method: 'post',
                url: API_Config.baseUrl_token + '/oauth/token',
                headers: {'Accept': 'application/json'},
                data: {
                    grant_type: 'client_credentials',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET
                }
            })
    };
}

export function forgotPassword(email_address, clientToken) {
  return {
        types: [FORGOTPASSWORD_REQUESTED, FORGOTPASSWORD_SUCCESS, FORGOTPASSWORD_FAILED],
        hasPost: 'true',
        promise:
            axios({
                method: 'post',
                url: API_Config.baseUrl + '/customer/password',
                headers: {'Accept': 'application/json', 'Authorization': clientToken},
                data: {
                    email: email_address,
                }
            })
    };
}
