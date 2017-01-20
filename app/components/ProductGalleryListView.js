import React, {Component} from 'react';
import {
	StyleSheet, 
	TouchableHighlight, 
	Image, 
	View, 
	Text, 
	TouchableOpacity, 
	ScrollView, 
	ListView,
	RecyclerViewBackedScrollView, 
	InteractionManager,
	AsyncStorage,
	RefreshControl
} from 'react-native'

import Menu, {
	MenuContext,
	MenuOptions,
	MenuOption,
	MenuTrigger
} from 'react-native-menu';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import _ from 'lodash';
import numeral from 'numeral';
import {savePrevPage, saveTabType, saveCurrentPage} from '../redux/actions/tabInfoAction';
import {loadProductGalleryListFromNextUrl} from '../redux/actions/productGalleryActions';
import ModalDropdown from 'react-native-modal-dropdown';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {screen_dimensions} from '../constants';

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

/** generate prouctGallerylist**/

class ProductGalleryListView extends Component{

	constructor(props) {
	  super(props);

	  this.state = {

	  	showSortList: false,
		typeName: props.typeName,
		galleryData: null,
		searchPage: 'false',
		dataSource: null,			//identify searchproduct page when click search button
		galleryInformation:null,
		contentLength: 500,
		offset: 0,
		reachedAtBottom: false,
		gallerySelectedOption: 0,
	  };
	}

	componentWillMount() {
		
		const {galleryData, selectCategoryName, galleryInformation} = this.props;
		console.log('selectCategoryName on componentWillMount:', selectCategoryName);
		if (selectCategoryName != 'Featured') {
			AsyncStorage.getItem('gallerySelectedOption').then((value) => {
				if (value != null)
				{
					this.setState({gallerySelectedOption: JSON.parse(value)});
				}
			}).done();
			AsyncStorage.getItem('galleryInformation').then((value) => {
				if (value != null) {
					console.log('PPPPPPPPP');
					this.setState({galleryInformation: JSON.parse(value)});
				}
				else {
					this.setState({galleryInformation: galleryInformation});
				}
				console.log('galleryInformation componentWillMount:', this.state.galleryInformation);
			}).done();
			AsyncStorage.getItem('galleryData').then((value) => {
				if (value)
					console.log('value.length on componentWillMount:', value.length);
				else
					console.log('value on componentWillMount = null')
				if (value != null) {
					asyncGalleryData = JSON.parse(value);
					this.setState({galleryData: asyncGalleryData});
				}
				else {
					this.setState({galleryData:galleryData});
					console.log('XXXXXXXXXXXXXXXXXX');
				}
				if (this.state.gallery)
					console.log('galleryData.length componentWillMount:', this.state.galleryData.length);
			}).done();
			AsyncStorage.getItem('galleryOffset').then((value) => {
				if (value != null) {
					console.log('QQQQQQQ', value);
					this.setState({galleryOffset: JSON.parse(value)});
				}
				console.log('galleryOffset componentWillMount:', this.state.galleryOffset);
			}).done();
		}
		else
		{
			this.setState({galleryData:galleryData});
		}
		console.log('selectCategoryName:', selectCategoryName);
		if (selectCategoryName == 'Featured') {
			this.props.savePrevPage('productCategory');	
		}
		else if (selectCategoryName == 'SearchProduct') {
			this.props.savePrevPage('searchProductView');
		}
		else {
			this.props.savePrevPage('productCategory');	
		}

		const isSearchPage = this.props.searchPage;
		console.log('isSearchPage', isSearchPage);
		if (isSearchPage && isSearchPage == true) {
			this.setState({searchPage: 'true'});
		}


	  	this.props.saveCurrentPage('gallery');
	  	// this.props.saveCurrentPage('productGallery');
	}

	componentDidMount() {
		
	}

	componentWillReceiveProps(nextProps){
	}

	onGotoProductDetailView(rowData) {
		const {galleryTypesID, galleryFlag, galleryName, selectCategoryName} = this.props;
		const {galleryData, galleryInformation, gallerySelectedOption} = this.state;
		console.log('gallerySelectedOption onGotoProductDetailView:', gallerySelectedOption);
		AsyncStorage.setItem('gallerySelectedOption', JSON.stringify(gallerySelectedOption));
		AsyncStorage.setItem('galleryData', JSON.stringify(galleryData));
		AsyncStorage.setItem('galleryInformation', JSON.stringify(galleryInformation));
		AsyncStorage.setItem('galleryOffset', JSON.stringify(this.refs.listview.scrollProperties.offset));
		if (selectCategoryName == 'SearchProduct')
			Actions.productDetailView({productData: rowData, 
				prevPage: 'searchProductView', 
				galleryTypesID: galleryTypesID,
				galleryFlag: galleryFlag,
				galleryName: galleryName,
				typeName: this.state.typeName,
			});
		else
			Actions.productDetailView({productData: rowData, 
				prevPage: 'tab', 
				galleryTypesID: galleryTypesID,
				galleryFlag: galleryFlag,
				galleryName: galleryName,
				typeName: this.state.typeName,
			});
		this.props.saveTabType('gallery');
	}

	_onSelectRecommended(index, value) {
		const {galleryData} = this.props;
		if (index == 0)	//name a-z
		{
			galleryData.sort(this.sortNameAZ);
		}
		if (index == 1)	//name z-a
		{
			galleryData.sort(this.sortNameZA);
		}
		if (index == 2)	//price Low to High
		{
			galleryData.sort(this.sortPriceLowToHigh);
		}
		if (index == 3)	//price High to Low
		{
			galleryData.sort(this.sortPriceHighToLow);
		}
		this.setState({galleryData: galleryData});
		this.setState({gallerySelectedOption: index});
  		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		// this.setState({dataSource: ds.cloneWithRows(galleryData)});
	}

	sortNameAZ(a,b) {
		var A = a.name.toLowerCase();
	     var B = b.name.toLowerCase();
	     if (A < B){
	        return -1;
	     }else if (A > B){
	       return  1;
	     }else{
	       return 0;
	     }
	}
	sortNameZA(a,b) {
		var A = a.name.toLowerCase();
	     var B = b.name.toLowerCase();
	     if (B < A){
	        return -1;
	     }else if (B > A){
	       return  1;
	     }else{
	       return 0;
	     }
	}

	sortPriceLowToHigh(a,b) {
		var A = a.supplier_products[0].real_price;
	    var B = b.supplier_products[0].real_price;
	    return parseFloat(A) - parseFloat(B);
	}

	sortPriceHighToLow(a,b) {
		var A = a.supplier_products[0].real_price;
	    var B = b.supplier_products[0].real_price;
	    return parseFloat(B) - parseFloat(A);
	}

	async fetchMoreContent(galleryInformation) {
		console.log('DDDD');
		console.log('next_page_url:', galleryInformation);
		const {clientTokenResult} = this.props;
		let {galleryData} = this.state;
		clientToken = 'Bearer ' + clientTokenResult.access_token;
		const result = await this.props.loadProductGalleryListFromNextUrl(galleryInformation, clientToken);
		console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

	    this.setState({galleryInformation:result.result.body.next_page_url});
	    if (result.result)
		{
			var data = result.result.body.data;
			for (var i=0; i<data.length; i++)
			{
				galleryData.push(data[i])
			}
			this.setState({galleryData: galleryData});
			this.setState({reachedAtBottom:false});
			console.log('offset on scrollto:', this.state.offset);
		}
	}
	_loadMoreContentAsync = async () => {
		console.log("BBBB");
		var contentLength = this.refs.listview.scrollProperties.contentLength;
		console.log('contentLength:', contentLength);
		console.log('this.scrollProperties:', this.refs.listview.scrollProperties);
		console.log('this.state.reachedAtBottom:', this.state.reachedAtBottom);
		console.log('this._contentLength:', this._contentLength);
  		if (this._contentLength !== contentLength && this.state.reachedAtBottom == false) {

		    const {galleryInformation} = this.state;
		    console.log('this._contentLength !== contentLength');
		    if (galleryInformation) {
		    		this.setState({reachedAtBottom:true});
		    		this.fetchMoreContent(galleryInformation)
		    }
	    }
 	}
 	onScroll(){
 		console.log('onScroll');
 		console.log('scrollProperties on onScroll:', this.refs.listview.scrollProperties);
 		console.log('offset:', this.refs.listview.scrollProperties.offset);
 		var contentLength = this.refs.listview.scrollProperties.contentLength;
 		var offset = this.refs.listview.scrollProperties.offset
        if (this.refs.listview.scrollProperties.visibleLength + this.refs.listview.scrollProperties.offset >= contentLength){
        	if (contentLength > offset ) {
        		console.log('contentLength > offset');
	        	console.log('visibleLength:', this.refs.listview.scrollProperties.visibleLength);
	        	console.log('contentLength:', this.refs.listview.scrollProperties.contentLength);
	        	console.log('offset over');
	            this._loadMoreContentAsync();
	        }
        }
    }

 	_renderRefreshControl() {
    // Reload all data
	const {loading} = this.props.productGalleryOfTypes;
	console.log('loading:', loading);
    return (
      <RefreshControl
        refreshing={loading}
      />
    );
  }
  	renderFooter () {
  		const {loading} = this.props.productGalleryOfTypes;
        return loading ? 
        	<View style={{height:20, justifyContent:'center', alignItems:'center', width:screen_width}}>
        		<Text style={{color:'#DC754C'}}>Loading...</Text>
        	</View> 
        	: null
    }

	render(){
		console.log("CCCC");
		const instance = this;
		const galleryData_props = this.props.galleryData
		const {isDetail} = this.props.isDetail;
		let {galleryData, searchPage, dataSource, galleryOffset, gallerySelectedOption} = this.state;

		var heightOffset = 167;
		var offset = 0;
		if (searchPage == 'true') {
			console.log('searchPage == true');
			galleryData = galleryData_props;
			heightOffset = 118;
			//118
		}
		if (galleryData)
		{
			console.log('galleryData.length:', galleryData.length);
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			dataSource = ds.cloneWithRows(galleryData);
			offset = galleryOffset;
		}
		else
		{
			console.log('galleryData is null');
			offset = 0;
		}
		var recommendedList=['Name A to Z', 'Name Z to A', 'Price Low to High', 'Price High to Low'];

		return(
			<View style={styles.bg}>

				<View style={{height:35,backgroundColor:'#FFF',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
					<View style={{paddingLeft:10,flex:1}}>
						<Text style={{color:'#58595B'}}>{this.state.typeName}</Text>
					</View>
					<View style={{flexDirection:'row', alignItems:'center'}}>
						<ModalDropdown
				  			ref='exp_month'
				  			options={recommendedList}
				  			defaultValue={recommendedList[parseInt(gallerySelectedOption)]}
				  			textStyle={{fontSize:15, color:"#414042", paddingRight:0}}
				  			onSelect={(index, value)=>this._onSelectRecommended(index, value)}>
				  		</ModalDropdown>
				  	</View>
				</View>

				<View style={{borderColor:'#58595B', borderWidth:1, opacity:0.1}}/>

				<View style={{backgroundColor:'#F1F2F2', flex: 1}}>
					{dataSource ?
						// isDetail == 'false' ?
							<ListView
								ref={"listview"}
								// (screen_height*0.4+20)*galleryData.length/2}
								// style={styles.listView}
								style={{flex: 1, height:screen_height-heightOffset}}
								renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />} 
								//renderScrollComponent={this._renderScrollComponent.bind(this)}
								contentContainerStyle={styles.list}
								dataSource={dataSource}
								renderRow={this._renderRow.bind(this)}
								enableEmptySections={true}
								renderSeparator={this._renderSeparator}
								onScroll={this.onScroll.bind(this)}
								// contentOffset={{y:100}}
								// refreshControl={this._renderRefreshControl()}
								// canLoadMore={true}
								// onLoadMoreAsync={this._loadMoreContentAsync}
								// onEndReached={this._loadMoreContentAsync}
								renderFooter={this.renderFooter.bind(this)}
								onEndReachedThreshold={2000}
	                    		automaticallyAdjustContentInsets={false}
							/>
							// :

							// <ListView
							// 	ref={"listview"}
							// 	// (screen_height*0.4+20)*galleryData.length/2}
							// 	// style={styles.listView}
							// 	style={{flex: 1, height:screen_height-heightOffset}}
							// 	renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />} 
							// 	//renderScrollComponent={this._renderScrollComponent.bind(this)}
							// 	contentContainerStyle={styles.list}
							// 	dataSource={dataSource}
							// 	renderRow={this._renderRow.bind(this)}
							// 	enableEmptySections={true}
							// 	renderSeparator={this._renderSeparator}
							// 	onScroll={this.onScroll.bind(this)}
							// 	// contentOffset={{y:offset}}
							// 	// refreshControl={this._renderRefreshControl()}
							// 	// canLoadMore={true}
							// 	// onLoadMoreAsync={this._loadMoreContentAsync}
							// 	// onEndReached={this._loadMoreContentAsync}
							// 	renderFooter={this.renderFooter.bind(this)}
							// 	onEndReachedThreshold={2000}
	      //               		automaticallyAdjustContentInsets={false}
							// />
						:
						null
					}
				</View>				
			</View>
		)
	};

	_renderRow (rowData: object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

	    return (

	      	<TouchableHighlight onPress={() => {highlightRow(sectionID, rowID); this.onGotoProductDetailView(rowData);}}>

		        <View style={styles.item}>
					<View style={{flex:6,padding:10}}>
						<Image source={{uri:rowData.image_path}} resizeMode={Image.resizeMode.contain} style={{width:100,height:100}}/>
					</View>
					<View style={{flex:4,padding:10}}>
						<Text style={{fontSize:14}} numberOfLines={1} >{rowData.name}</Text>
						<Text style={{fontSize:14}} numberOfLines={1} >{rowData.supplier_products[0].unit_measurement}</Text>
						<Text style={{fontSize:14}} numberOfLines={1} >${numeral(rowData.supplier_products[0].real_price).format('0.00')}</Text>
						{(rowData.supplier_products.length == 1 )&& (
							<Text style={{fontSize:14, fontStyle: 'italic'}} numberOfLines={1} >1 size available</Text>
						)}
						{(rowData.supplier_products.length == 2 )&& (
							<Text style={{fontSize:14, fontStyle: 'italic'}} numberOfLines={1} >1 more size available</Text>
						)}
						{(rowData.supplier_products.length > 2) && (
							<Text style={{fontSize:14, fontStyle: 'italic'}} numberOfLines={1} >{rowData.supplier_products.length-1} more sizes available</Text>
						)}
					</View>
		        </View>
	      	</TouchableHighlight>
	      	
	    );
	}

	_renderSeparator (sectionID: number, rowID: number, adjacentRowHighlighted: bool) {

  		return (
	  		<View
	    		key={`${sectionID}-${rowID}`}
	    		style={{ height: 1, backgroundColor:'#F1F2F2', flex:1,opacity:0.8}}
	  		/>
  		);
	}
}


const styles= StyleSheet.create({

	bg: {
		backgroundColor: '#F1F2F2',
		flexDirection:'column',
		flex:1,
		position: 'relative',
	},

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

	list: {
		flexDirection:'row',
    	flexWrap: 'wrap',
		alignItems:'center',
		backgroundColor:'#F1F2F2',
   	},

   	listView: {
    	flex: 1,
	},
  	item: {

    	backgroundColor: '#FFF',
		width:screen_width*0.47,
		height:screen_height*0.36,
		alignItems:'center',
		borderRadius:5,
		marginLeft:5,
		marginTop:10,
  	},

	menuTopbar: {
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},

	menuTrigger: {
		flexDirection: 'row',
	},

	dropdownOptions: {
		flex: 1,
	    borderColor: '#ccc',
	    borderWidth: 2,
	    width: 300,
	    height: 200,
	    position: 'absolute',
	    right: 0,
	},

	divider: {
		marginVertical: 5,
		marginHorizontal: 2,
		borderBottomWidth: 1,
		borderColor: '#ccc'
	}

})

export default connect(
  	state => ({
  		productGalleryOfTypes: state.productGalleryOfTypes,
  		clientTokenResult: state.userRegister.clientTokenResult,
  		isDetail: state.tabInfo.isDetail,
  	}),{savePrevPage, saveTabType, saveCurrentPage, loadProductGalleryListFromNextUrl})(ProductGalleryListView);
