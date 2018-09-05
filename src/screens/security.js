import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Button, Text, Toast} from 'native-base';
import {ActivityIndicator, AsyncStorage, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios";
import {strings} from "../i18n";
import I18n from "../i18n";

export default class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            password: "",
            confirm: ""
        };
    }
    submit(){

        if(this.state.password){
            if(this.state.password == this.state.confirm){
                this.setState({
                    isLoading: true,
                });
                AsyncStorage.getItem('token').then(userToken => {
                    return axios.post(SERVER_URL+'api/user/password?token='+userToken, {
                        password: this.state.password
                    }).then(response => {
                        Toast.show({
                            text: strings('password.done'),
                            buttonText: strings("messages.ok"),
                            type: "success"
                        });
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error);
                        Toast.show({
                            text: strings("messages.noInternet"),
                            buttonText: strings("messages.ok"),
                            type: "danger"
                        })
                    })
                }).then(() => {
                    this.setState({
                        isLoading: false,
                    });
                });
            }else{
                Toast.show({
                    text: strings('password.confirmMsg'),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }
        }else{
            Toast.show({
                text: strings('password.empty'),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        }
    }
    render() {

        return (
            <AppTemplate title={strings('password.title')} backButton={true} navigation={this.props.navigation} activeTab="Settings">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-key' />
                                    <Label>{ strings('password.password') }</Label>
                                    <Input onChangeText={(password) => this.setState({password})} secureTextEntry={true}
                                           value={this.state.password}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input style={{textAlign: "right"}} onChangeText={(password) => this.setState({password})} secureTextEntry={true}
                                           value={this.state.password}
                                    />
                                    <Label>{ strings('password.password') }</Label>
                                    <Icon name='ios-key' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-key' />
                                    <Label>{ strings('password.confirmPass') }</Label>
                                    <Input onChangeText={(confirm) => this.setState({confirm})} secureTextEntry={true}
                                           value={this.state.confirm}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input style={{textAlign: "right"}} onChangeText={(confirm) => this.setState({confirm})} secureTextEntry={true}
                                           value={this.state.confirm}
                                    />
                                    <Label>{ strings('password.confirmPass') }</Label>
                                    <Icon name='ios-key' />
                                </Item>
                            )
                        }
                        <Button
                            onPress={() => this.submit()}
                            style={{flexDirection: "row"}}
                            block light>
                            <Text>{ strings('password.change') }</Text>
                            {this.state.isLoading && (
                                <ActivityIndicator style={{}} size="small" color="#000000" />
                            )}
                        </Button>
                    </Form>
                </View>
            </AppTemplate>
        );
    }
}