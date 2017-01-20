import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, ListView, Image, WebView, View, Text, RecyclerViewBackedScrollView, TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {loadVideoFeatureList} from '../redux/actions/videoFeatureActions'
import SearchBarView from './SearchBarView'
import {savePrevPage, saveTabType} from '../redux/actions/tabInfoAction';

const SideMenu = require('react-native-side-menu');
const Menu = require('./Menu');
import {screen_dimensions} from '../constants';
const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

class FeatureVideoWebView extends Component{

	constructor(props) {
	  super(props);
	  this.state = {
		  	isOpen: false,
		};
			
	}

	toggle() {
		console.log("abc");
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
		this.props.savePrevPage('tab');
	}

	componentWillReceiveProps(nextProps){

	}

	render(){
		const {videoData} = this.props;

		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>
				<View style={styles.bg}>
					<SearchBarView onPress={()=>this.toggle()}/>
				  	<WebView
						source={{uri: 'https://m.youtube.com/watch?v='+videoData.value}}
						automaticallyAdjustContentInsets={false}
						style={{marginTop: 20}}
					/>
				</View>
			</SideMenu>
		)
	};
}


const styles= StyleSheet.create({

	bg: {
		backgroundColor: 'white',

		flexDirection:'column',
		flex:1
	},

})

export default connect(
  state => ({
  	videoFeature: state.videoFeature,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	userGeoAddressList: state.geoCodeForm.selectedList,
}),{savePrevPage, saveTabType})(FeatureVideoWebView);