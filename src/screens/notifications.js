import React from "react";
import {View, ImageBackground, AsyncStorage, TouchableOpacity, ActivityIndicator, FlatList} from "react-native";
import {Container, Content, Text, List, ListItem, Left, Body, Right, Thumbnail, H2, Toast} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {SERVER_URL, STORAGE_URL} from "../config";
import AppTemplate from './../components/appTemplate';
import ImagePicker from 'react-native-image-picker';
import axios from "axios";
import { strings } from '../i18n';
import I18n from "../i18n";
import _ from "lodash";
import firebaseApp from "./../firebaseDb";
let firebaseDb= firebaseApp.database();

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            isLoading: false
        };
    }
    componentDidMount(){
        this.setState({
            isLoading: true
        });
        firebaseDb.ref('/notifications/').on('value', data => {
            this.setState({
                notifications: _.values(data.val()),
                isLoading: false
            })
        });
    }
    render() {
        return (
            <AppTemplate title={strings("notifications.title")} navigation={this.props.navigation} activeTab="Notifications">
                <View>
                    <List>
                    {this.state.isLoading? (
                        <View>
                            <ActivityIndicator size="large" color="#000000" />
                        </View>
                    ) : (
                        <FlatList
                            ListEmptyComponent={
                                <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>{strings("home.notFound")}</Text>
                            }
                            data={_.reverse(this.state.notifications)}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.navigate(item.screen, item.data)}
                                >
                                    <ListItem avatar>
                                        <Left>
                                            <Thumbnail small source={{ uri: item.img }} />
                                        </Left>
                                        <Body>
                                        <Text>{item.title}</Text>
                                        <Text note>{item.description}</Text>
                                        </Body>
                                        <Right>
                                            {/*<Text note></Text>*/}
                                        </Right>
                                    </ListItem>
                                </TouchableOpacity>
                            )}
                            keyExtractor = { (item, index) => index.toString() }
                        />
                    )}
                    </List>
                </View>
            </AppTemplate>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notifications);
