import React, {Component} from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native'
import {Actions, Router, Scene, ActionConst} from 'react-native-router-flux';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import FeatureVideoListView from './FeatureVideoListView'
import ProductGalleryListView from './ProductGalleryListView'
import ProductTypesListView from './ProductTypesListView'
import PartyOrderFormView from './PartyOrderFormView'
import SearchBarView from './SearchBarView'
import {connect} from 'react-redux';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
/**  **/

import {loadProductTypesList} from '../redux/actions/productTypesActions'
import {loadProductGalleryListFromCategory, loadProductGalleryListFromTypes} from '../redux/actions/productGalleryActions';
import {addCartBadge} from '../redux/actions/productCartActions';

import {saveTabID, saveTabType, saveCurrentPage, savePrevPage} from '../redux/actions/tabInfoAction';
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

const SideMenu = require('react-native-side-menu');
const Menu = require('./Menu');
const tabs = ['Featured', 'Beer', 'Wine', 'Liquor', 'Mixers', 'Party Orders', 'Videos'];

class TabView extends Component{

	constructor(props) {
		super(props);

		index = tabs.indexOf(props.selectedProductCategoryName);
		if (index == -1) {
			this.state = {
				data: null,
				selectPage: props.TabID,
				typesData: null,
				isOpen: false,
    			selectedItem: 'SelectStore',
    			categoryListName: '',
    			typeName: '',
    			isGallery: false,
    			isDetailedFlag: false,
			};
		}
		else {
			this.state = {
				data: null,
				selectPage: index,
				typesData: null,
				isOpen: false,
    			selectedItem: 'SelectStore',
    			categoryListName: '',
    			typeName: '',
    			isGallery: false,
    			isDetailedFlag: false,
			};
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
	componentWillMount() {
		const {currentPageForBack, typeName} = this.props;
		console.log('typeName on componentWillMount:', typeName);
		var tempTypeName = typeName;
		console.log('tempTypeName:', tempTypeName);
		this.setState({isDetailedFlag: false});

		if (currentPageForBack == 'productDetailView') {
			console.log('currentPageForBack = productDetailView');
			if (tempTypeName == 'Featured') {
				console.log('tempTypeName == Featured');
			}
			if (tempTypeName == 'Featured')
			{
				console.log('typeName =Featured');
				this.setState({isGallery: false});
				this.setState({isDetailedFlag: false});
			}
			else
			{
				console.log('typeName !=Featured');
				this.setState({isGallery: true});
				this.setState({isDetailedFlag: true});
			}
			console.log('isDetailedFlag on componentWillMount:', this.state.isDetailedFlag);
			console.log('isGallery on componentWillMount:', this.state.isGallery);
			const {galleryTypesID, galleryFlag, galleryName, fromPage, typeName} = this.props;
			this.onLoadProductGalleryListFromTypes(galleryTypesID, galleryFlag, galleryName);
			this.setState({typeName: typeName});
		}
	}

	componentDidMount(){

		dismissKeyboard();

		const categoryListName = this.props.selectedProductCategoryName;
		this.setState({categoryListName: categoryListName});

		const {selectPage} = this.state;
		const {listTypeID, tabType} = this.props;
		this.props.saveCurrentPage('tab');

		this.props.saveTabID(selectPage);
		console.log('selectPage', selectPage);

		const {clientTokenResult} = this.props;

		clientToken = 'Bearer ' + clientTokenResult.access_token;		

		this.props.savePrevPage('productCategory');
		if (selectPage == 0){
			this.props.loadProductGalleryListFromCategory('featured', this.props.geoCodeForm.selectedID, clientToken);
			this.props.saveTabType('gallery');
		}

		if (selectPage == 1){
			this.props.loadProductTypesList('beer', this.props.geoCodeForm.selectedID, clientToken);
		}	
		if (selectPage == 2){
			this.props.loadProductTypesList('wine', this.props.geoCodeForm.selectedID, clientToken);
		}
		if (selectPage == 3){
			this.props.loadProductTypesList('liquor', this.props.geoCodeForm.selectedID, clientToken);
		}	
		if (selectPage == 4){
			this.props.loadProductTypesList('mixers', this.props.geoCodeForm.selectedID, clientToken);
		}
		if (selectPage == 5){
			this.props.saveTabType('order');
		}
		if (selectPage == 6){
			this.props.saveTabType('video');
		}
	}

	componentWillReceiveProps(nextProps) {

		const {selectedID} = nextProps.geoCodeForm
		const {isGallery} = this.state;
		

		this.setState({selectedID: selectedID})
		

		const productGallery = nextProps.productGallery.galleryListofCategory
		
		if(productGallery){
	
			this.setState({galleryData: productGallery})
		}

		const {categoryTypes, loading} = nextProps.productTypes;

		console.log('categoryTypes on componentWillReceiveProps:', categoryTypes);
		console.log('isGallery on componentWillReceiveProps:', isGallery);
		
		this.setState({loading});
		
		if (categoryTypes && categoryTypes.length > 0) {
			if (!isGallery)
				this.setState({typesData: null});
			this.setState({data: categoryTypes[0]});
		}
	}

	async onLoadProductGalleryListFromTypes(typesID, flag='false', name) {
		// const {selectedID} = this.state
		this.setState({galleryTypesID: typesID, galleryFlag: flag, galleryName: name});
		const {selectedID} = this.props.geoCodeForm;
		const {clientTokenResult} = this.props;

		clientToken = 'Bearer ' + clientTokenResult.access_token;

		const result = await this.props.loadProductGalleryListFromTypes(selectedID, typesID, clientToken, flag, 24, 1);
		
		const {body} = result.result

		// console.log('body on loadProductGalleryListFromTypes:', body);

		this.setState({typesData: body, typeName: name});
	}

	async onLoadProductTypesListFromTypes(isGallery) {
		// const {selectedID} = this.state
		this.setState({isGallery: isGallery});
		const {selectedID} = this.props.geoCodeForm;
		const {clientTokenResult, TabID} = this.props;

		if (TabID == 1){
			tabName = 'beer';
		}	
		if (TabID == 2){
			tabName = 'wine';
		}
		if (TabID == 3){
			tabName = 'liquor';
		}	
		if (TabID == 4){
			tabName = 'mixers';
		}

		clientToken = 'Bearer ' + clientTokenResult.access_token;

		this.props.loadProductTypesList(tabName, selectedID, clientToken);
		
	}

	onChangeTab(index, ref) {
		dismissKeyboard();
		const {isDetailedFlag, isGallery} = this.state;

		const {selectedID} = this.props.geoCodeForm;
		const {clientTokenResult} = this.props;
		console.log('isDetailedFlag onChangeTab;', isDetailedFlag);
		if (isDetailedFlag == true) {
			this.setState({isGallery: true});
		}
		else {
			this.setState({isGallery: false});
		}
		

		// if (index.i != 0)
		// {
		// 	this.setState({isGallery: false});
		// 	this.setState({isDetailedFlag: false});
		// }
		clientToken = 'Bearer ' + clientTokenResult.access_token;
		
		this.setState({ selectPage: index.i }, () => {
			this.props.savePrevPage('productCategory');	

			if (index.i == 0) {
				console.log('onChangeTab index.i=0', selectedID);
				this.props.loadProductGalleryListFromCategory('featured', selectedID, clientToken);
				this.props.saveTabType('gallery');
				this.setState({categoryListName: 'Featured'});
			}

			if (index.i == 1) {
				console.log('index.i = 1;', index.i);
				if (!isGallery)
					this.setState({data: null, typesData: null});
				this.props.loadProductTypesList('beer', selectedID, clientToken);
				this.props.saveTabType('category');
				this.setState({categoryListName: 'Beer'});
			}

			if (index.i == 2){
				if (!isGallery)
					this.setState({data: null, typesData: null});			
				this.props.loadProductTypesList('wine', selectedID, clientToken);
				this.props.saveTabType('category');
				this.setState({categoryListName: 'Wine'});
			}

			if (index.i == 3){
				if (!isGallery)
					this.setState({data: null, typesData: null});
				this.props.loadProductTypesList('liquor', selectedID, clientToken);
				this.props.saveTabType('category');
				this.setState({categoryListName: 'Liquor'});
			}

			if (index.i == 4){
				if (!isGallery)
					this.setState({data: null, typesData: null});
				this.props.loadProductTypesList('mixers', selectedID, clientToken);
				this.props.saveTabType('category');
			}

			if (index.i == 5) {
				this.props.saveTabType('order');
			}

			if (index.i == 6) {
				this.props.saveTabType('video');
			}
			this.setState({isDetailedFlag: false});

			this.props.saveTabID(index.i);
		});

	}

	render(){

		const {data, galleryData, typesData, selectPage, loading, typeName, isGallery, isDetailedFlag} = this.state;
		let {badgeNumber, tabType} = this.props;
		if (tabType == null)
			tabType = 'gallery';
		var featuredFlag = true;
		if (galleryData == undefined || galleryData.length == 0){
			featuredFlag = false;
		}
		console.log('tabType', tabType);
		console.log('isDetailedFlag on render:', isDetailedFlag);
		console.log('isGallery on render:', isGallery);

		const {categoryListName, galleryTypesID, galleryFlag, galleryName} = this.state;

		const menu = <Menu onItemSelected={this.onMenuItemSelected} userGeoAddressList={this.props.userGeoAddressList} />;
		return(
			<SideMenu
		        menu={menu}
		        isOpen={this.state.isOpen}
		        onChange={(isOpen) => this.updateMenuState(isOpen)}>
				<View style={styles.bg}>
			  		<SearchBarView 
			  		badgeNumber={badgeNumber} 
			  		currentPage={'tab'} 
			  		addFlag='true' 
			  		onPress={()=>this.toggle()} 
			  		onLoadProductTypesListFromTypes={this.onLoadProductTypesListFromTypes.bind(this)}
			  		onLoadProductGalleryListFromTypes= {this.onLoadProductGalleryListFromTypes.bind(this)}
			  		galleryTypesID={galleryTypesID}
			  		galleryFlag={galleryFlag}
			  		galleryName={galleryName}
			  		isGallery={isGallery}
			  		categoryListName={categoryListName}/>

					<View style={{borderColor:'#58595B', borderWidth:1, opacity:0.1}}></View>
					<View style={{flex:1,backgroundColor:'#F1F2'}}>
					  	<ScrollableTabView
					      style={{backgroundColor:'#FFF'}}
					      tabBarBackgroundColor='#7E5D91'
					      tabBarTextStyle={{color:'#FFF'}}
					      contentProps={{bounces: true, keyboardShouldPersistTaps: true, keyboardDismissMode: 'on-drag'}}
					      tabBarUnderlineStyle={{backgroundColor:'#DC754C'}}
					      page={this.state.selectPage}
					      onChangeTab = {(index)=>this.onChangeTab(index)}
					      renderTabBar={() => <ScrollableTabBar/>}
					    >
					    	<ScrollView tabLabel='FEATURED' style={styles.ScrollView}>
					    		{ featuredFlag == false && loading == false &&
						    		<Text style={{width:screen_width ,textAlign:'center'}}>There are no products currently.</Text>
						    	}
					    		{ featuredFlag == true && galleryData && (
					    			<ProductGalleryListView 
					    			galleryData = {galleryData} 
					    			galleryInformation = {null} 
					    			selectCategoryName = {'Featured'} 
					    			typeName = 'Featured' />
					    		)}
					    	</ScrollView>

						    <ScrollView tabLabel='BEER' style={styles.ScrollView}>
						    	{
						    		isGallery && typesData && (
						    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'beer'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
						    		)
						    	}
						    	{
						    		isGallery && typesData==null && (
						    			<ProductGalleryListView 
						    			galleryData = {null}
						    			galleryInformation = {null} 
						    			selectCategoryName = {'beer'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    			)
						    	}
						    	{!isGallery && !typesData && data == null && loading == false &&
						    		<Text style={{width:screen_width ,textAlign:'center'}}>There are no products currently.</Text>
						    	}
							    {!isGallery && !typesData && data != null && tabType  == 'category' && 
						    		<ProductTypesListView  data ={data} cateTitle={categoryListName} onLoadProductGalleryListFromTypes={this.onLoadProductGalleryListFromTypes.bind(this)}/>
							    }

							    {!isGallery && typesData && (
					    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'beer'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    		)}
						    </ScrollView>

						    <ScrollView tabLabel='WINE' style={styles.ScrollView}>
						    	{
						    		isGallery && typesData && (
						    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'wine'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
						    		)
						    	}
						    	{
						    		isGallery && typesData==null && (
						    			<ProductGalleryListView 
						    			galleryData = {null}
						    			galleryInformation = {null} 
						    			selectCategoryName = {'wine'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    			)
						    	}
						    	{!isGallery && !typesData && data == null && loading == false &&
						    		<Text style={{width:screen_width ,textAlign:'center'}}>There are no products currently.</Text>
						    	}
							    {!isGallery && !typesData && data != null && tabType  == 'category' && 
							    		<ProductTypesListView  data ={data} cateTitle={categoryListName} onLoadProductGalleryListFromTypes={this.onLoadProductGalleryListFromTypes.bind(this)}/>
							    }

							    {!isGallery && typesData && (
					    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'wine'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    		)}
						    </ScrollView>

						    <ScrollView tabLabel='LIQUOR' style={styles.ScrollView}>
						    	{
						    		isGallery && typesData && (
						    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'liquor'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
						    		)
						    	}
						    	{
						    		isGallery && typesData==null && (
						    			<ProductGalleryListView 
						    			galleryData = {null}
						    			galleryInformation = {null} 
						    			selectCategoryName = {'liquor'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    			)
						    	}
						    	{!isGallery && !typesData && data == null && loading == false &&
						    		<Text style={{width:screen_width ,textAlign:'center'}}>There are no products currently.</Text>
						    	}
							    {!isGallery && !typesData && data != null && tabType  == 'category' && 
							    		<ProductTypesListView  data ={data} cateTitle={categoryListName} onLoadProductGalleryListFromTypes={this.onLoadProductGalleryListFromTypes.bind(this)}/>
							    }

							    {!isGallery && typesData && (
					    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'liquor'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    		)}
						    </ScrollView>

						    <ScrollView tabLabel='MIXERS' style={styles.ScrollView}>
						    	{
						    		isGallery && typesData && (
						    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'mixers'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
						    		)
						    	}
						    	{
						    		isGallery && typesData==null && (
						    			<ProductGalleryListView 
						    			galleryData = {null}
						    			galleryInformation = {null} 
						    			selectCategoryName = {'mixers'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    			)
						    	}
						    	{!isGallery && !typesData && data == null && loading == false &&
						    		<Text style={{width:screen_width ,textAlign:'center'}}>There are no products currently.</Text>
						    	}
							    {!isGallery && !typesData && data != null && tabType  == 'category' && 
							    		<ProductTypesListView  data ={data} cateTitle={categoryListName} onLoadProductGalleryListFromTypes={this.onLoadProductGalleryListFromTypes.bind(this)}/>
							    }

							    {!isGallery && typesData && (
					    			<ProductGalleryListView 
						    			galleryData = {typesData.data}
						    			galleryInformation = {typesData.next_page_url} 
						    			selectCategoryName = {'mixers'} 
						    			typeName = {typeName}
						    			galleryTypesID={galleryTypesID}
				  						galleryFlag={galleryFlag}
				  						galleryName={galleryName} />
					    		)}
						    </ScrollView>
						    
						    <View 
						    	tabLabel='PARTY ORDERS' 
						    	style={styles.ScrollView}>
						    	{tabType == 'order' && (
						    		<PartyOrderFormView/>
						    	)}
						    </View>
						    

						    <ScrollView tabLabel='VIDEOS' style={styles.ScrollView}>
						    	{tabType == 'video' && (
						    		<FeatureVideoListView />
						    	)}
						    </ScrollView>
					    </ScrollableTabView>
					</View>
				</View>
			</SideMenu>
		)
	};
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor: '#FFF',
		flexDirection:'column',
		flex:1
	},

	ScrollView: {
		backgroundColor: '#FFF'
	}

})

export default connect(
  state => ({
  	productTypes: state.productTypes, 
  	productCategories: state.productCategories, 
  	geoCodeForm: state.geoCodeForm, 
  	productGallery: state.productGallery,
  	TabID: state.tabInfo.saveTabID,
  	tabType: state.tabInfo.tabType,
  	listTypeID: state.tabInfo.listTypeID,
  	clientTokenResult: state.userRegister.clientTokenResult,
  	userGeoAddressList: state.geoCodeForm.selectedList,
  }),{loadProductTypesList, loadProductGalleryListFromCategory, loadProductGalleryListFromTypes, saveTabID, saveCurrentPage, savePrevPage, saveTabType})(TabView);
