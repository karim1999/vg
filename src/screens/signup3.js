import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import AuthTemplate from './../components/authTemplate';

export default class SignUp3 extends React.Component {
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
            <AuthTemplate next="SignUp4" title="Sign Up (Step 3)" navigation={this.props.navigation} error={this.state.error}>

                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="Facebook......"
                        onChangeText={(facebook) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    facebook
                                }
                            }))}
                    />
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="Twitter......"
                        onChangeText={(twitter) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    twitter
                                }
                            }))}
                    />
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="Linkedin......"
                        onChangeText={(linkedin) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    linkedin
                                }
                            }))}
                    />
            </AuthTemplate>
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
});