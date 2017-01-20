import React, {Component} from 'react';
import ReactNative from 'react-native';
import {Alert, StyleSheet, Image, View, Text, TouchableOpacity, ScrollView, TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {loadSignUpResult, getPasswordToken} from '../redux/actions/userRegisterActions';
import {AsyncStorage} from 'react-native';
import Popup from 'react-native-popup';
import CheckBox from 'react-native-check-box';
import SearchBarView from '../components/SearchBarView'
import {getCartInfo} from '../redux/actions/productCartActions';
import {saveCurrentPage} from '../redux/actions/tabInfoAction';
import {savePrevPage} from '../redux/actions/tabInfoAction';
import {getAllCard} from '../redux/actions/cardViewActions';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import EmailValidator from 'email-validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;
const SideMenu = require('react-native-side-menu');
const Menu = require('../components/Menu');

class SignUpView extends Component{

	constructor(props) {
	  super(props);

	  this.state = {
	  	first_name:'',
	  	last_name:'',
	  	phone_number:'',
	  	email_address:'',
	  	password:'',
	  	password_confirmation:'',
	  	beer_state: 0,
	  	wine_state: 0,
	  	liquor_state: 0,
	  	ofage: 0,
		loadingText: 'Signing Up...',

		first_name_req:false,
		last_name_req:false,
		email_address_req:false,
		phone_req:false,
		password_req:false,
		password_confirmation_req:false,
		password_match:false,
		phone_number_available:false,
		ofage_req:false,
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
		this.props.savePrevPage('productCartView');
		this.props.saveCurrentPage('signUpView');

		const {createcartInfo, clientTokenResult} = this.props;

		if (createcartInfo) {
			UUID = createcartInfo.guest_id;
			cartID = createcartInfo.id;

			clientToken = 'Bearer ' + clientTokenResult.access_token,
			this.props.getCartInfo(cartID, UUID, clientToken);
		}
	}

	componentWillReceiveProps(nextProps){
		const {signUpResult, signUpError, passwordTokenResult} = nextProps;
		const {email_address, password} = this.state;

		if (passwordTokenResult) {
			AsyncStorage.setItem('signin_type', JSON.stringify('true'));
			
			passwordToken = 'Bearer ' + passwordTokenResult.access_token;
			this.setState({passwordToken: passwordToken});
			this.props.getAllCard(passwordToken);
			Actions.orderView();
			return;
		}
		if (signUpError) {
			Alert.alert(
			  'Error',
			 'There is an account with this email address.',
			  [
			    {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},
			  ]
			)
		}
		else if (signUpResult) {
			this.props.getPasswordToken(email_address, password);
			return;
			
		}
	}

	onClick_CheckBeer(){
		if (this.state.ofage == 0)
			this.setState({beer_state: 1});
		else
			this.setState({beer_state: 0});
	}
	onClick_CheckWine(){
		if (this.state.ofage == 0)
			this.setState({wine_state: 1});
		else
			this.setState({wine_state: 0});
	}
	onClick_CheckLiquor(){
		if (this.state.ofage == 0)
			this.setState({liquor_state: 1});
		else
			this.setState({liquor_state: 0});
	}
	onClick_CheckOfAge(){
		if (this.state.ofage == 0)
			this.setState({ofage: 1});
		else
			this.setState({ofage: 0});
	}

	inputBlurred(ref) {
		console.log("here");
   		this._scroll(ref, 300);
 	}
 	_scroll(ref, offset) {
   		setTimeout(() => {
	     var scrollResponder = this.refs.myScrollView.getScrollResponder();
	     scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
	                ReactNative.findNodeHandle(this.refs[ref]),
	                offset,
	                true
	            );
	     });
	  }

	formatFirstName(name) {
		var x = name.replace(/[(\W\d_]/g, "").replace(/[\s]+/g, " ");
		this.setState({first_name: x});
	}
	formatLastName(name) {
		var x = name.replace(/[(\W\d_]/g, "").replace(/[\s]+/g, " ");
		this.setState({last_name: x});
	}

	formatPhoneNumber (phone_number) {
	  var x = phone_number.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
	  phone_number = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
	
	  this.setState({phone_number:phone_number})
	};

	_checkForResFields(){
		const {first_name, first_name_req,	 last_name, last_name_req, email_address, email_address_req, phone_number, 
			phone_number_req, phone_number_available, beer_state, liquor_state, wine_state, ofage, password
			, password_confirmation, password_match, ofage_req} = this.state;
		if (first_name == '')
			this.setState({first_name_req:true});
		else
			this.setState({first_name_req:false});
		if (last_name == '')
			this.setState({last_name_req:true});
		else
			this.setState({last_name_req:false});
		if (email_address == '')
			this.setState({email_address_req:true});
		else
			this.setState({email_address_req:false});
		if (phone_number == '')
			this.setState({phone_number_req:true});
		else
			this.setState({phone_number_req:false});
		if (password == '' || password.length < 6)
			this.setState({password_req:true});
		else
			this.setState({password_req:false});
		if (password_confirmation == '' || password_confirmation.length < 6)
			this.setState({password_confirmation_req:true});
		else
			this.setState({password_confirmation_req:false});
		if (password.length > 0 && password != password_confirmation)
			this.setState({password_match:true});
		else
			this.setState({password_match:false});
		if (phone_number.length < 6)
			this.setState({phone_number_available:false});
		else
			this.setState({phone_number_available:true});
		if (!ofage)
			this.setState({ofage_req: true});
		else
			this.setState({ofage_req: false});
	}

	_onSignUp(){
		this._checkForResFields();

		const {clientTokenResult} = this.props;

		if (clientTokenResult) {
			clientToken = 'Bearer ' + clientTokenResult.access_token;
		}
	
		const {first_name, last_name, phone_number, email_address, password, password_confirmation, beer_state, wine_state, liquor_state, ofage} = this.state;

		if (first_name== ''|| last_name ==''|| phone_number ==''|| email_address==''|| password ==''|| password.length < 6 || password_confirmation.length < 6 || password_confirmation =='' || ofage == 0){
		}else{
			if (EmailValidator.validate(email_address)){
				this.props.loadSignUpResult(first_name, last_name, phone_number, email_address, password, password_confirmation, beer_state, wine_state, liquor_state, ofage, clientToken)
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

	_onSignIn(){
		this.props.savePrevPage('signUpView');
		Actions.signInView()
	}

	render(){

	
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>
				<View style={styles.bg}>

					<SearchBarView onPress={()=>this.toggle()} addFlag='true' />
					<KeyboardAwareScrollView 
						ref="myScrollView"
						keyboardShouldPersistTaps={true}
						keyboardDismissMode = {'on-drag'}>
						<TouchableOpacity onPress={()=>dismissKeyboard()}>
							<View style={{height:70,backgroundColor:'#F1F2F2',flexDirection:'column'}}>
						  		<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:25,color:'#7e5d91',fontWeight:'bold'}}>Sign Up or Sign In to Checkout</Text>
						  		</View>
						  	</View>
						</TouchableOpacity>
					  	<View>
					  		<TextInput
					  		  	returnKeyType={"next"}
					  		  	onSubmitEditing={(event)=>this.refs.last_name.focus()}
				  				onChangeText={first_name=>this.formatFirstName(first_name)}
				  				autoCorrect={false} 
				  				keyboardType={'ascii-capable'}
				  				value={this.state.first_name}
				  				placeholder={'First Name'}
				  				placeholderTextColor="#414042"
				  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15,fontWeight:'bold'}}
					  		/>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  		{
					  			this.state.first_name_req ? 
								<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:12,color:'#58595b'}}>First name is required.</Text>
						  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  			</View> : 
					  			null
					  		}
					  	</View>
					  	<View>
					  		<TextInput
					  			ref='last_name'
					  			returnKeyType={"next"}
					  			onSubmitEditing={()=>this.refs.phone_number.focus()}
				  				onChangeText={last_name=>this.formatLastName(last_name)}
				  				autoCorrect={false} 
				  				keyboardType={'ascii-capable'}
				  				value={this.state.last_name}
				  				placeholder={'Last Name'}
				  				placeholderTextColor="#414042"
				  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15,fontWeight:'bold'}}
					  		/>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:15}}></View>
					  		{
					  			this.state.last_name_req ? 
								<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:12,color:'#58595b'}}>Last name is required.</Text>
						  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  			</View> : 
					  			null
					  		}
					  	</View>
					  	<View>
					  		<TextInput
					  			ref='phone_number'
					  			returnKeyType={"next"}
					  			onSubmitEditing={()=>this.refs.email_address.focus()}
					  			keyboardType={'numeric'}
					  			autoCapitalize='none'
				  				onChangeText = {(phone_number)=> this.formatPhoneNumber(phone_number)}
				  				value={this.state.phone_number}
				  				placeholder={'Phone Number'}
				  				placeholderTextColor="#414042"
				  				style={{height:38, backgroundColor:'#FFF',fontSize:15,paddingLeft:15,fontWeight:'bold'}}
					  		/>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  		{
					  			this.state.phone_number_req? 
								<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:12,color:'#58595b'}}>Phone is required.</Text>
						  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  			</View> : 
					  			null
					  		}
					  	</View>
					  	<View>
					  		<TextInput
					  			ref='email_address'
					  			returnKeyType={"next"}
					  			onSubmitEditing={()=>this.refs.password.focus()}
				  				onChangeText={(email_address)=>this.setState({email_address,email_addressError:''})}
				  				autoCorrect={false} 
    							autoCapitalize='none'
				  				value={this.state.email_address}
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
					  			autoCorrect={false} 
    							autoCapitalize='none'
					  			onSubmitEditing={()=>this.refs.password_confirmation.focus()}
				  				onChangeText={(password)=>this.setState({password, password_Error:''})}
				  				value={this.state.password}
				  				placeholder={'Password'}
				  				placeholderTextColor="#414042"
				  				secureTextEntry={true}
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
					  	<View>
					  		<TextInput
					  			ref='password_confirmation'
					  			returnKeyType={"next"}
				  				onChangeText={(password_confirmation)=>this.setState({password_confirmation, password_confirmationError:''})}
				  				autoCorrect={false} 
    							autoCapitalize='none'
				  				value={this.state.password_confirmation}
				  				placeholder={'Confirm Password'}
				  				placeholderTextColor="#414042"
				  				secureTextEntry={true}
				  				onSubmitEditing={this.inputBlurred.bind(this, 'checkbox_21')}
				  				style={{height:45, backgroundColor:'#FFF',fontSize:15,paddingLeft:15,fontWeight:'bold'}}
					  		/>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  		{
					  			this.state.password_confirmation_req ? 
								<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:12,color:'#58595b'}}>The password confirmation field is required.</Text>
						  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  			</View> : 
					  			null
					  		}
					  		{
					  			this.state.password_match ?
					  			<View style={{flex:1, justifyContent:'center', marginLeft:10}}>
						  			<Text style={{fontSize:12,color:'#58595b'}}>The passwords must match.</Text>
						  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  			</View> : 
					  			null
					  		}
					  	</View>
					  	<TouchableOpacity onPress={()=>dismissKeyboard()} style={{backgroundColor:'#F1F2F2', height:130, flexDirection:'column', justifyContent:'flex-start'}}>
					  		<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:10}}></View>
					  		<View style={{flex:1, justifyContent:'flex-start', marginLeft:10}}>
					  			<Text style={{fontSize:15,}}>Preferred Drink</Text>
					  		</View>
					  		<View style={{flex:1,flexDirection:'row', alignItems:'center'}}>
						  		<CheckBox
								    style={{flex: 1, padding: 10}}
								    onClick={()=>this.onClick_CheckBeer()}
								    isChecked={false}
								    rightText={'Beer'}
								   	rightTextStyle = {{fontSize:14.5}}
								/>
								<CheckBox
								    style={{flex: 1, padding: 10}}
								    onClick={()=>this.onClick_CheckWine()}
								    isChecked={false}
								    rightText={'Wine'}
								   	rightTextStyle = {{fontSize:14.5}}
								/>
								<CheckBox
								    style={{flex: 1, padding: 10}}
								    onClick={()=>this.onClick_CheckLiquor()}
								    isChecked={false}
								    rightText={'Liquor'}
								   	rightTextStyle = {{fontSize:14.5}}
								/>
					  		</View>
					  		<View style={{flex:1,flexDirection:'column', marginTop:5, marginBottom:5}}>
						  		<CheckBox
						  			ref="checkbox_21"
								    style={{flex: 1, padding: 10}}
								    onClick={()=>this.onClick_CheckOfAge()}
								    isChecked={false}
								    rightText={'I’m 21+ years of age and agree to the terms of service.'}
								   	rightTextStyle = {{fontSize:10.5}}
								/>
							</View>
							<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4, marginTop:10}}></View>
					  		{
					  			this.state.ofage_req ? 
								<View style={{flex:1, justifyContent:'center', marginLeft:20}}>
						  			<Text style={{fontSize:12,color:'#58595b'}}>You need to be at least 21 years of age..</Text>
						  			<View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:4}}></View>
					  			</View> : 
					  			null
					  		}
					  	</TouchableOpacity>
					  	<View style={{height:220}}/>
					</KeyboardAwareScrollView>
				  	<View style={styles.signupBtn}>
				  		<TouchableOpacity onPress={()=>this._onSignUp()} style={{backgroundColor:'#7e5d91',justifyContent:'center', alignItems:'center',flex:1}}>
				  			<Text style={{fontSize:25,color:'#FFF',fontWeight:'bold'}}>SIGN UP</Text>
				  		</TouchableOpacity>
				  	</View>
				  	<View style={styles.signinView}>
				  		<View >
				  			<Text style={{fontSize:18}} >Already have an account?</Text>
				  		</View>
				  		<TouchableOpacity onPress={()=>this._onSignIn()}>
				  			<Text style={{fontSize:18, marginLeft:10, color:'#DC754C'}}>Sign In</Text>
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

	signupBtn : {
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

	signinView : {
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
  	createcartInfo: state.cartInfo.createcartInfo,
  	signUpResult: state.userRegister.signUpResult,
  	signUpError: state.userRegister.signUpError,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	passwordTokenResult: state.userRegister.passwordTokenResult,
  	userGeoAddressList: state.geoCodeForm.selectedList,
  }),{loadSignUpResult, saveCurrentPage, savePrevPage, getPasswordToken, getAllCard, getCartInfo})(SignUpView);