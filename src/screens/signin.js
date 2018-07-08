import React from 'react';
import { connect } from 'react-redux';
import { setUser } from './../reducers';
import axios from 'axios';
import { SERVER_URL } from './../config';
import { View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { Container, Header, Content, Button, Toast } from "native-base";
import Logo from './../components/logo';

let data= {
    country: '',
    city: '',
    phone: '',
    name: '',
    email: '',
    description: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    amount: 0,
    idea: '',
    type: '',
    referral: '',
    how: ''
};
class SignIn extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showToast: false,
            token: ""
        };
    }
    signIn= ()=>{
        let type= "default";
        let text= "Unknown error";
        if(this.state.username == "" || this.state.password == ""){
            text= "Username and password cannot be empty";
            type= "danger";
            Toast.show({
                text: text,
                buttonText: "Ok",
                type: type
            })
        }else{
            return axios.post(SERVER_URL+"api/auth/login", {
                email: this.state.username,
                password: this.state.password
            }).then((response)=>{

                this.setState({
                    token: response.data.access_token
                });
                this.props.setUser(response.data.user, response.data.access_token);
                let item= this.storeItem('token', response.data.access_token);
                Toast.show({
                    text: "You have signed in successfully.",
                    buttonText: "Ok",
                    type: "success"
                });
                this.props.navigation.navigate('App');
            }).catch((error)=>{
                Toast.show({
                    text: "Wrong username or password",
                    buttonText: "Ok",
                    type: "danger"
                })
            })
        }
    };
    async storeItem(key, item) {
        try {
            let jsonOfItem = await AsyncStorage.setItem(key, item);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
    render() {
        return (
            <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                <View style={styles.container}>
                    <Logo title="SignIn" error={this.props.error} />

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#d2d2d2"
                        placeholder="Email......"
                        keyboardType='email-address'
                        onChangeText={(username) => this.setState({username})}
                    />
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder="Password......"
                        onChangeText={(password) => this.setState({password})}
                    />
                    <View style={{width: "70%"}}>

                        <Text style={{color: "#FFFFFF", fontSize: 20, textAlign: 'left'}}> Forgot your password? </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.signIn}
                    >
                        <Text style={{color: "#FFFFFF", fontSize: 20}}> Sign In </Text>
                    </TouchableOpacity>
                    <Text style={{color: "#FFFFFF", fontSize: 20, marginTop: 10}}> OR </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('SignUp1', data)}
                        style={styles.button}
                    >
                        <Text style={{color: "#FFFFFF", fontSize: 20}}> Sign Up </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: 'center',
    },
    input: {
        height: 70,
        width: "70%",
        fontSize: 23,
        color: "#FFFFFF",
    },
    button: {
        backgroundColor: "#344955",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
        marginTop: 20,
    },

});
const mapStateToProps = ({ user }) => ({
    user,
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);