import keyMirror from 'keymirror';
import ExtraDimensions from 'react-native-extra-dimensions-android';
// export const LOCAL_STORAGE_TOKEN_KEY = 'boozeapp.session.token';

export const ActionTypes = keyMirror({

  GEOCODE_REQUESTED: null,
  GEOCODE_SUCCESS: null,
  GEOCODE_FAILED: null,
  SENDGEOCODE_REQUESTED: null,
  SENDGEOCODE_SUCCESS: null,
  SENDGEOCODE_FAILED: null,
  ProductTypes_REQUESTED: null,
  ProductTypes_SUCCESS: null,
  ProductTypes_FAILED: null,
  ProductDetail_REQUESTED: null,
  ProductDetail_SUCCESS: null,
  ProductDetail_FAILED: null,
  ProductCategories_REQUESTED: null,
  ProductCategories_SUCCESS: null,
  ProductCategories_FAILED: null,
  ProductCategory_SELECTED: null,
  VideoFeature_REQUESTED: null,
  VideoFeature_SUCCESS: null,
  VideoFeature_FAILED: null,
  PartyOrderForm_REQUESTED: null,
  PartyOrderForm_SUCCESS: null,
  PartyOrderForm_FAILED: null,
  ServiceEmail_REQUESTED: null, 
  ServiceEmail_SUCCESS: null, 
  ServiceEmail_FAILED: null,
  SubmitItemList_SELECTED: null,
  SetSuppliersID_SELECTED: null,
  SetSuppliers_SELECTED: null,
  SetSuppliersType_SELECTED: null,
  GoogleAddress_REQUESTED: null,
  GoogleAddress_SUCCESS: null,
  GoogleAddress_FAILED: null,
  selectedProductName_SELECTED: null,
  ProductGalleryListofCategory_REQUESTED: null, 
  ProductGalleryListofCategory_SUCCESS: null, 
  ProductGalleryListofCategory_FAILED: null, 
  ProductGalleryListOfTypes_REQUESTED: null, 
  ProductGalleryListOfTypes_SUCCESS: null, 
  ProductGalleryListOfTypes_FAILED: null,
  SEARCHDATA_REQUEST: null,
  SEARCHDATA_SUCCESS: null,
  SEARCHDATA_FAILED: null,
  SEARCHTEXT_CHANGE: null,
  DETAILPAGE_SUCCESS: null,
  PREVPAGE_SUCCESS:null,
  CURRENTPAGE_SUCCESS:null,
  SAVETABID_SUCCESS:null,
  TABTYPE_SUCCESS:null,
  PRODUCTDATA_SUCCESS:null,
  LISTTYPEID_SUCCESS:null,

  GETCARTINFO_REQUESTED:null,
  GETCARTINFO_SUCCESS:null,
  GETCARTINFO_FAILED:null,
  ADDCARTINFO_REQUESTED:null,
  ADDCARTINFO_SUCCESS:null,
  ADDCARTINFO_FAILED:null,
  REMOVECARTINFO_REQUESTED:null, 
  REMOVECARTINFO_SUCCESS:null, 
  REMOVECARTINFO_FAILED:null,
  CREATECARTINFO_REQUESTED:null, 
  CREATECARTINFO_SUCCESS:null, 
  CREATECARTINFO_FAILED:null,
  UPDATECARTINFO_REQUESTED:null, 
  UPDATECARTINFO_SUCCESS:null, 
  UPDATECARTINFO_FAILED:null,

  SIGNUP_REQUESTED:null, 
  SIGNUP_SUCCESS:null, 
  SIGNUP_FAILED:null, 
  SIGNIN_REQUESTED:null, 
  SIGNIN_SUCCESS:null, 
  SIGNIN_FAILED:null,

  ADDCARD_RESET:null,
  ADDCARD_REQUESTED:null,
  ADDCARD_SUCCESS:null,
  ADDCARD_FAILED:null,
  UPDATECARD_REQUESTED:null,
  UPDATECARD_SUCCESS:null,
  UPDATECARD_FAILED:null,
  GETALLCARD_REQUESTED:null,
  GETALLCARD_SUCCESS:null,
  GETALLCARD_FAILED:null,
  DELETECARD_REQUESTED:null,
  DELETECARD_SUCCESS:null,
  DELETECARD_FAILED:null,

  PASSWORDTOKEN_REQUESTED:null, 
  PASSWORDTOKEN_SUCCESS:null,
  PASSWORDTOKEN_FAILED:null,
  CLIENTTOKEN_REQUESTED:null, 
  CLIENTTOKEN_SUCCESS:null,
  CLIENTTOKEN_FAILED:null,
  FORGOTPASSWORD_REQUESTED:null,
  FORGOTPASSWORD_SUCCESS:null,
  FORGOTPASSWORD_FAILED:null,

  ORDER_REQUESTED:null, 
  ORDER_SUCCESS:null, 
  ORDER_FAILED:null, 

  DELIVERY_REQUESTED: null,
  DELIVERY_SUCCESS: null,
  DELIVERY_FAILED: null,
  DELIVERYDATA_SAVE: null,

  PROMOCODE_REQUESTED: null,
  PROMOCODE_SUCCESS: null,
  PROMOCODE_FAILED: null,

  SubmitBillingItemList_SELECTED: null,

  DEVICEDATA_REQUESTED: null, 
  DEVICEDATA_SUCCESS: null, 
  DEVICEDATA_FAILED:null,
  DEVICEDATA_RESPONSE:null,

});


export const API_Config = {
  // Api Host for STAGING
  baseUrl: 'https://staging.boozeapp.com/api',
  baseUrl_token: 'https://staging.boozeapp.com',

  // Api Host for secure dev
	// baseUrl: 'https://boozeapp-staging.dev.securedatatransit.com/api',
  // baseUrl_token: 'https://boozeapp-staging.dev.securedatatransit.com',
  //new AIzaSyBnp3Q5LngrY3auLrECnLUjH3i8xd7FLY0
  //old AIzaSyDvF9Spr3Txx3JFPuJTRYR32HByVNze1Po
  Google_API_Url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBnp3Q5LngrY3auLrECnLUjH3i8xd7FLY0',
  Google_API_Key: 'AIzaSyBnp3Q5LngrY3auLrECnLUjH3i8xd7FLY0',
};

export const static_data = {
  street: '100CommerceDrive',
  city: 'FranklinTownship',
  state: 'NewJersey',
  zip: '08873',
  email: 'Akira.Y523@outlook.com'
};

export const static_geoCode_data = {
  lat: '40.3869315',
  lng: '-74.5269141',
  state: 'nj'
}

export const client_credentials = {
  // Api Secret for secure dev
  // CLIENT_SECRET:'JoxTzZB4LBEVjmAceZZ3jGenkXR6RCpPjJhb7gv5',

  // Api Secret for STAGING
  CLIENT_SECRET:'BmLZ453DKTc54hkTi9NBTegvw5Rl1amfaXcNtomO',

  // Api Secret for PRODUCTION
   // CLIENT_SECRET:'Xb085U7jT10hmphszVLDaS8MyX6chN9RLppadffU',
  CLIENT_ID:2
}

export const screen_dimensions = {
  screen_width: ExtraDimensions.get('REAL_WINDOW_WIDTH'),
  screen_height: ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT') - ExtraDimensions.get('STATUS_BAR_HEIGHT'),
  REAL_WINDOW_HEIGHT : ExtraDimensions.get('REAL_WINDOW_HEIGHT'),
  REAL_WINDOW_WIDTH : ExtraDimensions.get('REAL_WINDOW_WIDTH'),
  STATUS_BAR_HEIGHT : ExtraDimensions.get('STATUS_BAR_HEIGHT'),
  SOFT_MENU_BAR_HEIGHT : ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT'),
  SMART_BAR_HEIGHT : ExtraDimensions.get('SMART_BAR_HEIGHT'),
}