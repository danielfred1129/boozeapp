import React,{Component} from 'react';
import Drawer from 'react-native-drawer'

export default class MainMenu extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	closeControlPanel = () => { this._drawer.close()};
  	openControlPanel = () => { this._drawer.open()};

	render(){
		return(

			<Drawer
	            ref={(ref) => this._drawer = ref}
	            type="displace"
	            content={<SideMenu closeDrawer={this.closeControlPanel} />}
	            tapToClose={true}
	            openDrawerOffset={0.2} // 20% gap on the right side of drawer
	            panCloseMask={0.2}
	            closedDrawerOffset={-3}
	            styles={drawerStyles}
	            tweenHandler={(ratio) => ({main: { opacity:(2-ratio)/2 }})}
            >

          	</Drawer>
		)
	}
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: { paddingLeft: 3 },
}