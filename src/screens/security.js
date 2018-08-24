import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Button, Text, Toast} from 'native-base';
import {ActivityIndicator, AsyncStorage, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios";

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
                            text: "Your Password has been edited successfully.",
                            buttonText: "Ok",
                            type: "success"
                        });
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error);
                        Toast.show({
                            text: "Error reaching the server.",
                            buttonText: "Ok",
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
                    text: "the confirmation password should be the same as the password.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }
        }else{
            Toast.show({
                text: "the password cannot be empty.",
                buttonText: "Ok",
                type: "danger"
            })
        }
    }
    render() {

        return (
            <AppTemplate title="Edit Password" backButton={true} navigation={this.props.navigation} activeTab="Settings">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        <Item style={{height: 70}}>
                            <Icon name='ios-key' />
                            <Label>Password:</Label>
                            <Input onChangeText={(password) => this.setState({password})} secureTextEntry={true}
                                   value={this.state.password}
                            />
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon name='ios-key' />
                            <Label>Confirm Password:</Label>
                            <Input onChangeText={(confirm) => this.setState({confirm})} secureTextEntry={true}
                                   value={this.state.confirm}
                            />
                        </Item>
                        <Button
                            onPress={() => this.submit()}
                            style={{flexDirection: "row"}}
                            block light>
                            <Text>Change</Text>
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