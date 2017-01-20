import {Actions} from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';
import {screen_dimensions} from '../constants';

const React = require('react');
const {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} = require('react-native');
const { Component } = React;

const screen_width = screen_dimensions.screen_width;
const screen_height = screen_dimensions.screen_height;

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: screen_width * 0.7,
    height: screen_height,
    backgroundColor: 'white',
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
    marginLeft:10,
    width: screen_width * 0.45,
  },
  item_address: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
    marginLeft:10,
    width: screen_width * 0.48,
  },
  arrowImgStyle : {
    height:30, 
    backgroundColor:'#FFF',
    width:12
  },
});

module.exports = class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      suppliers_type: '',
      signin_type: 'false',
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('suppliers_type').then((value) => {
      this.setState({suppliers_type: JSON.parse(value)});
    }).done();


    AsyncStorage.getItem('signin_type').then((value) => {
      this.setState({signin_type: JSON.parse(value)});
    }).done();
  }

  componentDidMount() {
  
  }

  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  };

  onPayments() {
    Actions.paymentMethodsView();
  }

  onSelectStore() {
    var {suppliers_type} = this.state;

    if (suppliers_type == false)
      Actions.deliveryStoreView();
    else
      Actions.deliveryStoreSplitView();
  }

  onMainMenu() {
    Actions.productCategory();
  }

  render() {
    var geoAddress = '';
    const {userGeoAddressList, addressView_flag} = this.props;

    var street = '', city ='', state='',zipCode='',country='';

    if (userGeoAddressList) {
      geoAddress = userGeoAddressList.userGeoAddress.formatted_address;

      var  value=geoAddress.split(",");
            
      count=value.length;
      
      country=value[count-1];
      state=value[count-2];
      city=value[count-3];
      street=value[count-4];
      pin=state.split(" ");
      zipCode=pin[pin.length-1];
      state=state.replace(zipCode,'');
      state=state.replace(' ','');
      newState = state.replace(/\s/g, '');
    }

    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View>
          <View style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:20, marginLeft:20}}>
            <View style={{height:55}}>
              <Image source={require('../assets/images/pin.png')} resizeMode={Image.resizeMode.contain} style={{height:30, backgroundColor:'#FFF',width:15}}/>
            </View>
            { userGeoAddressList ?
            <View stlye={{flexDirection: 'column'}}>
              <Text style={styles.item_address} multiline={true}>
                {street}
              </Text>
              <Text style={styles.item_address} multiline={true}>
                {city + ', ' + newState+', '+zipCode}
              </Text>
            </View>
            : null
            }
          </View> 
          <View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:1}}></View>
        </View>

        { addressView_flag != 'false' ?
        <View>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:20, marginLeft:20}} onPress={() => this.onSelectStore()}>
            <View style={{height:40}}>
              <Image source={require('../assets/images/store.png')} resizeMode={Image.resizeMode.contain} style={{height:30, backgroundColor:'#FFF',width:20}}/>
            </View>
            <Text
              style={styles.item}
              multiline={true}>
              Delivering From
            </Text>
            <Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.contain} style={styles.arrowImgStyle}/>
          </TouchableOpacity> 
          <View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:1}}></View>
        </View>
        : null
        }

        <View>
          <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:20, marginLeft:20}} onPress={() => this.onMainMenu()}>
            <View style={{height:40}}>
              <Image source={require('../assets/images/side_menu_icon.png')} resizeMode={Image.resizeMode.contain} style={{height:30, backgroundColor:'#FFF',width:20}}/>
            </View>
            <Text
              style={styles.item}
              multiline={true}>
              Main Menu
            </Text>
            <Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.contain} style={styles.arrowImgStyle}/>
          </TouchableOpacity> 
          <View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:1}}></View>
        </View>
        {this.state.signin_type == 'true' ?
          <View>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:20, marginLeft:20}} onPress={() => this.onPayments()}>
              <View style={{height:40}}>
                <Image source={require('../assets/images/payment_methods.png')} resizeMode={Image.resizeMode.contain} style={{height:30, backgroundColor:'#FFF',width:20}}/>
              </View>
              <Text
                style={styles.item}
                multiline={true}>
                Payment Methods
              </Text>
              <Image source={require('../assets/images/right_arrow.png')} resizeMode={Image.resizeMode.contain} style={styles.arrowImgStyle}/>
            </TouchableOpacity> 
            <View style={{borderBottomColor:'#F1F2F2',borderBottomWidth:1}}></View>
          </View>
        : null
        }
      </ScrollView>
    );
  }
};
