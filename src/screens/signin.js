import React from 'react';
import { connect } from 'react-redux';
import { setUser } from './../reducers';
import axios from 'axios';
import { SERVER_URL } from './../config';
import {
    View,
    Text,
    ImageBackground,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';
import { Container, Header, Content, Button, Toast } from "native-base";
import Logo from './../components/logo';

let data= {
    country: 'Saudi Arabia',
    city: '',
    phone: '',
    name: '',
    email: '',
    password: '',
    description: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    amount: 50000,
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
            isLoading: false,
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
            this.setState({
                isLoading: true
            });
            return axios.post(SERVER_URL+"api/auth/login", {
                email: this.state.username,
                password: this.state.password
            }).then((response)=>{

                if(response.data.user.active == 1){
                    this.setState({
                        token: response.data.access_token
                    });
                    this.props.setUser(response.data.user, response.data.access_token);
                    let item= this.storeItem('token', response.data.access_token);
                    Toast.show({
                        text: "You have signed in successfully.",
                        buttonText: "Ok",
                        type: "success",
                        duration: 5000
                    });
                    this.props.navigation.navigate('App');
                }else{
                    Toast.show({
                        text: "Your account has not been activated yet.",
                        buttonText: "Ok",
                        type: "danger",
                        duration: 5000
                    })
                }
                this.setState({
                    isLoading: false
                });
            }).catch((error)=>{
                Toast.show({
                    text: "Wrong username or password",
                    buttonText: "Ok",
                    type: "danger",
                    duration: 5000
                });
                this.setState({
                    isLoading: false
                });
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
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
    componentDidMount(){
      // fetch('http://talbatk.net:90/api/all-offers').then(response => {
      //   alert(JSON.stringify(response.response));
      // }).catch(error => {
      //   alert(error);
      // })
    }
    render() {
        return (
            <ImageBackground source={require("./../images/background.png")} style={{width: "100%", height: "100%"}}>
                <View style={styles.container}>
                    <Logo title="" error={this.props.error} />

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#d2d2d2"
                        placeholder="Email"
                        keyboardType='email-address'
                        onChangeText={(username) => this.setState({username})}
                    />
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={(password) => this.setState({password})}
                    />
                    {/*<View style={{width: "70%"}}>*/}

                        {/*<Text style={{color: "#FFFFFF", fontSize: 20, textAlign: 'left'}}> Forgot your password? </Text>*/}
                    {/*</View>*/}

                    <TouchableOpacity
                        style={[styles.button, {flexDirection: "row"}]}
                        onPress={this.signIn}
                    >
                        <Text style={{color: "#FFFFFF", fontSize: 20}}> Sign In </Text>
                        {this.state.isLoading && (
                            <ActivityIndicator style={{}} size="small" color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                    <Text style={{color: "#FFFFFF", fontSize: 20, marginTop: 10}}> OR </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Terms', data)}
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
        height: 60,
        width: "70%",
        fontSize: 20,
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
