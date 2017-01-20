import React, {Component} from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity, ScrollView, TextInput, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {placeOrder, loadPromoCode} from '../redux/actions/orderViewActions';
import {AsyncStorage} from 'react-native';
import Popup from 'react-native-popup';
import CheckBox from 'react-native-check-box';
import SearchBarView from '../components/SearchBarView'
import {getAllCard} from '../redux/actions/cardViewActions';
import {savePrevPage, saveCurrentPage} from '../redux/actions/tabInfoAction';
import {getDeliveryHours} from '../redux/actions/scheduleDeliveryActions';
import {setGeoCodeBillingInfo, getUserGeoCodeInfo} from '../redux/actions/geoCodeActions';
import {getDeviceData} from '../redux/actions/braintreeActions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {static_geoCode_data, static_data, API_Congig} from '../constants';
import {createCartInfo} from '../redux/actions/productCartActions';
import numeral from 'numeral';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import CurrencyInput from 'react-currency-masked-input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;
const SideMenu = require('react-native-side-menu');
const Menu = require('../components/Menu');
import {API_Config} from '../constants';
class OrderView extends Component{
	constructor(props) {
		super(props);
		this.state = {
			address:'',
			unit_number:'',
			delivery_instruction:'',
			promo_code:'',
			driver_tip:0,
			driver_tip_str:'',
			prev_tip:0,
			same_with_ship:false,
			allCardResult: null,
			userGeoAddress: null,
			storeID: null,
			totalDriverTipList: [],
			passwordToken: null,
			orderCard: null,
			orderCardSelectID: null,
			lat: null,
		  	lng: null,
		  	state: null,
		  	isOpen: false,
			selectedItem: 'SelectStore',
			delivery_data: null,
			promo_flag: false,
			orderLoading: false,
			billingAddress: '',
			fetchedData: false,
			discount_type: 3,
			discount: 0,
			key:'',
			maxId:0,
		};
		this_promo = this;
	}
	toggle() {
	    this.setState({
	      isOpen: !this.state.isOpen,
	    });
  	}
	updateMenuState(isOpen) {
	    this.setState({ isOpen, });
	}
	onMenuItemSelected = (item) => {
	    this.setState({
	      isOpen: false,
	      selectedItem: item,
	    });
	}
	componentWillMount(){
		const {passwordTokenResult, allCardResult, deliveryDataArr, cartInfo} = this.props;
		console.log('cartInfo:', cartInfo);
		let cartIdList = [];
		for (i = 0; i < cartInfo.length; i ++) {
			cartIdList.push(parseInt(cartInfo[i].id));
		}
		console.log('cartIdList:', cartIdList);
		var maxId = parseInt(cartIdList[0]);

		for (i = 1; i < cartIdList.length; i++) {
			if (maxId < parseInt(cartIdList[i])) {
				maxId = parseInt(cartIdList[i]);
			}
		}
		console.log('maxId on componentWillMount:', maxId);
		// console.log('Math.max(cartIdList):', Math.max(cartIdList));
		this.setState({maxId: maxId});
		
		AsyncStorage.getItem('billingAddress').then((value) => {
			this.state['billingAddress'] = JSON.parse(value);
			this.setState({billingAddress: JSON.parse(value)});
			this.setState({fetchedData: true});
		}).done();

		if (deliveryDataArr) {
			this.setState({delivery_data: deliveryDataArr});
		}
		if (allCardResult) {
			this.setState({allCardResult: allCardResult});
		}
		passwordToken = 'Bearer ' + passwordTokenResult.access_token;
		this.setState({passwordToken: passwordToken});
		this.props.getAllCard(passwordToken);
		this.props.savePrevPage('productCartView');
		//save datas to Async storage
		AsyncStorage.getItem('unit_number').then((value) => {
			this.setState({unit_number: value});
		}).done();
		AsyncStorage.getItem('delivery_instruction').then((value) => {
			this.setState({delivery_instruction: value});
		}).done();
		AsyncStorage.getItem('promo_code').then((value) => {
			this.setState({promo_code: JSON.parse(value)});
			this_promo.props.loadPromoCode(JSON.parse(value), passwordToken);
		}).done();
		AsyncStorage.getItem('orderCardSelectID').then((value) => {
			this.setState({orderCardSelectID: JSON.parse(value)});
		}).done();
		AsyncStorage.getItem('totalDriverTipList').then((value) => {
			this.setState({totalDriverTipList: JSON.parse(value)});
		}).done();
		AsyncStorage.getItem('same_with_ship').then((value) => {
			console.log('same_with_ship value on getItem:', value);
 			this.setState({same_with_ship: JSON.parse(value)});
 		}).done();
	}
	componentDidMount(){
		this.props.saveCurrentPage('orderView');
	}
	componentWillReceiveProps(nextProps){
		const {allCardResult, 
			promocodeResult, 
			orderFailed, orderResult, 
			clientTokenResult, orderStart, 
			loadingOfPlaceOrder, 
			promocodeFailed, 
			userBillingGeoAddressList
		} = nextProps;
		const {orderLoading} = this.state;
		var clientToken = null;
		if (clientTokenResult) {
			clientToken = 'Bearer ' + clientTokenResult.access_token;
		}
		//get All card
		if (allCardResult) {
			this.setState({allCardResult: allCardResult});
		}
		//get Promocode
		if (promocodeResult) {
			this.setState({discount_type: promocodeResult.type});
			if (promocodeResult == null) {
				this.setState({discount: 0});	
			}
			else {
				this.setState({discount: promocodeResult.discount});
			}
		}
		else {
			this.setState({discount: 0});
		}
		if (promocodeFailed) {
			this.setState({discount_type: 1});
		}
		console.log('loadingOfPlaceOrder on componentWillReceiveProps of OrderView:', loadingOfPlaceOrder);
		if (loadingOfPlaceOrder == true)
			this.setState({orderLoading: true});
		if (orderFailed &&  orderLoading == true) {
			this.showAlert(orderFailed.error);
		}
		if  (orderResult && orderLoading == true) {
			console.log('orderResult && orderLoading on componentWillReceiveProps of OrderView:', orderResult);
			this.props.createCartInfo(clientToken);

			Actions.orderConfirmationView({orderResult: orderResult});
		}
		if (userBillingGeoAddressList) {
			this.setState({billingAddress:userBillingGeoAddressList.formatted_address});
		}
	}
	formatPhoneNumber (phone_number) {
	  var x = phone_number.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
	  phone_number = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
	  this.setState({phone_number:phone_number})
	};
	_checkForResFields(){
		// const {} = this.state;
	}
	_onPayment(){
	}
	_onAddCard(){
		Actions.addCardView({fromView: 'fromOrderView'});
	}
	_onEditCard(cardData) {
		//Actions.editCardView({cardData: cardData});
		this.setState({orderCard: cardData});
		this.setState({orderCardSelectID: cardData.id});
		AsyncStorage.setItem('orderCardSelectID', JSON.stringify(cardData.id));
	}
	_onDeliveryTime(storeData, delivery_data){
		const {passwordToken} = this.state;
		this.props.getDeliveryHours(storeData.id, passwordToken);
		
		Actions.scheduleDeliveryView({cartInfo: storeData, delivery_data: delivery_data});		
	}
	_onViewItems(storeData){
		const {storeID} = this.state;
		if (storeID == storeData.id) {
			this.setState({storeID: null});
		}
		else {
			this.setState({storeID: storeData.id});
		}
	}
	_onMakeBillingSameAsShipping(){
		const {userGeoAddressList} = this.props;
		if (this.state.same_with_ship == true) {
			this.setState({billingAddress: null});
		}
		else {
			this.setState({billingAddress: userGeoAddressList.userGeoAddress.formatted_address});	
		}
		this.setState({same_with_ship:!this.state.same_with_ship})
		AsyncStorage.setItem('same_with_ship', JSON.stringify(!this.state.same_with_ship));
	}
	saveUnitNumber(value) {
		AsyncStorage.setItem('unit_number', value.unit_number);
		this.setState({unit_number: value.unit_number});
	}
	saveDeliveryInstruction(value) {
		AsyncStorage.setItem('delivery_instruction', value.delivery_instruction);
		this.setState({delivery_instruction: value.delivery_instruction});
	}
	savePromoCode() {
		let {promo_code} = this_promo.state;
		const {passwordToken} = this_promo.state;
		
		AsyncStorage.setItem('promo_code', JSON.stringify(promo_code));

		if (promo_code != null && promo_code != '') {
			
			this_promo.props.loadPromoCode(promo_code, passwordToken);
			this_promo.setState({promo_flag:true});
		}
		if (promo_code == '') {
			this_promo.setState({discount_type: 3});
			this_promo.setState({discount: '0'});
		}
	
	}
	setKey(event) {
		this.setState({key:event.nativeEvent.key});
	}
	setDriverTip(cardID, tipList, driver_tip) {
		// console.log('tipList on setDriverTip:', tipList);
		var {key, totalDriverTipList} = this.state;
		var value = driver_tip;
		console.log('cardID:', cardID);
		console.log('driver_tip:', driver_tip);
		// console.log('totalDriverTipList:', totalDriverTipList);
		if (key != 'Backspace')
		{
			console.log('key != Backspace');
			console.log('value on setDriverTip case1:', value);
			console.log('tipList[parseInt(cardID)]:', tipList[parseInt(cardID)]);
			if (tipList[parseInt(cardID)] == 0)
			{
				console.log('tipList[parseInt(cardID)] == 0');
				// if (value > 0)
				// 	value = value;
				// else
					value = value * 10;
			}
			else
				value = value * 10;
		}
		else
		{
			console.log('value on setDriverTip case2:', value);
			if (value < 0.1)
				value = 0;
			else
				value = value / 10;
		}
		if (value > 25)
			value = 25;
		
		// if (totalDriverTipList == null)
		// {
		// 	console.log('totalDriverTipList == null:', totalDriverTipList);
		// 	totalDriverTipList = new Array();
		// }
		// console.log('totalDriverTipList', totalDriverTipList);
		// var num = parseFloat(value).toFixed(2);
		// var num = numeral(value).format('0.00');
		console.log('value before num_str:', value);
		var num_str = numeral(value).format('0.00').toString();
		console.log('num_str:', num_str);
		// this.setState({driver_tip_str: num_str});
		
		tipList[parseInt(cardID)] = num_str;
		//totalDriverTipList.splice(parseInt(cardID), 0, parseFloat(value));
		this.setState({totalDriverTipList: tipList});
		AsyncStorage.setItem('totalDriverTipList', JSON.stringify(totalDriverTipList));
		
	}
	formatDriverTip(info) {
		if (key != 'Backspace')
		{
			value = (value * 100 + parseInt(event.nativeEvent.key)) / 100;
			if (value > 25)
				value = 25;
		}
		else
		{
			value = value / 10;
		}
		var num_str = numeral(value).format('0.00').toString();
		this.setState({driver_tip_str: num_str});
		
		totalDriverTipList[parseInt(cardID)] = num_str;
		this.setState({totalDriverTipList: totalDriverTipList});
		AsyncStorage.setItem('totalDriverTipList', JSON.stringify(totalDriverTipList));
	}
	_onLoad(details) {
		billingAddress = this.getAddressInfo(details);
		AsyncStorage.setItem('billingAddress', JSON.stringify(billingAddress.formatted_address));
		this.props.setGeoCodeBillingInfo(billingAddress);
	}
	getAddressInfo(details) {
		const geoCode = details.geometry.location;
		
		const lat = geoCode.lat;
		const lng = geoCode.lng;
		var formatted_address;
		var addressLength = details.address_components.length
		if(addressLength>0)
        {
        	formatted_address = details.formatted_address;
            //var locationDetails=details.formatted_address;
            var  value=formatted_address.split(",");
            
            count=value.length;
            
             country=value[count-1];
             state=value[count-2];
             city=value[count-3];
             street=value[count-4];
             pin=state.split(" ");
             zipCode=pin[pin.length-1];
             state=state.replace(zipCode,' ');
             newState = state.replace(/\s/g, '');
        }
        var address_components = details.address_components;
        var route, country, administrative_area_level_1, locality, postal_code, street_number;
        
        for (i = 0; i < address_components.length; i ++) {
        	if (address_components[i].types == 'route')
        		route = address_components[i].long_name;
        	if (address_components[i].types == 'country')
        		country = address_components[i].long_name;
        	if (address_components[i].types[0] == 'administrative_area_level_1')
        		administrative_area_level_1 = address_components[i].long_name;
        	if (address_components[i].types[0] == 'locality')
        		locality = address_components[i].long_name;
        	if (address_components[i].types == 'postal_code')
        		postal_code = address_components[i].long_name;
        	if (address_components[i].types == 'street_number')
        		street_number = address_components[i].long_name;
        }
       	
       	addressData = {};
       	addressData['route'] = route;
       	addressData['country'] = country;
       	addressData['administrative_area_level_1'] = administrative_area_level_1;
       	addressData['locality'] = locality;
       	addressData['postal_code'] = postal_code;
       	addressData['street_number'] = street_number;
       	addressData['lat'] = lat;
       	addressData['lng'] = lng;
       	addressData['formatted_address'] = formatted_address;
		
       	return addressData;
	}
	showAlert(title, message) {
		Alert.alert(
			title,
			message,
			[
				{text: 'OK', onPress: () => console.log('alert'), style: 'cancel'},
			]
		)
	}
	getDeviceData() {
	
		// this.props.getDeviceData();
	}
	_onCheckOut(){
		this.getDeviceData();
		var {deliveryDataArr, userGeoAddressList, userBillingGeoAddressList, cartInfo, createcartInfo} = this.props;
		var {totalDriverTipList, promo_code, delivery_instruction, passwordToken, unit_number, same_with_ship} = this.state;
		const credit_card = this.state.orderCardSelectID;
		var deliveryAddress = this.getAddressInfo(userGeoAddressList.userGeoAddress);
		var cart_products = {};
		var cart_supplier = [];
		var tipTotal = {};
		var deliveryDate = {};
		var deliveryTime = {};
		var cart_id = createcartInfo.id;
		if (cartInfo) {
			for (i = 0; i < cartInfo.length; i ++) {
				cart_supplier.push(cartInfo[i]['id']);
				if (totalDriverTipList != null && totalDriverTipList[cartInfo[i]['id']])
					tipTotal[cartInfo[i]['id']] = totalDriverTipList[cartInfo[i]['id']];
				for (j =0; j < cartInfo[i]['products'].length; j ++) {
					pID = cartInfo[i]['products'][j]['id'];
					cart_products[pID] = ({'quantity': cartInfo[i]['products'][j]['quantity']});
				}
			}
		}
		console.log('deliveryDataArr _onCheckOut:', deliveryDataArr);
		Object.keys(deliveryDataArr).map(function (key) {
  			var item = deliveryDataArr[key]

  			var dateData ={};
			dateData[key] = item.deliveryDate;
			deliveryDate[key] = dateData[key];

			var timeData ={};
			timeData[key] = item.deliveryTime;
			deliveryTime[key] = timeData[key];
  		});




		// if (deliveryDataArr) {
		// 	for (i = 0; i < deliveryDataArr.length; i ++) {
		// 		for (j = 0; j < cartInfo.length; j ++) {

		// 			if (deliveryDataArr[i].storeID == cartInfo[j].id) {
		// 				deliveryDate[cartInfo[j].id] = deliveryDataArr[i].deliveryDate;
		// 				deliveryTime[cartInfo[j].id] = deliveryDataArr[i].deliveryTime;
		// 				break;
		// 			}
		// 		}
		// 	}
		// }
		var add_new_delivery_address = 1;
		var new_delivery_address = userGeoAddressList.userGeoAddress.formatted_address;
		var new_delivery_address_apt_suite = unit_number;
		var add_new_billing_address = 1;
		var new_billing_address = '';
		if (same_with_ship == true)
		{
			new_billing_address = userGeoAddressList.userGeoAddress.formatted_address;
		}
		if (userBillingGeoAddressList && same_with_ship == false) {
			new_billing_address = this.state.billingAddress;
		}
		
		var new_billing_apt_suite = 3;
		var device_data = null;
		var str_alert_message = '';
		var alert_coming = false;
		if (deliveryDataArr == null || Object.keys(deliveryDataArr).length != cartInfo.length) {
			str_alert_message += 'Please select delivery date and time.\n';
			alert_coming = true;
		}
		if (credit_card == null) {
			str_alert_message += 'Please select payment method.\n';
			alert_coming = true;
		}
		if (new_delivery_address_apt_suite == '') {
			str_alert_message += 'Please input Unit Number.\n';
			alert_coming = true;
		}
		if (new_billing_address == '') {
			str_alert_message += 'Please input billing address.\n';
			alert_coming = true;
		}
		if (alert_coming)
		{
			this.showAlert('Missing', str_alert_message);
			return;
		}

		console.log('deliveryDate on OrderView:', deliveryDate);
		console.log('deliveryTime on OrderView:', deliveryTime);
		this.props.placeOrder(cart_products, cart_supplier, delivery_instruction, promo_code, tipTotal, deliveryDate, deliveryTime, 
			add_new_delivery_address, new_delivery_address, deliveryAddress, new_delivery_address_apt_suite, 
			add_new_billing_address, new_billing_address, userBillingGeoAddressList, new_billing_apt_suite, credit_card, device_data, cart_id, passwordToken);
	}
	setPromo(promo_code) {
		this.setState({promo_code: promo_code});
		if (promo_code == '') {
			this.setState({promo_flag: 'flag'});
			this_promo.setState({discount_type: 3});
			this_promo.setState({discount: '0'});
		}
		else {
			this_promo.setState({discount_type: 3});
		}
	}
	
	render(){
		const instance = this;
		const {allCardResult, storeID, billingAddress, same_with_ship, maxId} = this.state;
		const {cartInfo, userGeoAddressList, userBillingGeoAddressList} = this.props;
		let {totalDriverTipList} = this.state;

		console.log('maxId:', maxId);
		
		let {discount, delivery_data, discount_type} = this.state;	
		var totalDriverTip = 0, imgUrl = null, orderSubTotal = 0, supplierTotal = 0, delivery_fee = 0, tax_rate = 0;
		if (totalDriverTipList == null || totalDriverTipList.length == 0) {
			if (totalDriverTipList == null)
				totalDriverTipList = [];
			for (i = 0; i < maxId; i ++) {
				totalDriverTipList.push('0');
			}
			for (i = 0; i < cartInfo.length; i++) {
				eachStoreTotal = 0;
				for (j = 0; j < cartInfo[i]['products'].length; j++) {
					eachStoreTotal += cartInfo[i]['products'][j]['real_price'] * cartInfo[i]['products'][j]['quantity'];
				}
				if (eachStoreTotal > 250)
					eachStoreTotal = 250;
				totalDriverTipList[cartInfo[i].id] = numeral(eachStoreTotal * 0.1).format('0.00');
			}
			
		}
		if (totalDriverTipList) {
			for (i = 0; i < totalDriverTipList.length; i ++) {
				val = 0;
				if (totalDriverTipList[i] == '0' || totalDriverTipList[i] == '' || totalDriverTipList[i] == null) {
					val = 0;
				}
				else {
					val = totalDriverTipList[i];
				}
				totalDriverTip += parseFloat(val);
			}
		}

		console.log('totalDriverTipList on render:', totalDriverTipList);
		
		for (i = 0; i < cartInfo.length; i ++) {
			supplierTotal = 0;
			delivery_fee += cartInfo[i]['delivery_fee'];
			for (j = 0; j < cartInfo[i]['products'].length; j++) {
				orderSubTotal += cartInfo[i]['products'][j]['real_price'] * cartInfo[i]['products'][j]['quantity'];
				supplierTotal += cartInfo[i]['products'][j]['real_price'] * cartInfo[i]['products'][j]['quantity'];
			}
			tax_rate += parseFloat(cartInfo[i]['tax_rate']) / 100 * parseFloat(supplierTotal);	
		}
		var x = Math.floor(tax_rate * 100) / 100;
		tax_rate = x.toFixed(2);
		var orderSubTotal1 = 0;
		if (discount == null) {
			 discount = 0;
			 orderSubTotal1 = orderSubTotal;
		}
		else {
			if (discount_type == 1) {
				discount = parseFloat(orderSubTotal /100 * discount);
			}
			orderSubTotal1 = parseFloat(orderSubTotal) - parseFloat(discount);
		}
		var orderTotal = parseFloat(orderSubTotal1) + parseFloat(delivery_fee) + parseFloat(tax_rate) + parseFloat(totalDriverTip);
		orderTotal = numeral(orderTotal).format('0.00');
		orderSubTotal = numeral(orderSubTotal).format('0.00');
		discount = numeral(discount).format('0.00');
		delivery_fee = numeral(delivery_fee).format('0.00');
		tax_rate = numeral(tax_rate).format('0.00');
		totalDriverTip = numeral(totalDriverTip).format('0.00');

		var monthList=['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>
				<View style={styles.bg}>
					<SearchBarView onPress={()=>this.toggle()} addFlag='true'/>
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps={true}
						keyboardDismissMode = {'on-drag'}>
						<TouchableOpacity onPress={()=>dismissKeyboard()}>
							<View style={{height:70,backgroundColor:'#F1F2F2',flexDirection:'column'}}>
						  		<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:25,color:'#7e5d91',fontWeight:'bold'}}>Order Summary</Text>
						  		</View>
						  	</View>
						</TouchableOpacity>
					  	<View>
					  		<View style={{flexDirection:'row', alignItems:'center'}}>
					  			<View>
						  			<Image source={require('../assets/images/pin.png')} resizeMode={Image.resizeMode.center} style={{height:45, backgroundColor:'#FFF',width:30}}/>
						  		</View>
						  		<View style={{height:45, backgroundColor:'#FFF', width:screen_width-30, justifyContent:'center'}}>
						  			<Text style={{fontSize:15}}>{userGeoAddressList.userGeoAddress.formatted_address}</Text>
						  		</View>
					  		</View>	
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  	</View>
					  	<View>
					  		<TextInput
					  			ref='unit_number'
					  			returnKeyType={"next"}
					  			onSubmitEditing={()=>this.refs.delivery_instruction.focus()}
				  				onChangeText={unit_number=>this.saveUnitNumber({unit_number})}
				  				autoCorrect={false} 
    							autoCapitalize='none'
				  				value={this.state.unit_number}
				  				placeholder={'Unit Number'}
				  				placeholderTextColor="#414042"
				  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15}}
					  		/>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  	</View>
					  	<View>
					  		<TextInput
					  			ref='delivery_instruction'
					  			returnKeyType={"next"}
					  			multiline={true}
					  			onSubmitEditing={()=>dismissKeyboard()}
					  			// onSubmitEditing={()=>this.refs.promo_code.focus()}
				  				onChangeText={delivery_instruction=>this.saveDeliveryInstruction({delivery_instruction})}
				  				value={this.state.delivery_instruction}
				  				placeholder={'Delivery Instruction..'}
				  				placeholderTextColor="#414042"
				  				style={{height:150, backgroundColor:'#FFF',fontSize:15,paddingLeft:15}}
					  		/>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:15}}></View>
					  	</View>
					  	<View>
						  	<TouchableOpacity onPress={()=>this._onPayment()} style={styles.paymentStyle}>
					  			<Text style={styles.arrowTextStyle}>Payment Method</Text>
					  		</TouchableOpacity>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  	</View>
					
					{ allCardResult != null ? 
						allCardResult.map(function(item, index) 
						{
							if (item.type='Visa') {
								imgUrl = require('../assets/images/card_visa.png');
							}
							else {
								imgUrl = require('../assets/images/card_master.png');	
							}
							
							if (instance.state.orderCardSelectID == item.id) {
							  	return (
							  		<View key={index}>
									  	<TouchableOpacity onPress={()=>instance._onEditCard(item)}>
									  		<View style={styles.paymentStyle}>
									  			<Text style={styles.arrowTextStyle}>{item.nickname}</Text>
								  			</View>
								  			<View style={styles.cardViewStyle}>
								  				<View style={{width:screen_width-50, flexDirection:'row', alignItems:'center'}}>
									  				<Image source={imgUrl} resizeMode={Image.resizeMode.contain} style={{height:40}}/>
									  				<Text style={{marginRight:10}}>{item.last_4}</Text>
									  				<Text>{item.exp_month}</Text>
									  				<Text>/</Text>
									  				<Text>{item.exp_year}</Text>
								  				</View>
								  				<Image source={require('../assets/images/circle_check.png')} resizeMode={Image.resizeMode.contain} style={{height:30, width:30}}/>
								  			</View>
								  		</TouchableOpacity>
								  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
							  		</View>
							  	)
							} else {
								return (
							  		<View key={index}>
									  	<TouchableOpacity onPress={()=>instance._onEditCard(item)}>
									  		<View style={styles.paymentStyle}>
									  			<Text style={styles.arrowTextStyle}>{item.nickname}</Text>
								  			</View>
								  			<View style={styles.cardViewStyle}>
									  			<View style={{width:screen_width-50, flexDirection:'row', alignItems:'center'}}>
									  				<Image source={imgUrl} resizeMode={Image.resizeMode.contain} style={{height:40}}/>
									  				<Text style={{marginRight:10}}>{item.last_4}</Text>
									  				<Text>{item.exp_month}</Text>
									  				<Text>/</Text>
									  				<Text>{item.exp_year}</Text>
									  			</View>
									  			<Image source={require('../assets/images/circle_uncheck.png')} resizeMode={Image.resizeMode.contain} style={{height:30, width:30}}/>
								  			</View>
								  		</TouchableOpacity>
								  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
							  		</View>
							  	)	
							}
						})				  	
						: null					
					}
					  	<View>
						  	<TouchableOpacity onPress={()=>this._onAddCard()} style={styles.paymentStyle}>
					  			<Text style={styles.arrowTextStyle}>Add New Card</Text>
					  			<Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
					  		</TouchableOpacity>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:15}}></View>
					  	</View>
					  	<View>
						  	<TouchableOpacity onPress={()=>this._onMakeBillingSameAsShipping()} style={styles.paymentStyle}>
					  			<Text style={styles.arrowTextStyle}>Billing Address same as Shipping</Text>
					  			{
						  			same_with_ship == true
							  		?	<Image source={require('../assets/images/circle_check.png')} resizeMode={Image.resizeMode.contain} style={{height:30, width:30}}/>
							  		:	<Image source={require('../assets/images/circle_uncheck.png')} resizeMode={Image.resizeMode.contain} style={{height:30, width:30}}/>	
						  		}
					  		</TouchableOpacity>
					  		{
					  			same_with_ship == true ?
					  			null
					  			:
					  			(this.state.fetchedData == true)?
					  			<View>
					  				<GooglePlacesAutocomplete
								  		placeholder='Search'
								        minLength={2} // minimum length of text to search
								        listViewDisplayed='auto'    // true/false/undefined
								        fetchDetails={true}
								        renderDescription={(row) => row.description}
								        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true				         
								          this._onLoad(details)
								        }}
								         
								        getDefaultValue={() => {// text input default value
								        	console.log("Update Default Value");
								        	return this.state.billingAddress;
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
								: null
						  	}
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:15}}></View>
					  	</View>
					  	
				{cartInfo != null ? 
					cartInfo.map(function(item, index) {
						totalPrice = 0, item_count = 0;
						for (j = 0; j < item.products.length; j++) {
							totalPrice += item.products[j].real_price * item.products[j].quantity;
							item_count += item.products[j].quantity;
						}
						return (
						  	<View key={index} style={{flexDirection:'column'}}>
							  	<View>
								  	<View>
								  		<View style={styles.paymentStyle}>
								  			<Text style={styles.viewItemsTextStyle}>{item.name}</Text>
								  			<TouchableOpacity onPress={()=>instance._onViewItems(item)}>
								  				<Text style={styles.viewItemsStyle} numberOfLines={1}>View Items</Text>
								  			</TouchableOpacity>
							  				{item.id !=storeID 
							  					? <Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
								  				: <Image source={require('../assets/images/down_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
							  				}
							  			</View>
							  			<View style={styles.storeViewStyle}>
						  				{
						  					(item_count == 1) ?
					  						<Text style={{fontSize:14, fontStyle: 'italic', marginLeft:15}} numberOfLines={1} >{item_count} item</Text>
						  					:
						  					<Text style={{fontSize:14, fontStyle: 'italic', marginLeft:15}} numberOfLines={1} >{item_count} items</Text>
						  				}
							  				<View style={{height:10}}/>
							  				<Text style={{fontSize:14, marginLeft:15}}>Subtotal: ${numeral(totalPrice).format('0.00')}</Text>
							  			</View>
							  		</View>
							  		{
							  			storeID == item.id ?
							  				item.products.map(function(item1, index1) {	
							  					unitTotal = numeral(item1.quantity * item1.real_price).format('0.00');
							  					return (					  					
								  					<View key={index1} style={{flexDirection:'row', backgroundColor:'#FFF', paddingLeft: 7, paddingRight:7, paddingTop:10, paddingBottom: 10, justifyContent:'space-between'}}>
								  						<View style={{flexDirection:'row'}}>
									  						<Image source={{uri:(API_Config.baseUrl_token+item1.featured_image)}} resizeMode={Image.resizeMode.contain} style={{width: 45, 
			   														height: 45, marginLeft:5 }}/>
			   												<View style={{flexDirection:'column', marginLeft : 13}}>
			   													<Text style={{fontWeight:'bold', width:screen_width - 80}}>{item1.name}</Text>
			   													<View style={{flexDirection:'row'}}>
			   														<Text style={{width:(screen_width - 80) * 0.5, textAlign:'left'}}>{item1.unit_measurement}</Text>
			   														<Text style={{width:(screen_width - 80) * 0.5, textAlign:'right'}}>${unitTotal}</Text>
			   													</View>
			   													<Text>Qty: {item1.quantity} | Unit Price: ${numeral(item1.real_price).format('0.00')}</Text>
			   												</View>
			   											</View>
								  					</View>
								  				)
							  				})
							  			: null
							  		}
							  	</View>
							  	<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
						  		{	//get Asynstorage data
						  			delivery_data != null ?
									  		delivery_data[item.id]
									  		?  	<View>
												  	<TouchableOpacity onPress={()=>instance._onDeliveryTime(item, delivery_data[item.id])} style={styles.paymentStyle}>
											  			<Text style={styles.arrowTextStyle}>{monthList[parseInt(delivery_data[item.id].deliveryDate.split('-')[1])]+' '+delivery_data[item.id].deliveryDate.split('-')[2]} / {delivery_data[item.id].deliveryTime}</Text>
											  			<Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
											  		</TouchableOpacity>
											  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
											  	</View>
											:  	<View>
												  	<TouchableOpacity onPress={()=>instance._onDeliveryTime(item, null)} style={styles.paymentStyle}>
											  			<Text style={styles.arrowTextStyle}>Delivery Date / Time: Please Select</Text>
											  			<Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
											  		</TouchableOpacity>
											  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
											  	</View>
									: 	<View>
										  	<TouchableOpacity onPress={()=>instance._onDeliveryTime(item, null)} style={styles.paymentStyle}>
									  			<Text style={styles.arrowTextStyle}>Delivery Date / Time: Please Select</Text>
									  			<Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
									  		</TouchableOpacity>
									  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
									  	</View>
							  	}
							  	<Text style={styles.reportTextStyle1} numberOfLines={1}>Tip:</Text>
							  	<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							  		<View style={{flex:1, alignItems:'center', justifyContent:'center', height:45, backgroundColor:'#FFF'}}>
							  		{
								  		(totalDriverTipList[item.id] == 0)
								  		?	<Text style={{width:25, backgroundColor:'#FFF',fontSize:15,paddingLeft:15, textAlign:'right', color:'#414042'}}>$</Text>
								  		: 	<Text style={{width:25, backgroundColor:'#FFF',fontSize:15,paddingLeft:15, textAlign:'right'}}>$</Text>
								  	}
							  		</View>

							  		<TextInput
							  			ref='driver_tip'
							  			returnKeyType={"next"}
							  			keyboardType={'numeric'}
							  			// onSubmitEditing={()=>this.refs.delivery_instruction.focus()}
						  				onChangeText={driver_tip=>instance.setDriverTip(item.id, totalDriverTipList, driver_tip)}
						  				onKeyPress={(event) => instance.setKey(event)}
						  				// onSelectionChange={(event) => console.log(event.nativeEvent.selection)}
						  				// value={numeral(this.state.driver_tip).format('0.00')}
						  				value={totalDriverTipList[item.id]}
						  				placeholder={'Tip'}
						  				placeholderTextColor="#414042"
						  				style={{height:45, width:screen_width - 25, backgroundColor:'#FFF',fontSize:15,paddingLeft:2}}
							  		/>
							  	</View>
							  	<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:15}}></View>
							</View>
						)
					})
					: null
				}
					  	<View>
					  		<TextInput
					  			ref='promo_code'
					  			returnKeyType={"next"}
					  			onSubmitEditing={this.savePromoCode}
				  				autoCorrect={false} 
    							autoCapitalize='none'
				  				onChangeText={promo_code=>this.setPromo(promo_code)}
				  				value={this.state.promo_code}
				  				placeholder={'Enter Promo Code'}
				  				placeholderTextColor="#414042"
				  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15}}
					  		/>
					  	{this.state.promo_flag == true
					  		? 	discount != 0
						  		?	<Text style={{marginLeft:10, marginTop:5, color:'#0F0'}}>Your discount has been applied</Text>
						  		:	discount_type != 3
						  			? 	this.state.promo_code == ''
							  			? 	null
							  			: 	<Text style={{marginLeft:10, marginTop:5, color:'#F00'}}>{this.props.promocodeFailed}</Text>
						  			: null
						  	: 	discount_type == 1
						  		? 	(this.state.promo_code == '' || this.state.promo_code == null)
						  			? 	null
						  			: 	<Text style={{marginLeft:10, marginTop:5, color:'#F00'}}>{this.props.promocodeFailed}</Text>
						  		: 	null
					  	}
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:15}}></View>
					  	
					  	</View>
					  	<View style={styles.reportStyle}>
					  		<Text style={styles.reportTextStyle1} numberOfLines={1}>Order Subtotal:</Text>
					  		<Text style={styles.reportTextStyle2} numberOfLines={1}>${orderSubTotal}</Text>
					  	</View>
					  	<View style={styles.reportStyle}>
					  		<Text style={styles.reportTextStyle1} numberOfLines={1}>Delivery:</Text>
					  		<Text style={styles.reportTextStyle2} numberOfLines={1}>${delivery_fee}</Text>
					  	</View>
					  	<View style={styles.reportStyle}>
					  		<Text style={styles.reportTextStyle1} numberOfLines={1}>Sales Tax:</Text>
					  		<Text style={styles.reportTextStyle2} numberOfLines={1}>${tax_rate}</Text>
					  	</View>
					  	<View style={styles.reportStyle}>
					  		<Text style={styles.reportTextStyle1} numberOfLines={1}>Tip:</Text>
					  		<Text style={styles.reportTextStyle2} numberOfLines={1}>${totalDriverTip}</Text>
					  	</View>
					  	<View style={styles.reportStyle}>
					  		<Text style={styles.reportTextStyle1} numberOfLines={1}>Discount:</Text>
					  		<Text style={styles.reportTextStyle2} numberOfLines={1}>${discount}</Text>
					  	</View>
					  	<View style={styles.reportStyle2}>
					  		<Text style={styles.totalOrderTextStyle1} numberOfLines={1}>Order Total:</Text>
					  		<Text style={styles.totalOrderTextStyle2} numberOfLines={1}>${orderTotal}</Text>
					  	</View>
					  	<TouchableOpacity onPress={()=>this._onCheckOut()} style={styles.checkoutBtn}>
						  	<Text style={{fontSize:25,color:'#FFF', fontWeight:'bold'}}>CHECKOUT</Text>
						</TouchableOpacity>
					</KeyboardAwareScrollView>
				  	
				</View>
			</SideMenu>
		)
	};
}
const styles= StyleSheet.create({
	bg: {
		backgroundColor: '#F1F2F2',
		flexDirection:'column',
		flex:1
	},
	checkoutBtn : {
		flex:1,
		backgroundColor:'#7e5d91',
		justifyContent:'center',
		alignItems:'center',
		width:screen_width,
		height:50,
	},
	paymentStyle : {
		height:45, 
		backgroundColor:'#FFF',
		alignItems:'center',
		flex:1, 
		flexDirection:'row'
	},
	paymentStyle_card : {
		height:45, 
		alignItems:'center',
		flex:1, 
		flexDirection:'row'
	},
	arrowImgStyle : {
		height:45, 
		backgroundColor:'#FFF',
		width:45
	},
	arrowTextStyle : {
		fontSize:15, 
		marginLeft:15, 
		width:screen_width-65,
	},
	cardViewStyle : {
		backgroundColor:'#FFF',
		height:70,
		alignItems:'center',
		flexDirection:'row',
	},
	cardViewStyle_card : {
		backgroundColor:'#69C52D',
		height:70,
		alignItems:'center',
		flexDirection:'row',
	},
	viewItemsStyle : {
		color:'#7e5d91',
	},
	viewItemsTextStyle : {
		fontSize:15, 
		fontWeight:'bold', 
		marginLeft:15, 
		width:screen_width-135,
	},
	storeViewStyle : {
		backgroundColor:'#FFF',
		height:70,
		// alignItems:'center',
		// justifyContent:'flex-start',
		flexDirection:'column',
	},
	reportStyle : {
		height:45, 
		alignItems:'center',
		flex:1, 
		flexDirection:'row',
	},
	reportTextStyle1 : {
		marginLeft:15,
		fontSize:16, 
		fontWeight:'bold', 
		width:screen_width - 115,
	},
	reportTextStyle2 : {
		fontSize:16, 
		textAlign:'right',
		fontWeight:'bold',
		marginRight:15, 
		width:85,
	},
	reportStyle2 : {
		backgroundColor:'#FFF',
		height:55, 
		alignItems:'center',
		flex:1, 
		flexDirection:'row',
	},
	totalOrderTextStyle1 : {
		marginLeft:15,
		fontSize:18, 
		width:screen_width - 115,
	},
	totalOrderTextStyle2 : {
		fontSize:19, 
		textAlign:'right',
		marginRight:15, 
		width:85,
	},
	
})
export default connect(
  state => ({
  	loadingOfPlaceOrder: state.orderView.loadingOfPlaceOrder,
  	orderStart: state.orderView.orderStart,
  	orderResult: state.orderView.orderResult,
  	orderFailed: state.orderView.orderFailed,
  	allCardResult: state.cardInfo.allCardResult,
  	cartInfo: state.cartInfo.cartInfo,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	passwordTokenResult: state.userRegister.passwordTokenResult,
  	userGeoAddressList: state.geoCodeForm.selectedList,
  	userBillingGeoAddressList: state.geoCodeForm.selectedBillingList,
  	geoCodeForm: state.geoCodeForm, 
  	userGeoCode: state.userGeoCode,
  	promocodeResult: state.orderView.promocodeResult,
  	promocodeFailed: state.orderView.promocodeFailed,
  	deliveryDataArr: state.deliveryHours.deliveryDataArr,
  	createcartInfo: state.cartInfo.createcartInfo,
  }),{createCartInfo, getAllCard, savePrevPage, getDeliveryHours, loadPromoCode, setGeoCodeBillingInfo, getUserGeoCodeInfo, placeOrder, getDeviceData, saveCurrentPage})(OrderView);