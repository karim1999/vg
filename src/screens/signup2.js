import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SignUp2 extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params
        };
    }

    render() {
        return (
            <AuthTemplate next="SignUp3" title="Sign Up (Step 2)" navigation={this.props.navigation} error={this.state.error}>

                <TextInput
                    placeholderTextColor="#d2d2d2"
                    style={styles.input}
                    placeholder="Name......"
                    textContentType="name"
                    onChangeText={(name) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                name
                            }
                        }))}
                />
                <TextInput
                    placeholderTextColor="#d2d2d2"
                    style={styles.input}
                    placeholder="Email......"
                    textContentType="emailAddress"
                    keyboardType='email-address'
                    onChangeText={(email) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                email
                            }
                        }))}
                />
                <TextInput
                    placeholderTextColor="#d2d2d2"
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password......"
                    onChangeText={(password) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                password
                            }
                        }))}
                />

                <TextInput
                    style={styles.textarea}
                    placeholderTextColor="#d2d2d2"
                    placeholder="Write something about yourself......"
                    multiline = {true}
                    numberOfLines = {4}
                    onChangeText={(description) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                description
                            }
                        }))}
                />
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={styles.leftArrow}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon name="arrow-circle-left" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rightArrow}
                        onPress={() => this.props.navigation.navigate("SignUp3", this.state.data)}
                    >
                        <Icon name="arrow-circle-right" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

            </AuthTemplate>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 70,
        width: "70%",
        fontSize: 23,
        color: "#FFFFFF",
    },
    textarea: {
        height: 70,
        width: "70%",
        fontSize: 23,
        color: "#FFFFFF",
    },
    navigation: {
        width: "75%",
        flexDirection: 'row',
        marginTop: 30
    },
    rightArrow:{
        width: "50%",
        alignItems: 'flex-end',
        marginTop: 20,
    },
    leftArrow:{
        width: "50%",
        alignItems: 'flex-start',
        marginTop: 20,
    }

});