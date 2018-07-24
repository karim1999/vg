import React from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from './../config';
import AuthTemplate from './../components/authTemplate';
import {Button, Toast} from "native-base";

export default class Complete extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params,
            isLoading: true,
            done: false,
            error: false,
        };
    }
    componentDidMount(){
        return axios.post(SERVER_URL+'api/auth/register', this.state.data).then((response) => {
            this.setState({
                isLoading: false,
                done: true,
                error: false,
            });
            Toast.show({
                text: "You hav signed up successfully. Please wait till the admin review your account",
                buttonText: "Ok",
                type: "success",
                duration: 5000
            });
            this.props.navigation.navigate("SignIn");
        }).catch((error) => {
            this.setState({
                isLoading: false,
                done: false,
                error: "An error has occurred.",
            });
            Toast.show({
                text: "Unknown error has occurred. Please try again later.",
                buttonText: "Ok",
                type: "danger",
                duration: 3000
            });
            this.props.navigation.navigate("SignUp5", this.state.data);
        })
    }
    render() {
        if(this.state.isLoading){
            return (
                <AuthTemplate title="Signing Up..." navigation={this.props.navigation} error={this.state.error}>
                    <ActivityIndicator size="large" color="#344955" />
                </AuthTemplate>
            );
        }else{
            return (
                <AuthTemplate title="Signing Up" navigation={this.props.navigation} error={this.state.error}>
                    <Text style={{ fontSize: 25, color: "#FFFFFF" }}>Done</Text>
                </AuthTemplate>
            );
        }
    }
}

const styles = StyleSheet.create({

});