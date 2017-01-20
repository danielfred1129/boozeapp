import React, {Component} from 'react';
import {StyleSheet, Image, View, Text,  TouchableOpacity, TextInput, Button, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';
import {loadNonServiceEmail} from '../redux/actions/nonServiceAreaActions';
import {forgotPassword} from '../redux/actions/userRegisterActions';
import {connect} from 'react-redux';
import Popup from 'react-native-popup';
import EmailValidator from 'email-validator';

import {screen_dimensions} from '../constants';
const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

class ForgotPasswordView extends Component{

	 constructor(props) {

	   super(props);

		//console.log('@@@@initProps', props)

	   this.state = {

	   	email_address:''

	   };
	   
	 }
	 
 	componentWillReceiveProps(nextProps){

 		const {forgotPasswordResult} = nextProps;
 		console.log('forgotPasswordResult:' + forgotPasswordResult);

	  	if(forgotPasswordResult){

	  		if(forgotPasswordResult == true){
	  			Alert.alert(
						'Success',
						'We have e-mailed your password reset link!',
						[
							{text: 'OK', onPress: () => this.props.closeModal(), style: 'cancel'},
						]
					);
	  		}else{
	  			Alert.alert(
						'Error',
						forgotPasswordResult.message,
						[
							{text: 'OK', onPress: () => console.log('alert'), style: 'cancel'},
						]
					);
	  		}
	  	}
	}

	_onSubmit(){

		const {email_address} = this.state;
		const {clientTokenResult} = this.props;

		if (clientTokenResult) {
			clientToken = 'Bearer ' + clientTokenResult.access_token;
			
		}

		//console.log('**email_address',email_address)
		console.log('clientTokenOfForgot:'+clientToken);
		if(email_address){			
			if (EmailValidator.validate(email_address)){
				this.props.forgotPassword(email_address, clientToken);
			}else
			{
				if (email_address != '')
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
			//this.props.closeModal;
		}
	};

	render(){
	 	return(
	 		<View>
		 		<View style={{flexDirection:'column', width:screen_width * 0.7,height:130,backgroundColor:'#FFF',borderRadius:5,marginTop:180}}>
			 		<View style={{justifyContent:'flex-end', alignItems:'center',flexDirection:'row'}}>
			 			<TouchableOpacity onPress={this.props.closeModal}>
			 				<Image source={require('../assets/images/close_icon.png')} resizeMode={Image.resizeMode.contain} style={{width:13,height:13, marginRight:10,marginTop:6}}/>
			 			</TouchableOpacity>
			 		</View>
		 			<View style={{flex:1,flexDirection:'column'}}>
			 			<View style={{flex:1, backgroundColor:'#FFF'}}>
			 				<TextInput
			 					style={{height:50,textAlign:'center'}}
			 					onChangeText={(email_address)=>this.setState({email_address})}
			 					keyboardType="email-address"
			 					value={this.state.address}
			 					autoCorrect={false} 
			 					placeholder={"Your Email Address"}
			 					placeholderTextColor="#494D4F"
			 				/>
			 			</View>
			 			<View style={{height:10, flex:1, backgroundColor:'#7e5d91',borderBottomWidth:1,borderBottomColor:'#FFF',borderLeftWidth:2,borderLeftColor:'#FFF',borderRightWidth:2,borderRightColor:'#FFF',borderBottomLeftRadius:5,borderBottomRightRadius:5}}>
			 				<TouchableOpacity onPress={()=>this._onSubmit()} style={{flex:1,justifyContent:'center', alignItems:'center'}}>
			 					<Text style={{fontSize:20.5, color:'#FFF'}}>Submit</Text>
			 				</TouchableOpacity>
			 			</View>	
		 			</View>
				</View>
				<Popup ref={popup =>this.popup=popup}/>
			</View>
	 	)
 	}
}

export default connect(
   state => ({forgotPasswordResult: state.userRegister.forgotPasswordResult, clientTokenResult: state.userRegister.clientTokenResult}),{forgotPassword})(ForgotPasswordView);

