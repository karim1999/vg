import React from "react";
import {
	View,
	ImageBackground,
	AsyncStorage,
	TouchableOpacity,
	Linking,
	ActivityIndicator,
	FlatList, RefreshControl
} from "react-native";
import {Container, Content, Text, List, ListItem, Left, Body, Right, Icon, Thumbnail, H2, Toast} from "native-base";
import {SERVER_URL, STORAGE_URL} from "../config";
import AppTemplate from './../components/appTemplate';
import ImagePicker from 'react-native-image-picker';
import axios from "axios";
import { strings } from '../i18n';
import I18n from "../i18n";
import _ from 'lodash';
import {connect} from "react-redux";
import {setUser} from "../reducers";

class User extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			id: this.props.navigation.state.params.id,
			users: []
		};
	}
	componentDidMount(){
		return axios.get(SERVER_URL+"api/project/"+this.state.id+'/users').then(response => {
			this.setState({
				users: response.data
			});
		}).catch(error => {
			Toast.show({
				text: strings("messages.noInternet"),
				buttonText: strings("messages.ok"),
				type: "danger"
			})
		}).then(() => {
			this.setState({
				isLoading: false
			});
		})
	}
	render() {
		return (
			(this.state.isLoading)? (
				<AppTemplate backButton title={strings("app.partners")} navigation={this.props.navigation} activeTab="Home">
					<ActivityIndicator size="large" color="#000000" />
				</AppTemplate>
			):(
				<AppTemplate backButton title={strings("app.partners")} navigation={this.props.navigation} activeTab="Home">
					<List>
						<FlatList
							ListEmptyComponent={
								<Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>{strings("home.notFound")}</Text>
							}
							data={this.state.users}
							renderItem={({item}) => (
								<ListItem
									onPress={()=> this.props.navigation.navigate('User', {id: item.id})}
									avatar>
									<Left>
										<Thumbnail source={{uri: STORAGE_URL+item.img}} />
									</Left>
									<Body>
									<Text>{item.name}</Text>
									<Text note>{_.truncate(item.description)}</Text>
									</Body>
									<Right>
										{/*<Text note>3:43 pm</Text>*/}
									</Right>
								</ListItem>
							)}
							keyExtractor = { (item, index) => index.toString() }
						/>
					</List>
				</AppTemplate>
			)
		);
	}
}
const mapStateToProps = ({ user }) => ({
	user,
});

const mapDispatchToProps = {
	setUser
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(User);
