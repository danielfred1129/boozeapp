import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {AsyncStorage} from 'react-native';
import Popup from 'react-native-popup';
import SearchBarView from '../components/SearchBarView'
import ForgotPasswordView from '../components/ForgotPasswordView'
import Modal from 'react-native-modalbox';
import OrderView from '../containers/OrderView'
import {getPasswordToken, forgotPassword} from '../redux/actions/userRegisterActions';
import {getAllCard} from '../redux/actions/cardViewActions';
import EmailValidator from 'email-validator';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {getCartInfo} from '../redux/actions/productCartActions';
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;
const SideMenu = require('react-native-side-menu');
const Menu = require('../components/Menu');

class SignInView extends Component{

	constructor(props) {
	  super(props);

	  this.state = {
	  	email_address:'',
	  	password:'',
		loadingText: 'Signing In...',
		email_address_req:false,
		password_req:false,
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

	componentDidMount(){
		const {createcartInfo, clientTokenResult} = this.props;

		if (createcartInfo) {
			UUID = createcartInfo.guest_id;
			cartID = createcartInfo.id;

			clientToken = 'Bearer ' + clientTokenResult.access_token,
			this.props.getCartInfo(cartID, UUID, clientToken);
		}
	}

	componentWillReceiveProps(nextProps){
		const {passwordTokenResult, passwordTokenError, prevPage} = nextProps;
		
		if (passwordTokenError) {	
			this.onShowAlert('The user credentials were incorrect.');
		}
		else if (passwordTokenResult) 
		{
			AsyncStorage.setItem('signin_type', JSON.stringify('true'));
			
			passwordToken = 'Bearer ' + passwordTokenResult.access_token;
			this.setState({passwordToken: passwordToken});
			this.props.getAllCard(passwordToken);
			if (prevPage == "signUpView") {
				Actions.orderView();
			}
			else {
				Actions.address();
			}
		}
	}

	onShowAlert (message){

		Alert.alert(
		  'Error',
		  message,
		  [
		    {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},
		  ]
		)
	}

	onClick(data){

	}

	_checkForResFields(){
		const {email_address, password, email_address_req, password_req} = this.state;
		if (email_address == '')
			this.setState({email_address_req:true});
		else
			this.setState({email_address_req:false});
		if (password == '' || password.length < 6)
			this.setState({password_req:true});
		else
			this.setState({password_req:false});
	}

	_checkEmailField(){
		const {email_address} = this.state;
		if (email_address == '')
			this.setState({email_address_req:true});
		else
			this.setState({email_address_req:false});
	}

	_onSubmit(){
		this._checkForResFields();

		const {email_address, password} = this.state;


		if (email_address== ''|| password =='' || password.length < 6){
		}else{
			if (EmailValidator.validate(email_address)){
				this.props.getPasswordToken(email_address, password);
			}
			else
			{
				Alert.alert(
						'Error',
						'Invalid email address!',
						[
							{text: 'OK', onPress: () => console.log('alert'), style: 'cancel'},
						]
				)
			}
		}
	}

	_onForgot(){
		this.openModal();
	}

	openModal(){

		this.refs.modal.open();
	}

	closeModal(){
		this.refs.modal.close();
		// this.setState({
		// 	isModalOpen:false
		// });
	}

	render(){

		var data = {};
	
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList}/>;
		// const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList}  addressView_flag='false' />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>

				<View style={styles.bg}>
					<SearchBarView onPress={()=>this.toggle()} addFlag='true'/>
					<TouchableOpacity onPress={()=>dismissKeyboard()}>
						<View style={{height:70,backgroundColor:'#F1F2F2',flexDirection:'column'}}>
					  		<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
					  			<Text style={{fontSize:25,color:'#7e5d91',fontWeight:'bold'}}>Sign In</Text>
					  		</View>
					  	</View>
					</TouchableOpacity>
				  	<View>
				  		<TextInput
				  			ref='email_address'
				  			returnKeyType={"next"}
				  			onSubmitEditing={()=>this.refs.password.focus()}
			  				onChangeText={(email_address)=>this.setState({email_address,email_addressError:''})}
			  				value={this.state.email_address}
			  				autoCorrect={false} 
    						autoCapitalize='none'
			  				placeholder={'Email Address'}
							keyboardType="email-address"
			  				placeholderTextColor="#414042"
			  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15,fontWeight:'bold'}}
				  		/>
				  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
				  		{
				  			this.state.email_address_req ? 
							<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
					  			<Text style={{fontSize:12,color:'#58595b'}}>The email field is required.</Text>
					  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
				  			</View> : 
				  			null
				  		}
				  	</View>
				  	<View>
				  		<TextInput
				  			ref='password'
				  			returnKeyType={"next"}
			  				onChangeText={(password)=>this.setState({password, password_Error:''})}
			  				value={this.state.password}
			  				secureTextEntry={true}
			  				placeholder={'Password'}
			  				placeholderTextColor="#414042"
			  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15,fontWeight:'bold'}}
				  		/>
				  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
				  		{
				  			this.state.password_req ? 
							<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
					  			<Text style={{fontSize:12,color:'#58595b'}}>The password field is required.</Text>
					  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
				  			</View> : 
				  			null
				  		}
				  	</View>
				  	<TouchableOpacity onPress={()=>dismissKeyboard()}>
						<View style={{height:200,backgroundColor:'#F1F2F2',flexDirection:'column'}}/>
					</TouchableOpacity>
				  	<View style={styles.forgotView}>
				  		<TouchableOpacity onPress={()=>this._onForgot()}>
				  			<Text style={{fontSize:15}}>Forgot Your Password?</Text>
				  		</TouchableOpacity>
				  	</View>

				  	<View style={styles.signinBtn}>
				  		<TouchableOpacity onPress={()=>this._onSubmit()} style={{backgroundColor:'#7e5d91',justifyContent:'center', alignItems:'center',flex:1}}>
				  			<Text style={{fontSize:25,color:'#FFF', fontWeight:'bold'}}>SIGN IN</Text>
				  		</TouchableOpacity>
				  	</View>
				  	<View style={styles.forgotView}>
				  		<TouchableOpacity onPress={()=>this._onForgot()}>
				  			<Text style={{fontSize:18}}>Forgot Your Password?</Text>
				  		</TouchableOpacity>
				  	</View>
				  	<Modal isOpen={this.state.isModalOpen} ref={"modal"} swipeToClose={false} backdropOpacity={0.8} style={{flex:1,backgroundColor:'transparent', alignItems:'center'}}>
				  		<ForgotPasswordView closeModal={this.closeModal.bind(this)}/>
				  	</Modal>
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

	signinBtn : {
		flex:1,
		flexDirection:'column', 
		backgroundColor:'#7e5d91',
		justifyContent:'center', 
		position:'absolute',
		bottom:50,
		width:screen_width,
		height:50,
		alignItems:'center',
	},

	forgotView : {
		flex:1, 
		backgroundColor:'#F1F2F2',
		justifyContent:'center',
		flexDirection:'row', 
		position:'absolute', 
		bottom:0, 
		height:50, 
		width:screen_width, 
		alignItems:'center'},
})

export default connect(
  state => ({
  	//signInResult: state.userRegister
  	prevPage: state.tabInfo.prevPage,
  	passwordTokenResult: state.userRegister.passwordTokenResult,
  	passwordTokenError: state.userRegister.passwordTokenError,
  	signInResult: state.userRegister.signInResult,
  	userGeoAddressList: state.geoCodeForm.selectedList,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	createcartInfo: state.cartInfo.createcartInfo,
  }),{getPasswordToken, forgotPassword, getAllCard, getCartInfo})(SignInView);