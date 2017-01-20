import React, {Component} from 'react';
import {AsyncStorage, Alert, StyleSheet, Image, View, Text, TouchableOpacity, ScrollView} from 'react-native'
import {Actions, Router, Scene, ActionConst} from 'react-native-router-flux';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import FeatureVideoListView from './FeatureVideoListView'
import ProductGalleryListView from './ProductGalleryListView'
import SearchBarView from './SearchBarView'
import {connect} from 'react-redux';
import {saveIsDetail, savePrevPage} from '../redux/actions/tabInfoAction';
/**  **/
const SideMenu = require('react-native-side-menu');
const Menu = require('./Menu');
import {loadSearchProductData} from '../redux/actions/searchDataAction';

class SearchProductView extends Component{

	constructor(props) {
	  	super(props);

	  	this.state = {
			searchData: null,
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
		console.log('componentDidMount on SearchProductView');
		AsyncStorage.removeItem('gallerySelectedOption');
		AsyncStorage.removeItem('galleryData');
		AsyncStorage.removeItem('galleryInformation');
		AsyncStorage.removeItem('galleryOffset');
		this.props.saveIsDetail('false');

		const {clientTokenResult} = this.props;
		clientToken = 'Bearer ' + clientTokenResult.access_token;

		const {searchText} = this.props

		if (searchText) {
			this.props.loadSearchProductData(searchText, this.props.geoCodeForm.selectedID, clientToken)
		}
	}

	onPressOK (currentPage) {
		console.log('currentPage on pressOK', currentPage);
		var returnPage = currentPage;
		if (currentPage == 'gallery' || currentPage == 'productDetailView') {
			returnPage = 'tab';
		}
		Actions[returnPage]();
	}

	componentWillReceiveProps(nextProps){

		const {searchData, searchText, clientTokenResult, currentPage} = nextProps;
		console.log('currentPage on SearchProductView:', currentPage);
		
		clientToken = 'Bearer ' + clientTokenResult.access_token;

		if (searchText && (this.props.searchText != searchText)) {
			this.props.loadSearchProductData(searchText, this.props.geoCodeForm.selectedID, clientToken);
			return;
		}
		
		if (searchData != null) {
			if (searchData.length > 0) {
				this.setState({searchData: searchData});
			}
			else {
				Alert.alert(
				  'Not Found',
				 'There are no products matching your search term.',
				  [
				  	// {text: 'OK', onPress: () => console.log('alert'), style: 'cancel'},
				    {text: 'OK', onPress: () => this.onPressOK(currentPage), style: 'cancel'},
				  ]
				)
				this.setState({searchData: null});
			}
		}
	}

	render(){
		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>
				<View style={styles.bg}>
			  		<SearchBarView  onPress={()=>this.toggle()} addFlag='true'/>
					<View style={{borderColor:'#58595B', borderWidth:1, opacity:0.1}}></View>
					<ScrollView style={{flex:1,backgroundColor:'#F1F2F2'}}>
					{ this.state.searchData && this.state.searchData.length > 0 && 
						( <ProductGalleryListView 
							selectCategoryName = {'SearchProduct'}
							galleryInformation = {null}
							galleryData = {this.state.searchData} 
							searchPage={true}/> )
					}
					</ScrollView>
				</View>
			</SideMenu>
		)
	};
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor:'#F1F2F2',
		flexDirection:'column',
		flex:1
	},

	ScrollView: {
		backgroundColor: '#FFF'
	}

})

export default connect(
  	state => ({
  		geoCodeForm: state.geoCodeForm,       //search text
	  	searchText: state.searchData.searchText,            //search text
	  	searchData: state.searchProductData.searchData,      //filtered data from text
	  	clientTokenResult: state.userRegister.clientTokenResult,
	  	userGeoAddressList: state.geoCodeForm.selectedList,
	  	//prevPage: state.tabInfo.prevPage,
	  	currentPage: state.tabInfo.currentPage,
  	}),{loadSearchProductData, saveIsDetail, savePrevPage})(SearchProductView);
