import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
let data= {
    country: '',
    city: '',
    phone: '',
    name: 'afdsad',
    email: '',
    description: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    amount: '',
    idea: '',
    type: '',
    referral: '',
    how: ''
};
export default class SignIn extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }
    signIn= ()=>{
        console.log("signin...");
    };

    render() {
        return (
            <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                <View style={styles.container}>
                    <Image source={require("./../images/logo-sm.png")} style={{width: 120, height: 110}} />
                    <Text style={styles.title}>{this.state.test}</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#d2d2d2"
                        placeholder="Username......"
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
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: "#FFFFFF",
        marginTop: 20,
        marginBottom: 20,
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