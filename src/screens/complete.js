import React from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from './../config';
import AuthTemplate from './../components/authTemplate';

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
        // return axios.post(this.state.data, 'http://192.168.1.5/'+'api/register').then((response) => {
        //     this.setState({
        //         isLoading: true,
        //         done: false,
        //         error: false,
        //     });
        // }).catch((error) => {
        //     this.setState({
        //
        //     });
        // })
    }
    render() {
        if(this.state.isLoading){
            return (
                <AuthTemplate title="Signing Up..." navigation={this.props.navigation} error={this.state.error}>
                    <ActivityIndicator size="large" color="#344955" />
                    <Text>{ JSON.stringify(this.state.data) }</Text>
                </AuthTemplate>
            );
        }else{
            return (
                <AuthTemplate title="Signing Up..." navigation={this.props.navigation} error={this.state.error}>
                    <ActivityIndicator size="large" color="#344955" />
                    <Text>{ JSON.stringify(this.state.data) }</Text>
                </AuthTemplate>
            );
        }
    }
}

const styles = StyleSheet.create({

});