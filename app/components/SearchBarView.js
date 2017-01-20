import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, Image, View, Text, TouchableOpacity, ScrollView, ListView,RecyclerViewBackedScrollView, InteractionManager} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import _ from 'lodash';
import SearchBar from 'react-native-search-bar'
import {changeSearchText} from '../redux/actions/searchDataAction';
import {loadProductTypesList} from '../redux/actions/productTypesActions'
import {AsyncStorage} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {saveIsDetail} from '../redux/actions/tabInfoAction';
/** generate prouctGallerylist**/

class SearchBarView extends Component{

	constructor(props) {
	  	super(props);

	  	this.state = {
			searchStatus: 'off',
			searchText: null,
			badgeNumber: 0,
			cartInfo: null,
			firstSignIn: null,
			addFlag: 'false'
		};
	}

	componentWillMount(){
		
		const {cartInfo_props, removedCartInfo, removeFlag, addFlag} = this.props;
		
		this.setState({addFlag: addFlag});

		if (removeFlag != null && removeFlag == "true")
		{
			this.setState({cartInfo: removedCartInfo});
		}
		if (this.state.addFlag == 'true') {
			this.setState({cartInfo: cartInfo_props});
		}
		

		AsyncStorage.getItem('firstSignIn').then((value) => {
			console.log('async firstSignin:', JSON.parse(value));
       		this.setState({firstSignIn: JSON.parse(value)});
	    }).done();
	}

	componentDidMount() {
  	}

	componentWillReceiveProps(nextProps){
		
		const {cartInfo_props, removedCartInfo, removeFlag, addFlag, detailPage} = nextProps;
		
		this.setState({addFlag: addFlag});
		
		if (removeFlag != null && removeFlag == "true")
		{
			this.setState({cartInfo: removedCartInfo});
		}
		if (this.state.addFlag == 'true') {
			this.setState({cartInfo: cartInfo_props});
		}
	}

	onSetSearchStatus(){
		const {searchStatus} = this.state;

		if (searchStatus == 'off') {
			this.setState({ searchStatus: 'on' })

		} else {
			this.setState({ searchStatus: 'off' })
		}
	}

	onSearchText(searchText){
		console.log(searchText);
		dismissKeyboard();
		//send search text to product list view
		this.props.changeSearchText(searchText);
		Actions.searchProductView();
		this.setState({ searchStatus: 'off' });
	}

	_onLogo() {
		Actions.productCategory();
	}

	_onBack() {
		const {currentPage, prevPage, galleryTypesID, galleryFlag, galleryName, isGallery, typeName, categoryListName} = this.props;
		console.log('currentPage on Back:', currentPage);
		console.log('prevPage onBack:', prevPage);
		if (currentPage == 'gallery') {
			if (prevPage == "productCategory") {
				if (categoryListName == 'Featured')
					Actions.productCategory();
				else
					this.props.onLoadProductTypesListFromTypes(false);
			}
			else if (prevPage == 'searchProductView') {
				Actions.productCategory();
			}
			else {
				this.props.onLoadProductTypesListFromTypes(false);
			}
		}
		else if (currentPage == 'productDetailView')
		{
			if (prevPage == 'searchProductView')
				Actions.searchProductView();
			else
			{
				Actions.tab({
						galleryTypesID: galleryTypesID,
						galleryFlag: galleryFlag,
						galleryName: galleryName,
						currentPageForBack: currentPage,
						typeName: typeName,
						});
			}
		}
		else if (currentPage == 'productCartView' && prevPage == 'productCategory')
		{
			Actions.productCategory();
		}
		else if (currentPage == 'productCartView' && prevPage == 'gallery')
		{
			this.props.onLoadProductTypesListFromTypes(false);
		}
		else if (currentPage == 'productCartView' && prevPage == 'address')
		{
			Actions.productCategory();
		}
		else
		{
			console.log('ZZZZZZZZZZZZZZZZZ prevPage:', prevPage);
			Actions[prevPage];
		}
	}

	showProductCartView() {
		//const {cartInfo} = this.state;
		Actions.productCartView();
	}

	showCategoryPage(geoCodeForm) {
		const {clientTokenResult} = this.props;
		clientToken = 'Bearer ' + clientTokenResult.access_token;
		this.props.loadProductTypesList('beer', geoCodeForm, clientToken);
	}

	render(){
		const {prevPage, tabType, currentPage, geoCodeForm, orderPage} = this.props;
		console.log('currentPage on render of SearchBarView:', currentPage);
		console.log('prevPage onBack of SearchBarView:', prevPage);
		let {cartInfo} = this.state;

		let badgeNumber = 0;

		if (cartInfo == null)
			cartInfo = [];

		for (i = 0; i < cartInfo.length; i ++) {
			for (k = 0; k < cartInfo[i].products.length; k ++) {
				badgeNumber += cartInfo[i].products[k].quantity;
			}
		}

		return(
			<View>
				<View style={styles.ToolBar}>
			  		<View style={{marginBottom:-20, flexDirection:'row', width:80}}>
			  			{ orderPage != 'true'
					  	?	<View>
					  			{
						  		(currentPage == 'gallery') &&
							  		<TouchableOpacity onPress={()=>this._onBack()} >
							  			<Image source={require('../assets/images/navigationBack_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.navigationBack_icon}/>
							  		</TouchableOpacity>
							  	}
							  	{
							  	(currentPage == 'productDetailView') &&
							  		<TouchableOpacity onPress={()=>this._onBack()} >
							  			<Image source={require('../assets/images/navigationBack_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.navigationBack_icon}/>
							  		</TouchableOpacity>
							  	}
							  	{(currentPage != 'gallery') && (currentPage != 'productDetailView') && (currentPage == 'productCartView') &&
							  		<TouchableOpacity onPress={()=>this._onBack()} >
							  			<Image source={require('../assets/images/navigationBack_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.navigationBack_icon}/>
							  		</TouchableOpacity>
						  		}
							  	{(currentPage != 'gallery') && (currentPage != 'productDetailView') && (currentPage != 'productCartView') &&
							  		<TouchableOpacity onPress={Actions[prevPage]} >
							  			<Image source={require('../assets/images/navigationBack_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.navigationBack_icon}/>
							  		</TouchableOpacity>
						  		}
						  	</View>
					  	: 	null
					  	}

					  	{	this.state.firstSignIn != 'false'
				  		?	<TouchableOpacity onPress={this.props.onPress}>
					  			<Image source={require('../assets/images/side_menu_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.SideMenuIcon}/>
					  		</TouchableOpacity>
					  	: 	null
			  			}
			  		</View>

			  		<View style={{flex:1,alignItems:'center',marginBottom:-20}}>
			  		{
			  			this.state.firstSignIn != 'false' ?
			  			<TouchableOpacity onPress={()=>this._onLogo()}>
			  				<Image source={require('../assets/images/logo.png')} resizeMode={Image.resizeMode.contain} style={styles.LogoImage}/>
			  			</TouchableOpacity>
			  			:
			  			<TouchableOpacity>
			  				<Image source={require('../assets/images/logo.png')} resizeMode={Image.resizeMode.contain} style={styles.LogoImage}/>
			  			</TouchableOpacity>
			  		}
			  			
			  		</View>
			  		{
			  			this.state.firstSignIn != 'false' ?
			  			<View style={{flexDirection:'row',width:80,marginBottom:-20}}>
				  			<View style={{flex:1,backgroundColor:'#FFF',marginRight:10}}>
					  			<TouchableOpacity onPress={this.onSetSearchStatus.bind(this)} >
					  				<Image source={require('../assets/images/search_icon.png')} resizeMode={Image.resizeMode.contain} style={styles.SearchIcon}/>
					  			</TouchableOpacity>
				  			</View>
				  			<View style={{flex:1,backgroundColor:'#FFF',marginRight:0}}>
					  			<TouchableOpacity onPress={this.showProductCartView.bind(this)}>
					  				<Image style={styles.ShoppingCartIcon} source={require('../assets/images/shopping_cart_icon.png')} resizeMode={Image.resizeMode.contain} />
								</TouchableOpacity>
							</View>
							{ badgeNumber > 0 && (
								<TouchableOpacity onPress={this.showProductCartView.bind(this)}>
									<View style={styles.BadgeView} >
					  					<Text style={{color:'#FFF', fontSize:8, fontWeight: 'bold'}}>{badgeNumber}</Text>
					  				</View>
				  				</TouchableOpacity>
				  			)}
						</View>
						:
						<View style={{flexDirection:'row',width:80,marginBottom:-20}}/>
			  		}
			  	</View>

			  	{this.state.searchStatus == 'on' ? 
				  	<View style={styles.SearchBarStyle}>
					  	<SearchBar
						    ref={(ref) => this.searchBar = ref}
						    placeholder='Search Product'
						    onSearchButtonPress={this.onSearchText.bind(this)}
						    returnKeyType={'search'}
						/>
					</View>
				: null
				}
			</View>
		)
	};	
}

const styles= StyleSheet.create({
	ToolBar:{
		marginTop:0,
		height:75,
		backgroundColor:'#FFF',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		borderBottomWidth:2,
		borderBottomColor:'#EEE',
	},

	LogoImage:{
		width:150,
		height:75,
		marginTop:0,
	},

	navigationBack_icon:{
		width:25,
		height:20,
		marginLeft:5
	},

	SideMenuIcon:{
		width:25,
		height:20,
		marginLeft:10
	},

	SearchIcon:{
		width:25,
		height:25,
		marginRight:0
	},

	ShoppingCartIcon:{
		width:25,
		height:25,
	},

	SearchBarStyle:{
		height:45,
	},

	BadgeView: {
		width:20, 
		height:20,
		backgroundColor:'#000',
		borderRadius:50,
		position: 'absolute',
		right: 5,
		justifyContent: 'center',
		alignItems: 'center',
		bottom:15
	}
})

export default connect(
 	state => ({
 		prevPage: state.tabInfo.prevPage,
 		tabType: state.tabInfo.tabType,
 		currentPage: state.tabInfo.currentPage,
 		geoCodeForm: state.geoCodeForm, 
 		cartInfo_props: state.cartInfo.cartInfo,
 		clientTokenResult: state.userRegister.clientTokenResult
 	}),{loadProductTypesList, changeSearchText, saveIsDetail})(SearchBarView);
