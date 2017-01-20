import React,{Component} from 'react';
import {Scene, Router, ActionConst} from 'react-native-router-flux';
import AgeCheckView from './AgeCheckView'
import AddressView from './AddressView'
import ProductCategoryListView from '../components/ProductCategoryListView'
import NonServiceAreaView from '../components/NonServiceAreaView'
import ProductGalleryListView from '../components/ProductGalleryListView'
import PartyOrderFormView from '../components/PartyOrderFormView'
import FeatureVideoListView from '../components/FeatureVideoListView'
import TabView from '../components/TabView'
import BeerListView from '../components/BeerListView'
import TabGalleryView from '../components/TabGalleryView'
import WineListView from '../components/WineListView'
import LiquorListView from '../components/LiquorListView'
import MixersListView from '../components/MixersListView'

export default class TestPage extends Component{
	render(){
	  return(
		<Router hideNavBar={true}>
			<Scene key="age" component={AgeCheckView} title="AgeCheckView" type={ActionConst.RESET} initial={true}/>
			<Scene key="address" component={AddressView} title="AddressView" type={ActionConst.REPLACE}/>
			<Scene key="productCategory" component={ProductCategoryListView} title="ProductCategoryListView" type={ActionConst.REPLACE}/>
		</Router>
	  );
	}
}