import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, ListView, Image, View, Text, RecyclerViewBackedScrollView, TouchableOpacity, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {loadVideoFeatureList} from '../redux/actions/videoFeatureActions'
import {savePrevPage, saveTabType} from '../redux/actions/tabInfoAction';
import Browser from 'react-native-browser';
import {screen_dimensions} from '../constants';
const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

class FeatureVideoListView extends Component{

	constructor(props) {
	  super(props);
			
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  this.state = {
			dataSource: null
	  };
	}
	componentDidMount(){
		const {clientTokenResult} = this.props;
		clientToken = 'Bearer ' + clientTokenResult.access_token;
		
		this.props.loadVideoFeatureList(clientToken);
		this.props.savePrevPage('productCategory');
		
		// Browser.open('https://google.com/');
	}

	componentWillReceiveProps(nextProps){
		
		const {videolist} = nextProps.videoFeature;

		if(videolist){
			console.log('videolist', videolist);
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({dataSource: ds.cloneWithRows(videolist)});
		}
	}

	_onShowVideo(rowData) {
		this.props.saveTabType('video');
		Actions.featureVideoWebview({videoData: rowData});

	}

	render(){

		return(
			<View style={styles.bg}>

			  	<View style={{height:50, justifyContent:'space-between', alignItems:'center',flexDirection:'row'}}>
			  		<Text style={{fontSize:20, color:'#7e5d91',marginLeft:10}}>Featured Videos</Text>
			  	</View>

			  	<View style={{borderColor:'#58595B', borderWidth:1, opacity:0.1}}></View>

				{ this.state.dataSource && (
					<View style={styles.VideoListView}>
						<ListView
					        dataSource={this.state.dataSource}
					        renderRow={this._renderRow.bind(this)}
					        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
	            			renderSeparator={this._renderSeparator}
      					/>
			  		</View>
				)}
			</View>
		)
	};

	_renderRow (rowData: object, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

	    return (
	        <TouchableHighlight onPress={() => {highlightRow(sectionID, rowID); this._onShowVideo(rowData)}}>

		        <View style={{height:screen_height*0.153, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>

		        	<View style={{flex:1, marginTop:5}}>
		        		<Image source={{uri:rowData.thumbnails.medium.url}} resizeMode={Image.resizeMode.contain} style={styles.categoryList_image}/>
		        	</View>

					<View style={{flex:1.5, flexDirection:'column', marginLeft:50, marginRight:20}}>

						<View style={{flex:1,flexDirection:'column', justifyContent:'center',alignItems:'flex-start'}}>
							<Text style={styles.categoryListTitle} numberOfLines ={2}>
								{rowData.description}
							</Text>
						</View>

						<View style={{flex:1,flexDirection:'column', justifyContent:'center',alignItems:'flex-start'}}>
							<Text style={{fontSize:11,color:'#6d6e71'}} numberOfLines ={1}>{rowData.name}</Text>
							<Text style={{marginTop:5,fontSize:11,color:'#6d6e71'}} numberOfLines ={1}>by {rowData.author}</Text>
						</View>
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

	categoryList_image:{

		width: screen_width*0.4,
		height: screen_height*0.132,
		marginLeft:10,
		marginTop:0,
		backgroundColor:'#FFF',
		
	},

	categoryListTitle:{
		color: '#414042',
		fontSize: 15.5,
		paddingTop:5,
		marginRight:20
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

	VideoListView:{
		flex:1,
		backgroundColor:'#F4F4F4'
	},
})

export default connect(
  state => ({
  	videoFeature: state.videoFeature,
  	clientTokenResult: state.userRegister.clientTokenResult
}),{loadVideoFeatureList, savePrevPage, saveTabType})(FeatureVideoListView);