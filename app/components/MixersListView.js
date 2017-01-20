import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, ListView, Image, View, Text, TouchableOpacity, ScrollView, RecyclerViewBackedScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {loadProductTypesList} from '../redux/actions/productTypesActions'
import {connect} from 'react-redux'
import {screen_dimensions} from '../constants';
const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

class MixersListView extends Component{

	constructor(props) {
	  super(props);
		console.log('**init props', props);

		this.state = {
		  	dataSource: null,
		};
	}

	componentDidMount(){

		const {clientTokenResult} = this.props;
		clientToken = 'Bearer ' + clientTokenResult.access_token;

	    this.props.loadProductTypesList('mixers', this.props.geoCodeForm.selectedID, clientToken);
	}

	componentWillReceiveProps(nextProps) {
		
		const {categoryTypes} = nextProps.productTypes;
		const {selectedCategory} = nextProps.productCategories;

		console.log('**selectedCategory**', selectedCategory);
		if (categoryTypes && categoryTypes.length > 0) {
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState(categoryTypes: categoryTypes);
			this.setState({dataSource: ds.cloneWithRows(categoryTypes[0].product_types)});
		}
	}

	_toGalleryView(rowData){
		Actions.productGallery({selectedProductListName: rowData.name})
	}

	render(){

		return(
			<View style={styles.bg}>

				{ this.state.dataSource && (
				<View style= {{flex:1}}>
					<View style={styles.ProductTypesListView}>
				  		<ListView
					        dataSource={this.state.dataSource}
					        renderRow={this._renderRow.bind(this)}
					        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
	            			renderSeparator={this._renderSeparator}
	      				/>
	      			</View>
			  	</View>)}
			</View>
		)
	};

	_renderRow (rowData: object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

		console.log('rowData',rowData)
		
	    return (
	      	<TouchableHighlight onPress={() => {highlightRow(sectionID, rowID);{Actions.productGallery({selectedTypes: rowData.id})}}}>
		        <View style={{height:75,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
		        	<View style={{flex:1}}>
		        		<Image source={{uri:rowData.banner_mobile}} resizeMode={Image.resizeMode.contain} style={styles.categoryList_image}/>
		        	</View>
					<View style={{flex:6}}>
						<Text style={styles.categoryListTitle}>{rowData.name+' ('+rowData.products_total+')'}</Text>
					</View>
				</View>
	      	</TouchableHighlight>
	    );
	}

  	_renderSeparator (sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    	return (
      		<View
        		key={`${sectionID}-${rowID}`}
        		style={{ height: 1, backgroundColor:'#AAA', flex:1,opacity:0.2}}
      		/>
    	);
  	}

  	_pressRow (rowID: number) {
		    this._pressData[rowID] = !this._pressData[rowID];
		    this.setState({dataSource: this.state.dataSource.cloneWithRows(
		    this._genRows(this._pressData)
	    )});
  	}
}

const styles= StyleSheet.create({

	bg: {
		backgroundColor: 'white',
		flexDirection:'column',
		flex:1
	},

	ProductTypesListView:{
		flex:1,
	},
})

export default connect(
  state => ({
  	productTypes: state.productTypes, 
  	productCategories: state.productCategories, 
  	geoCodeForm: state.geoCodeForm,
  	clientTokenResult: state.userRegister.clientTokenResult
}),{loadProductTypesList})(MixersListView);