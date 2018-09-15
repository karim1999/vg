import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from "../i18n";
import I18n from "../i18n";
import {Toast} from "native-base";

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
    check(){
        let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        let regex = new RegExp(expression);

        if(!this.state.data.facebook.match(regex) && this.state.data.facebook){
            Toast.show({
                text: strings('signup.notLink'),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        }else if(!this.state.data.twitter.match(regex) && this.state.data.twitter){
            Toast.show({
                text: strings('signup.notLink'),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        }else if(!this.state.data.linkedin.match(regex) && this.state.data.linkedin){
            Toast.show({
                text: strings('signup.notLink'),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        }else{
            this.props.navigation.navigate("SignUp4", this.state.data);
        }
    }

    render() {
        return (
            <AuthTemplate next="SignUp4" title={strings("signup.signup3")} navigation={this.props.navigation} error={this.state.error}>

                <TextInput
                    placeholderTextColor="#d2d2d2"
                    style={[styles.input, (I18n.locale === "ar") && styles.rtl]}
                    placeholder={strings('profile.facebook')}
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
                    style={[styles.input, (I18n.locale === "ar") && styles.rtl]}
                    placeholder={strings('profile.twitter')}
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
                    style={[styles.input, (I18n.locale === "ar") && styles.rtl]}
                    placeholder={strings('profile.linkedin')}
                    onChangeText={(linkedin) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                linkedin
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
                        onPress={() => this.check()}
                    >
                        <Icon name="arrow-circle-right" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

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
        height: 60,
        width: "70%",
        fontSize: 20,
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
    },
    rtl: {
        textAlign: "right"
    }

});