import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import AuthTemplate from './../components/authTemplate';

export default class SignUp5 extends React.Component {
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
            <AuthTemplate next="Complete" title="Sign Up (Step 5)" navigation={this.props.navigation} error={this.state.error}>

                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="Code of referral......"
                        onChangeText={(referral) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    referral
                                }
                            }))}
                    />
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="How did you know about us......"
                        onChangeText={(how) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    how
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

});