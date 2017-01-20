import React, {Component} from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity, ScrollView, TextInput, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {AsyncStorage} from 'react-native';
import Popup from 'react-native-popup';
import CheckBox from 'react-native-check-box';
import SearchBarView from '../components/SearchBarView'
import {getAllCard} from '../redux/actions/cardViewActions';
import {savePrevPage, saveCurrentPage} from '../redux/actions/tabInfoAction';
import {getCartInfo} from '../redux/actions/productCartActions';
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

const SideMenu = require('react-native-side-menu');
const Menu = require('../components/Menu');

class PaymentMethodsView extends Component{

	constructor(props) {
		super(props);

		this.state = {
			storeItem1 : false,
			isOpen: false,
			selectedItem: 'SelectStore',
		};
	}

	componentWillMount(){

		const {createcartInfo, clientTokenResult} = this.props;

		if (createcartInfo) {
			UUID = createcartInfo.guest_id;
			cartID = createcartInfo.id;

			clientToken = 'Bearer ' + clientTokenResult.access_token,
			this.props.getCartInfo(cartID, UUID, clientToken);
		}
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

	_onStoreItem1() {
		this.setState({storeItem1:!this.state.storeItem1})
	}

	_onContinue() {
		Actions.productCategory();
	}
	
	_onAddCard(){
		Actions.addCardView({fromView: 'fromPaymentMethods'});
	}

	_onEditCard(cardData) {
		Actions.editCardView({cardData: cardData});
	}

	componentDidMount(){
		this.props.saveCurrentPage('paymentMethodsView');
	}

	render(){
		const instance = this;
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;

		const {allCardResult} = this.props;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>

				<View style={styles.bg}>

					<SearchBarView onPress={()=>this.toggle()} addFlag='true' signinPage='true' orderPage='true'/>
					<ScrollView>
						<View style={{height:70,backgroundColor:'#F1F2F2',flexDirection:'column'}}>
					  		<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
					  			<Text style={{fontSize:25,color:'#7e5d91',fontWeight:'bold'}}>Payment Method</Text>
					  		</View>
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
							
						  	return (
						  		<View key={index}>
								  	<TouchableOpacity onPress={()=>instance._onEditCard(item)}>
								  		<View style={styles.paymentStyle}>
								  			<Text style={styles.arrowTextStyle}>{item.nickname}</Text>
								  			<Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.center} style={styles.arrowImgStyle}/>
							  			</View>
							  			<View style={styles.cardViewStyle}>
							  				<Image source={imgUrl} resizeMode={Image.resizeMode.contain} style={{height:40}}/>
							  				<Text style={{marginRight:10}}>{item.last_4}</Text>
							  				<Text>{item.exp_month}</Text>
							  				<Text>/</Text>
							  				<Text>{item.exp_year}</Text>
							  			</View>
							  		</TouchableOpacity>
							  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
						  		</View>
						  	)
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
					  	<View style={{height:50}}/>
					</ScrollView>
				  	<View style={styles.checkoutBtn}>
				  		<TouchableOpacity onPress={()=>this._onContinue()} style={{backgroundColor:'#7e5d91',justifyContent:'center', alignItems:'center',flex:1}}>
				  			<Text style={{fontSize:25,color:'#FFF', fontWeight:'bold'}}>CONTINUE</Text>
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
		flex:1
	},

	checkoutBtn : {
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

	paymentStyle : {
		height:45, 
		backgroundColor:'#FFF',
		alignItems:'center',
		flex:1, 
		flexDirection:'row'
	},

	arrowImgStyle : {
		height:45, 
		backgroundColor:'#FFF',
		width:50
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
	
})

export default connect(
  state => ({
  	//orderResult: state.orderView.orderResult,
  	allCardResult: state.cardInfo.allCardResult,
  	userGeoAddressList: state.geoCodeForm.selectedList,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	createcartInfo: state.cartInfo.createcartInfo,
  }),{saveCurrentPage, savePrevPage, getCartInfo})(PaymentMethodsView);