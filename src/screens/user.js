import React from "react";
import {View, ImageBackground, AsyncStorage, TouchableOpacity} from "react-native";
import {Container, Content, Text, List, ListItem, Left, Body, Right, Icon, Thumbnail, H2, Toast} from "native-base";
import {SERVER_URL, STORAGE_URL} from "../config";
import AppTemplate from './../components/appTemplate';
import ImagePicker from 'react-native-image-picker';
import axios from "axios";
import { strings } from '../i18n';
import I18n from "../i18n";
import _ from 'lodash';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            id: this.props.navigation.state.params.id,
            user: []
        };
    }
    componentDidMount(){
        return axios.get(SERVER_URL+'api/users/'+this.state.id).then(response => {
            this.setState({
                user: response.data
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
            <AppTemplate backButton title={strings("settings.user")} navigation={this.props.navigation} activeTab="Settings">
                <ImageBackground source={require("./../images/background.png")} style={{ width: "100%", height: 300 }}>
                    <View style={{  width: "100%", height: 300, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.getImage()}
                        >
                            <Thumbnail large source={{uri: STORAGE_URL+this.state.user.img}} />
                        </TouchableOpacity>
                        <H2 style={{ color: "#FFFFFF" }}>{this.state.user.name}</H2>
                    </View>
                </ImageBackground>
                <Content style={{ padding: 20, backgroundColor: "white" }}>
                    <List>
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="user" />
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.name")}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{this.state.user.name}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Text>{this.state.user.name}</Text>
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.name")}</Text>
                                    </Body>
                                    <Right>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="user" />
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="envelope" />
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.email")}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{_.truncate(this.state.user.email)}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Text>{_.truncate(this.state.user.email)}</Text>
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.email")}</Text>
                                    </Body>
                                    <Right>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="envelope" />
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="globe" />
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.country")}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{this.state.user.country}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Text>{this.state.user.country}</Text>
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.country")}</Text>
                                    </Body>
                                    <Right>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="globe" />
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="address-book" />
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.city")}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{this.state.user.city}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Text>{this.state.user.city}</Text>
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.city")}</Text>
                                    </Body>
                                    <Right>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="address-book" />
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="phone" />
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.phone")}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{this.state.user.phone}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Text>{this.state.user.phone}</Text>
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.phone")}</Text>
                                    </Body>
                                    <Right>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="phone" />
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="money" />
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.wallet")}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{this.state.user.money}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                >
                                    <Left>
                                        <Text>{this.state.user.money}</Text>
                                    </Left>
                                    <Body>
                                    <Text>{strings("profile.wallet")}</Text>
                                    </Body>
                                    <Right>
                                        <Icon type="FontAwesome" size={25} color="#000000" active name="money" />
                                    </Right>
                                </ListItem>
                            )
                        }
                    </List>
                </Content>
            </AppTemplate>
        );
    }
}
