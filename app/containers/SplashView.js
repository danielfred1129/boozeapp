import React, {Component} from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import SplashScreen from '@remobile/react-native-splashscreen';

export default class SplashView extends Component{

	render(){
		return(			
			<View style={styles.bg}>
			  	<View style={{height:193, backgroundColor:'#FFF'}}>
			  		<Image source={require('../assets/images/logo.png')}resizeMode={Image.resizeMode.contain} style={styles.LogoImage}/>
			  	</View>
				
			  	<View style={{height:35, backgroundColor:'#FFF'}}>
			  		<Text style={styles.PageTitle}>We Deliver To</Text>
			  	</View>

			  	<View style={{flex:1, backgroundColor:'#FFF'}}>
			  		<Image source={require('../assets/images/sp_screen.png')} resizeMode={Image.resizeMode.contain} style={styles.Sp_ScreenImage}/>
			  	</View>
			</View>
		)
	}
}
	
const styles= StyleSheet.create({

	bg: { 
		backgroundColor: 'white', 
		flexDirection:'column', 
		justifyContent:'center',
		alignItems: 'center',
		flex:1
	},

	LogoImage:{
		width:261.5,
		height:71.5,
		marginTop:50
	},

	PageTitle:{
		fontSize:20,
		color:'#58595b'
	},

	Sp_ScreenImage:{
		width:281.5,
		height:281.5,
		marginTop:15
		
	}

})

