import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import AuthTemplate from './../components/authTemplate';

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
});