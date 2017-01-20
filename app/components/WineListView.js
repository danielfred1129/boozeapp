import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, ListView, Image, View, Text, TouchableOpacity, ScrollView, RecyclerViewBackedScrollView, Dimensions} from 'react-native'
import {Actions,Scene, Router, ActionConst} from 'react-native-router-flux';
import {connect} from 'react-redux'

const screen_width = Dimensions.get('window').width;
const screen_height = Dimensions.get('window').height;


export default class WineListView extends Component{

	constructor(props) {
	  super(props);

		console.log('**WineList init props', props);
		
		this.state = {
		  dataSource: null
		};
	}

	componentWillReceiveProps(nextProps){

		const data = nextProps.data

		if(data){

			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({dataSource: ds.cloneWithRows(data)})
		}
	}

	render(){

		return(

			<View style={styles.bg}>
				{this.state.dataSource && (
					<View style= {{flex:1}}>
						<View style={styles.ProductTypesListView}>
					  		<ListView
						        dataSource={this.state.dataSource}
						        renderRow={this._renderRow.bind(this)}
						        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
		            			renderSeparator={this._renderSeparator}
		      				/>
		      			</View>
				  	</View>
				)}
			</View>
		)
	};

	_renderRow (rowData: object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
		
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
