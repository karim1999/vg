import React from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity, Platform, Picker as Picker2} from 'react-native';
import {Picker} from 'native-base';

import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from "../i18n";

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
                    placeholder="Code of referral"
                    onChangeText={(referral) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                referral
                            }
                        }))}
                />
                {
                    (Platform.OS === 'ios') ?
                        <Picker
                            selectedValue={this.state.data.type}
                            style={styles.select}
                            placeholder="How did you know about us"
                            itemStyle={{ fontSize:23 }}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        how: itemValue
                                    }
                                }))}>
                            <Picker.Item key="Social-Media" label="Social Media" value="Social Media" />
                            <Picker.Item key="Search-Engines" label="Search Engines" value="Search Engines" />
                            <Picker.Item key="Friend" label="Friend" value="Friend" />
                        </Picker>
                        :
                        <Picker2
                            selectedValue={this.state.data.type}
                            style={styles.select2}
                            itemStyle={{ fontSize:23 }}
                            placeholder="How did you know about us"
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        how: itemValue
                                    }
                                }))}>
                            <Picker.Item key="Social-Media" label="Social Media" value="Social Media" />
                            <Picker.Item key="Search-Engines" label="Search Engines" value="Search Engines" />
                            <Picker.Item key="Friend" label="Friend" value="Friend" />
                        </Picker2>
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
        height: 60,
        width: "70%",
        fontSize: 20,
        color: "#FFFFFF",
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