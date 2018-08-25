import React from "react";
import {View, ImageBackground, AsyncStorage, TouchableOpacity} from "react-native";
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


const routes = [
    {
        text: strings("settings.profile"),
        icon: "user",
        name: "Profile"
    },
    {
        text: "Security",
        icon: "key",
        name: "Security"
    }
];

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: STORAGE_URL+this.props.user.img,
            isLoading: false,
            data: null
        };
    }
    logout(){
        return AsyncStorage.removeItem('token').then(()=>{
            this.props.navigation.navigate('Auth');
        });
    }
    getImage(){
        let options = {
            title: strings("settings.avatar"),
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    isLoading: true
                });
                let uri = response.uri;
                let data = new FormData();
                data.append('img', {
                    name: "img",
                    uri,
                    type: 'image/png'
                });
                AsyncStorage.getItem('token').then(userToken => {
                    axios.post(SERVER_URL+'api/user/img'+'?token='+userToken, data).then((resp) => {
                        this.setState({
                            isLoading: false,
                        });
                    }).catch((err) => {
                        this.setState({
                            isLoading: false,
                        });
                        Toast.show({
                            text: strings("messages.noInternet"),
                            buttonText: "Ok",
                            type: "danger"
                        })
                    })
                });
                this.setState({
                    source: response.uri
                });
            }
        });
    }
    render() {
        return (
            <AppTemplate title={strings("settings.settings")} navigation={this.props.navigation} activeTab="Settings">
                <ImageBackground source={require("./../images/img1.jpg")} style={{ width: "100%", height: 300 }}>
                    <View style={{  width: "100%", height: 300, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.getImage()}
                        >
                            <Thumbnail large source={{uri: this.state.source}} />
                        </TouchableOpacity>
                        <H2 style={{ color: "#FFFFFF" }}>{this.props.user.name}</H2>
                    </View>
                </ImageBackground>
                <Content style={{ marginTop: 20 }}>
                    <List>
                        {
                            routes.map((route) => {
                                return (
                                    <ListItem style={{ marginTop: 10, marginBottom: 10 }}
                                              key={route.name}
                                              onPress={() => this.props.navigation.navigate(route.name)}
                                              icon>
                                        <Left>
                                            <Icon size={25} color="#000000" active name={route.icon} />
                                        </Left>
                                        <Body>
                                        <Text>{route.text}</Text>
                                        </Body>
                                        <Right>
                                            <IonicIcon size={25} name="ios-arrow-forward" />
                                        </Right>
                                    </ListItem>
                                );
                            })
                        }
                        <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                  onPress={() => this.logout()}
                        >
                            <Left>
                                <IonicIcon size={25} color="#000000" active name="ios-log-out" />
                            </Left>
                            <Body>
                            <Text>{strings("settings.logout")}</Text>
                            </Body>
                            <Right>
                                <IonicIcon size={25} name="ios-arrow-forward" />
                            </Right>
                        </ListItem>
                    </List>
                </Content>
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
)(Settings);