import {AsyncStorage} from 'react-native';
import {ActionTypes, API_Config} from '../../constants';
import _ from 'lodash';
import request from 'superagent-bluebird-promise';

const {DETAILPAGE_SUCCESS, PREVPAGE_SUCCESS, SAVETABID_SUCCESS, TABTYPE_SUCCESS, CURRENTPAGE_SUCCESS, PRODUCTDATA_SUCCESS,LISTTYPEID_SUCCESS} = ActionTypes;

export function saveIsDetail(isDetail) {
    return {
        type: DETAILPAGE_SUCCESS,
        isDetail: isDetail
    };
}

export function savePrevPage(prevPage) {
    return {
        type: PREVPAGE_SUCCESS,
        prevPage: prevPage
    };
}

export function saveTabID(saveTabID) {
    return {
        type: SAVETABID_SUCCESS,
        saveTabID: saveTabID
    };
}

export function saveTabType(typeType) {
    return {
        type: TABTYPE_SUCCESS,
        tabType: typeType
    };
}

export function saveCurrentPage(currentPage) {
    return {
        type: CURRENTPAGE_SUCCESS,
        currentPage: currentPage
    };
}

export function saveProductData(productData) {
    return {
        type: PRODUCTDATA_SUCCESS,
        productData: productData
    };
}

export function saveListTypesID(listTypeID) {
    return {
        type: LISTTYPEID_SUCCESS,
        listTypeID: listTypeID
    };
}