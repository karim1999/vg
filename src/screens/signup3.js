import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Picker as Picker2, Platform } from 'react-native';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from "../i18n";
import I18n from "../i18n";
import {Toast, Picker, Text, ListItem, Left, Right, Radio} from "native-base";

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
        if(this.state.data.visit == 0){
            Toast.show({
                text: strings('signup.fieldRequired', {field: "The question"}),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        }else{
            this.props.navigation.navigate("Complete", this.state.data);
        }
    }

    render() {
        return (
            <AuthTemplate next="SignUp4" title={strings("signup.signup3")} navigation={this.props.navigation} error={this.state.error}>
                <Text style={{color: "#fff", width: "80%", fontSize: 19}}>{strings("signup.q1")}</Text>
                {
                    (I18n.locale !== "ar") ? (
                        <ListItem
                            style={{width: "80%"}}
                            onPress={() => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        visit: 1
                                    }
                                }))}
                        >
                            <Left>
                                <Text style={{color: "#fff"}}>{strings("signup.no")}</Text>
                            </Left>
                            <Right>
                                <Radio
                                    color="#fff"
                                    selected={this.state.data.visit === 1}
                                       onPress={() => this.setState(prevState => (
                                           {
                                               data: {
                                                   ...prevState.data,
                                                   visit: 1
                                               }
                                           }))}
                                />
                            </Right>
                        </ListItem>
                    ) : (
                        <ListItem
                            style={{width: "80%"}}
                            onPress={() => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        visit: 1
                                    }
                                }))}
                        >
                            <Left>
                                <Radio selected={this.state.data.visit === 1}
                                       color="#fff"
                                       onPress={() => this.setState(prevState => (
                                           {
                                               data: {
                                                   ...prevState.data,
                                                   visit: 1
                                               }
                                           }))}
                                />
                            </Left>
                            <Right>
                                <Text style={{color: "#fff"}}>{strings("signup.no")}</Text>
                            </Right>
                        </ListItem>
                    )
                }
                {
                    (I18n.locale !== "ar") ? (
                        <ListItem
                            style={{width: "80%"}}
                            onPress={() => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        visit: 2
                                    }
                                }))}
                        >
                            <Left>
                                <Text style={{color: "#fff"}}>{strings("signup.yes")}</Text>
                            </Left>
                            <Right>
                                <Radio selected={this.state.data.visit === 2}
                                       color="#fff"
                                       onPress={() => this.setState(prevState => (
                                           {
                                               data: {
                                                   ...prevState.data,
                                                   visit: 2
                                               }
                                           }))}
                                />
                            </Right>
                        </ListItem>
                    ) : (
                        <ListItem
                            style={{width: "80%"}}
                            onPress={() => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        visit: 2
                                    }
                                }))}
                        >
                            <Left>
                                <Radio selected={this.state.data.visit === 2}
                                       color="#fff"
                                       onPress={() => this.setState(prevState => (
                                           {
                                               data: {
                                                   ...prevState.data,
                                                   visit: 2
                                               }
                                           }))}
                                />
                            </Left>
                            <Right>
                                <Text style={{color: "#fff"}}>{strings("signup.yes")}</Text>
                            </Right>
                        </ListItem>
                    )
                }
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
    select: {
        height: 50,
        width: "100%",

        color: "#FFFFFF",
    },
    select2: {
        height: 50,
        width: "70%",
        transform: [
            { scaleY: 1.3 },
            { scaleX: 1.3 },
        ],
        marginLeft: "17%",
        color: "#FFFFFF",
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