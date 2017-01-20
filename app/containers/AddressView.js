import React, {Component} from 'react';
import {Alert, StyleSheet, Image, View, Text, TouchableOpacity, TextInput, AlertIOS, KeyboardAvoidingView} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import {AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import NonServiceAreaView from '../components/NonServiceAreaView';

import {loadUserGeoCodeResult, setGeoCodeInfo, setSuppliersID, getUserGeoCodeInfo, saveSuppliers, saveSuppliersType} from '../redux/actions/geoCodeActions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {static_geoCode_data, static_data, API_Config, screen_dimensions} from '../constants';

import {savePrevPage, saveCurrentPage} from '../redux/actions/tabInfoAction';

import {getClientToken} from '../redux/actions/userRegisterActions';
import {getCartInfo, createCartInfo} from '../redux/actions/productCartActions';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

class Button extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

class AddressView extends Component{

	constructor(props) {
	  super(props);
	  
	  this.state = {
	  	lat: null,
	  	lng: null,
	  	state: null,
	  	clientToken: null,
	  	createcartInfo: null,
	  	behavior: 'padding',
	  	street: null, 
	  	city: null,
	  	zipCode: null, 
	  	details: null
	  };
	}


	componentWillMount() {
		this.props.getClientToken();

		/*remove AsyncStorage Item used in OrderView*/
		AsyncStorage.removeItem('unit_number');
		AsyncStorage.removeItem('delivery_instruction');
		AsyncStorage.removeItem('promo_code');
		AsyncStorage.removeItem('delivery_data');
		AsyncStorage.removeItem('orderCardSelectID');
		AsyncStorage.removeItem('totalDriverTipList');
		AsyncStorage.removeItem('billingAddress');
		AsyncStorage.setItem('same_with_ship', JSON.stringify(false));
	}

	componentDidMount(){
		this.props.saveCurrentPage('address');
	}

	componentWillReceiveProps(nextProps) {

		const {result} = nextProps.geoCodeForm;

		if(result){

			var suppliers = result.suppliers
			
		}

		const {clientTokenResult, createcartInfo} = nextProps;
		console.log('clientTokenResult on componentWillReceiveProps:', clientTokenResult);
		if (clientTokenResult) {
			clientToken = 'Bearer ' + clientTokenResult.access_token;
			this.setState({clientToken: clientToken});
			
		}

		if (createcartInfo) {
			this.setState({createcartInfo: createcartInfo});
		}
	}

	_onSignIn(){
		this.props.savePrevPage('address');
		//Actions.signUpView();
		// Actions.orderConfirmationView();
		Actions.signInView();
	}

	_onLoad(details) {
		
		const geoCode = details.geometry.location
		const lat = geoCode.lat
		const lng = geoCode.lng

		var addressLength = details.address_components.length

		 if(addressLength>0)

        {
            var locationDetails=details.formatted_address;
            var  value=locationDetails.split(",");
            
            count=value.length;
            
            country=value[count-1];
            state=value[count-2];
            city=value[count-3];
            street=value[count-4];
            pin=state.split(" ");
            zipCode=pin[pin.length-1];
            state=state.replace(zipCode,' ');
            newState = state.replace(/\s+/g, '');

			this.setState({lat: lat, lng: lng, state: newState })
			this.setState({street: street, city: city, zipCode: zipCode, details: details});
        }
	}

	_setDetails(details) {
		const geoCode = details.geometry.location
		const lat = geoCode.lat
		const lng = geoCode.lng

		var addressLength = details.address_components.length

		 if(addressLength>0)

        {
            var locationDetails=details.formatted_address;
            var  value=locationDetails.split(",");
            
            count=value.length;
            
            country=value[count-1];
            state=value[count-2];
            city=value[count-3];
            street=value[count-4];
            pin=state.split(" ");
            zipCode=pin[pin.length-1];
            state=state.replace(zipCode,' ');
            newState = state.replace(/\s+/g, '');

			this.setState({lat: lat, lng: lng, state: newState })
			this.setState({street: street, city: city, zipCode: zipCode, details: details});
			this.props.setGeoCodeInfo(street, city, state, zipCode, details);

        }
	}

	_onContinue(){
		const {lat, lng, state, clientToken} = this.state;
		console.log('clientToken _onContinue:', clientToken);
		if (clientToken)
			this.props.createCartInfo(clientToken);
		this._sendGeoCode(40.7673582, -73.95978690000001, 'NY');
		/*
		if (lat && lng && state){

			// this._sendGeoCode(lat, lng, state);
			//unit testing
			this._sendGeoCode(40.7673582, -73.95978690000001, 'NY');

		}else{

			console.log('Network NonExist!');
		}*/
	}

	async _onCancel(){
		const {isSplit} = this.props;

		var prev_details;
		prev_details = JSON.parse(await AsyncStorage.getItem('prev_details'));
		this._setDetails(prev_details);

		if (isSplit == true)
			Actions.deliveryStoreSplitView();
		else
			Actions.deliveryStoreView();
	}

	_onLogo(){
		const {menuDeliveryFlag} = this.props;
		if (menuDeliveryFlag == 'select')
			Actions.productCategory();
	}

	/**
		Props chagnge
	**/

	async _sendGeoCode(lat, lng, state) {

		const {menuDeliveryFlag} = this.props;
		
		const {clientToken, createcartInfo} = this.state;

		var async_suppliers_body = null;
		var async_suppliers = null;

		console.log('clientToken:', clientToken);

		if (clientToken != null) {
			const result = await this.props.loadUserGeoCodeResult(lat, lng, state, clientToken);
			
			if (result.result) {

				var UUID = '';
				var cartID = null;

				if (createcartInfo && clientToken != null) {
					UUID = createcartInfo.guest_id;
					cartID = createcartInfo.id;
					this.props.getCartInfo(cartID, UUID, clientToken);
				}

				async_suppliers_body = result.result.data;			
				async_suppliers = result.result.data.suppliers;
				
				const {street, city, state, zipCode, details} = this.state;

				// this.props.setGeoCodeInfo(street, city, state, zipCode, details);
				//Unit testing
				const test_details = { address_components: 
                                                               [ { long_name: '1321',
                                                                   short_name: '1321',
                                                                   types: [ 'street_number' ] },
                                                                 { long_name: '2nd Avenue',
                                                                   short_name: '2nd Ave',
                                                                   types: [ 'route' ] },
                                                                 { long_name: 'Upper East Side',
                                                                   short_name: 'UES',
                                                                   types: [ 'neighborhood', 'political' ] },
                                                                 { long_name: 'Manhattan',
                                                                   short_name: 'Manhattan',
                                                                   types: [ 'sublocality_level_1', 'sublocality', 'political' ] },
                                                                 { long_name: 'New York',
                                                                   short_name: 'New York',
                                                                   types: [ 'locality', 'political' ] },
                                                                 { long_name: 'New York County',
                                                                   short_name: 'New York County',
                                                                   types: [ 'administrative_area_level_2', 'political' ] },
                                                                 { long_name: 'New York',
                                                                   short_name: 'NY',
                                                                   types: [ 'administrative_area_level_1', 'political' ] },
                                                                 { long_name: 'United States',
                                                                   short_name: 'US',
                                                                   types: [ 'country', 'political' ] },
                                                                 { long_name: '10021',
                                                                   short_name: '10021',
                                                                   types: [ 'postal_code' ] },
                                                                 { long_name: '5404',
                                                                   short_name: '5404',
                                                                   types: [ 'postal_code_suffix' ] } ],
                                                              adr_address: '<span class="street-address">1321 2nd Ave</span>, <span class="locality">New York</span>, <span class="region">NY</span> <span class="postal-code">10021-5404</span>, <span class="country-name">USA</span>',
                                                              formatted_address: '1321 2nd Ave, New York, NY 10021, USA',
                                                              geometry: 
                                                               { location: { lat: 40.7673582, lng: -73.95978690000001 },
                                                                 viewport: 
                                                                  { northeast: { lat: 40.76741320000001, lng: -73.95940095 },
                                                                    southwest: { lat: 40.7671932, lng: -73.95991555000002 } } },
                                                              icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
                                                              id: '4ad7963514780f143925e6eebee93abce23aabb5',
                                                              name: '1321 2nd Ave',
                                                              place_id: 'ChIJww-yCOpYwokRHrM2ce-AU0g',
                                                              reference: 'CmRbAAAABtA8eSYa8yknHm4F8Te267wxw-SU4Lww5Gf8knf4NmzWFNvPkTeeAoeLwzU3D4eyzqTTSAcJqfQP8l9WYfqiLM1qouj3Bc4u4sMFqmpuOLianub4aTKhsWrh0-2J98QmEhAoAUIIIgIRNUkaZp8-YUwIGhSwoeCOwzRBGPgs-B9V_-1YYwAa3w',
                                                              scope: 'GOOGLE',
                                                              types: [ 'street_address' ],
                                                              url: 'https://maps.google.com/?q=1321+2nd+Ave,+New+York,+NY+10021,+USA&ftid=0x89c258ea08b20fc3:0x485380ef7136b31e',
                                                              utc_offset: -300,
                                                              vicinity: 'Manhattan' };
				this.props.setGeoCodeInfo('1321 2nd Ave', ' New York', 'NY', '10021', test_details);

				if (async_suppliers.length > 0){

					var ID = [];
					var type2_suppliers = [], type3_suppliers = [], type1_suppliers = [], default_suppliers = [];
					
					for(var i=0; i<async_suppliers.length; i++) {

						if (async_suppliers[i]['type'] == 2) {
							type2_suppliers.push(async_suppliers[i]['id']);
						}
						else if (async_suppliers[i]['type'] == 3) {
							type3_suppliers.push(async_suppliers[i]['id']);
						}
						else if (async_suppliers[i]['type'] == 1) {
							type1_suppliers.push(async_suppliers[i]['id']);
						}

						ID.push({
							id: async_suppliers[i].id,
						})
					}
					
					if (type1_suppliers.length > 0) {
						default_suppliers.push({id: type1_suppliers[0]});
					}
					else {

						if (type2_suppliers.length > 0 && type3_suppliers.length > 0) {
							default_suppliers.push({id: type2_suppliers[0]});
							default_suppliers.push({id: type3_suppliers[0]});
						}
						else if (type2_suppliers.length == 0 && type3_suppliers.length > 0) {
							default_suppliers.push({id: type3_suppliers[0]});
						}
						else if (type3_suppliers.length == 0 && type2_suppliers.length > 0) {
							default_suppliers.push({id: type2_suppliers[0]});
						}
					}

					
					this.props.savePrevPage('address');

					this.props.setSuppliersID(default_suppliers);
					this.props.saveSuppliers(async_suppliers);

					if (menuDeliveryFlag == 'select') {
						const {details} = this.state;
						AsyncStorage.setItem('prev_details', JSON.stringify(details));

						if (async_suppliers_body) {
							AsyncStorage.setItem('suppliers_type', JSON.stringify(async_suppliers_body.isSplit));
						}
						
						if (async_suppliers_body.isSplit == false) {
							Alert.alert(
								'Warning',
								'Your cart will be emptied! Do you still want to proceed?',
								[
									{text: 'OK', onPress: () => Actions.deliveryStoreView(), style: 'cancel'},
									{text: 'Cancel', onPress: () => console.log('Canceled')},
								]
							)
						}
						else {
							Alert.alert(
								'Warning',
								'Your cart will be emptied! Do you still want to proceed?',
								[
									{text: 'OK', onPress: () => Actions.deliveryStoreSplitView(), style: 'cancel'},
									{text: 'Cancel', onPress: () => console.log('Canceled')},
								]
							)
						}
						
					}
					else {
						const {details} = this.state;
						AsyncStorage.setItem('prev_details', JSON.stringify(details));

						if (async_suppliers_body) {
							AsyncStorage.setItem('suppliers_type', JSON.stringify(async_suppliers_body.isSplit));
						}
						console.log('productCategory action');
						Actions.productCategory();
					}			

				}else{
					this.refs.autocomplete.setAddressText('');
			  		this.openModal()
				}
			}
		}
		
	}

	openModal(){

		this.refs.modal.open();
	}

	closeModal(){
		console.log("CLOSEMODAL");
		this.refs.modal.close();
		// this.setState({
		// 	isModalOpen:false
		// });
	}

	render(){
		const {menuDeliveryFlag} = this.props;

		return(

			<View style={styles.bg}>
			  	<View style={styles.ToolBar}>
			  		<View style={{width:80}}>
			  		<TouchableOpacity>
			  			<Image source={require('../assets/images/side_menu_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.SideMenuIcon}/>
			  		</TouchableOpacity>
			  		</View>
			  		<View style={{flex:1,alignItems:'center',marginBottom:-20}}>
			  			<TouchableOpacity onPress={()=>this._onLogo()}>
			  				<Image source={require('../assets/images/logo.png')} resizeMode={Image.resizeMode.contain} style={styles.LogoImage}/>
		  				</TouchableOpacity>
			  		</View>
			  		<View style={{width:80}}/>
			  	</View>
			  	<KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
			  	{
			  		(screen_height > 568) ?
			  		<View style={{height:50, backgroundColor:'#F1F2F2',alignItems:'center', justifyContent:'center'}}>
				  		<Text style={{fontSize:18.5, textAlign:'center'}}>Enter Delivery Address</Text>
				  	</View>
				  	:
				  	<View style={{height:50, backgroundColor:'#F1F2F2',alignItems:'center', justifyContent:'center'}}>
				  		<Text style={{fontSize:18.5, textAlign:'center'}}>Enter Delivery Address</Text>
				  	</View>
			  	}
				  	
				  	<View>
				  		
				  		<GooglePlacesAutocomplete
				  			ref = 'autocomplete'
					  		placeholder='Search'
					        minLength={2} // minimum length of text to search
					        autoFocus={true}
					        listViewDisplayed='auto'    // true/false/undefined
					        fetchDetails={true}
					        renderDescription={(row) => row.description}
					        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true				         
					          this._onLoad(details)
					        }}
					         
					        getDefaultValue={() => { // text input default value
					        	return '';
					        }}

					        query={{				         
					          key: API_Config.Google_API_Key,
					          language: 'en', 
					          types: 'geocode',
					        }}

					        styles={{

					          description: {
					          	fontWeight: 'bold',
					          },

					          textInputContainer:{
					          	backgroundColor:'white'
					          },
					     
					          predefinedPlacesDescription: {
					            color: '#1faadb',
					          },

					          powered: {
					          	height:0,
					          	opacity:0
					          },

							  textInput: {
							    marginLeft: 0,
							    marginRight: 0,
							    height: 45,
							    color: '#5d5d5d',
							    fontSize: 16
							   },

							  listView:{
							    backgroundColor:'white'
							   },

							   separator: {
							    height: 1,
							    backgroundColor: '#c8c7cc',
							  },
						    }}

					        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
					        GoogleReverseGeocodingQuery={{
					          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
					        }}
					        GooglePlacesSearchQuery={{
					          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
					          rankby: 'distance',
					     
					        }}

					        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
					     />
			  		</View>
			  	</KeyboardAvoidingView>
			  	<View style={{backgroundColor:'#7E5D91'}}>
			  		<TouchableOpacity onPress={()=>this._onContinue()} style={{alignItems:'center',height:45,justifyContent:'center'}}>
			  			<Text style={{fontSize:17.5, color:'#FFF'}}>CONTINUE</Text>
			  		</TouchableOpacity>
			  	</View>

			  	{ menuDeliveryFlag != 'select' ?
				  	<View style={{flex:1, backgroundColor:'#F1F2F2',justifyContent:'center',flexDirection:'row'}}>
				  		<View style={{height:50}}>
				  			<Text style={{fontSize:18, marginTop:20}} >Already have an account?</Text>
				  		</View>
				  		<TouchableOpacity style={{height:50}} onPress={()=>this._onSignIn()}>
				  			<Text style={{fontSize:18, marginLeft:10, color:'#DC754C', marginTop:20}}>Sign In</Text>
				  		</TouchableOpacity>
				  	</View>
			  	: 	<View style={{backgroundColor:'#7E5D91', marginTop:5}}>
				  		<TouchableOpacity onPress={()=>this._onCancel()} style={{alignItems:'center',height:45,justifyContent:'center'}}>
				  			<Text style={{fontSize:17.5, color:'#FFF'}}>CANCEL</Text>
				  		</TouchableOpacity>
				  	</View>
			  	}
			  	<Modal isOpen={this.state.isModalOpen} ref={"modal"} swipeToClose={false} backdropOpacity={0.8} style={{flex:1,backgroundColor:'transparent', alignItems:'center'}}>
			  		<NonServiceAreaView closeModal={this.closeModal.bind(this)}/>
			  	</Modal>
			</View>
		)
	}
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor: 'white',
		flexDirection:'column',
		flex:1
	},

	ToolBar:{
		height:75,
		backgroundColor:'#FFF',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		borderBottomWidth:2,
		borderBottomColor:'#EEE',
	},

	LogoImage:{
		width:150,
		height:75,
		marginTop:0,
	},

	SideMenuIcon:{
		width:25,
		height:20,
		marginLeft:10,
		marginTop:20
	},

	SearchIcon:{
		width:25,
		height:25,
		marginRight:0
	},

	ShoppingCartIcon:{
		width:25,
		height:25,
	},

	Sp_ScreenImage:{
		width:250,
		height:350,
	}

})

export default connect(
  state => ({
  	geoCodeForm: state.geoCodeForm, 
  	userGeoCode: state.userGeoCode,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	createcartInfo: state.cartInfo.createcartInfo,
  }),{loadUserGeoCodeResult, setGeoCodeInfo, setSuppliersID, getUserGeoCodeInfo, savePrevPage, saveSuppliers, saveSuppliersType, getClientToken, getCartInfo, createCartInfo, saveCurrentPage})(AddressView);
