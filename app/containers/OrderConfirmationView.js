import React, {Component} from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import SearchBarView from '../components/SearchBarView'
import {connect} from 'react-redux';
import {getCartInfo} from '../redux/actions/productCartActions';
import {AsyncStorage} from 'react-native';
import {saveDeliveryData} from '../redux/actions/scheduleDeliveryActions';
import {saveCurrentPage} from '../redux/actions/tabInfoAction';
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;
const SideMenu = require('react-native-side-menu');
const Menu = require('../components/Menu');

class OrderConfirmationView extends Component{

	constructor(props) {
	  super(props);

	  this.state = {
		isOpen: false,
		selectedItem: 'SelectStore',
	  };		
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
	}
	componentDidMount(){
		AsyncStorage.removeItem('billingAddress');
		AsyncStorage.removeItem('unit_number');
		AsyncStorage.removeItem('delivery_instruction');
		AsyncStorage.removeItem('promo_code');
		AsyncStorage.removeItem('orderCardSelectID');
		AsyncStorage.removeItem('totalDriverTipList');
		AsyncStorage.removeItem('same_with_ship');
		AsyncStorage.removeItem('delivery_data');
		var DataArr = {};
		this.props.saveDeliveryData(DataArr);

		this.props.saveCurrentPage('orderConfirmationView');
	}

	componentWillReceiveProps(nextProps){
		const {clientTokenResult, createcartInfo, cartInfo} = nextProps;

		var clientToken = null;

		if (clientTokenResult) {
			clientToken = 'Bearer ' + clientTokenResult.access_token;
		}

		if (createcartInfo && clientToken != null) {
			UUID = createcartInfo.guest_id;
			cartID = createcartInfo.id;
			this.props.getCartInfo(cartID, UUID, clientToken);
		}
	}

	_onShopMore() {

		Actions.productCategory();
	}

	render(){
		const {newCartFlag} = this.state;
		const {orderResult} = this.props;
		var orderNumberArray = [];
		if (orderResult != null) {
			for (i=0; i < orderResult.length; i++){
				orderNumberArray.push(orderResult[i].id);
			}
			console.log('orderResult', orderResult);
			console.log('orderNumberArray', orderNumberArray);
			if (orderNumberArray.length > 0)
			{
				if (orderNumberArray.length == 1)
					str_order ='order #';
				else
					str_order ='orders #';
			}

			if (orderNumberArray.length > 0) {
				str_order += orderNumberArray[0];
				if (orderNumberArray.length > 1)
				{
					for (i=1; i < orderNumberArray.length; i++){
						str_temp = ' and #' + orderNumberArray[i];	
						str_order += str_temp;
					}
				}
			}
		}

		var data = {};
	
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>

				<View style={styles.bg}>
					<SearchBarView onPress={()=>this.toggle()} orderPage='true' />
					<View style={{justifyContent:'center', alignItems:'center', marginTop:80}}>
						<View>
							<Image source={require('../assets/images/order_success.png')}resizeMode={Image.resizeMode.contain} style={styles.success_image}/>
						</View>
						<View style={{marginTop:20}}>
							<Text style={{fontSize:25,color:'#DC754C',fontWeight:'bold', justifyContent:'center'}}>Thank you for your order</Text>
						</View>
						<View style={{marginTop:20, justifyContent:'center', alignItems:'center'}}>
							<Text style={{width:screen_width * 0.8, textAlign:'center'}}>We have successfully received your {str_order}</Text>
							<Text style={{marginTop:5}}>Check your email for your</Text>
							<Text>order confirmation</Text>
						</View>
					</View>
					<View style={styles.shopMoreBtn}>
				  		<TouchableOpacity onPress={()=>this._onShopMore()} style={{backgroundColor:'#7e5d91',justifyContent:'center', alignItems:'center',flex:1}}>
				  			<Text style={{fontSize:25,color:'#FFF', fontWeight:'bold'}}>SHOP MORE</Text>
				  		</TouchableOpacity>
			  		</View>
				</View>
			</SideMenu>
		)
	};
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor: '#F1F2F2',
		flexDirection:'column',
		flex:1,
	},

	success_image : {
		alignItems:'center',
		justifyContent:'center',
		width: screen_width * 0.45,
		height: screen_width * 0.45,
	},

	forgotView : {
	flex:1, 
	backgroundColor:'#F1F2F2',
	justifyContent:'center',
	flexDirection:'row', 
	position:'absolute', 
	bottom:50, 
	height:50, 
	width:screen_width, 
	alignItems:'center'},

	shopMoreBtn : {
		flex:1,
		flexDirection:'column', 
		backgroundColor:'#7e5d91',
		justifyContent:'center', 
		position:'absolute',
		bottom:0,
		width:screen_width,
		height:50,
		alignItems:'center',
	},


})

export default connect(
	state => ({
		clientTokenResult: state.userRegister.clientTokenResult,
		userGeoAddressList: state.geoCodeForm.selectedList,
		createcartInfo: state.cartInfo.createcartInfo,
		cartInfo: state.cartInfo.cartInfo,
	}),{getCartInfo, saveDeliveryData, saveCurrentPage})(OrderConfirmationView);