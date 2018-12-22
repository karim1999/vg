import React from 'react';
import {ActivityIndicator, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { SERVER_URL } from './../config';
import AuthTemplate from './../components/authTemplate';
import {Button, Toast} from "native-base";
import {strings} from "../i18n";
import I18n from "../i18n";

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
                text: (this.state.data.visit == 2)? strings("signup.finalYes") : strings("signup.finalNo"),
                buttonText: "Ok",
                type: "success",
                duration: 20000
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
            this.props.navigation.navigate("SignUp3", this.state.data);
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
                    {/*<Text style={{ fontSize: 25, color: "#FFFFFF" }}>{(this.state.data.visit == 1)? strings("signup.finalYes") : strings("signup.finalNo")}</Text>*/}
                    {/*<TouchableOpacity*/}
                        {/*style={[styles.button, {flexDirection: "row"}]}*/}
                        {/*onPress={() => this.props.navigation.navigate("SignIn")}*/}
                    {/*>*/}
                        {/*<Text style={{color: "#FFFFFF", fontSize: 20}}> {strings("login.login_button")} </Text>*/}
                        {/*{this.state.isLoading && (*/}
                            {/*<ActivityIndicator style={{}} size="small" color="#FFFFFF" />*/}
                        {/*)}*/}
                    {/*</TouchableOpacity>*/}

                </AuthTemplate>
            );
        }
    }
}

const styles = StyleSheet.create({

});