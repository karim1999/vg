import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            <AuthTemplate data={this.state.data} next="Complete" title="Sign Up (Step 5)" navigation={this.props.navigation} error={this.state.error}>

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
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={styles.leftArrow}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon name="arrow-circle-left" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rightArrow}
                        onPress={() => this.props.navigation.navigate("Complete", this.state.data)}
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