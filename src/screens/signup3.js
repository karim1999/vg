import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Picker as Picker2, Platform } from 'react-native';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from "../i18n";
import I18n from "../i18n";
import {Toast, Picker, Text} from "native-base";

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
                {
                    (Platform.OS === 'ios') ?
                        <Picker
                            selectedValue={this.state.data.visit}
                            style={styles.select}
                            itemStyle={{ fontSize:23 }}
                            placeholder={strings('signup.q1')}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        visit: itemValue
                                    }
                                }))}>
                            <Picker.Item key={0} label={strings('signup.q1')} value={0} />
                            <Picker.Item key={1} label={strings('signup.no')} value={1} />
                            <Picker.Item key={2} label={strings('signup.yes')} value={2} />
                        </Picker>
                        :
                        <Picker2
                            selectedValue={this.state.data.visit}
                            style={styles.select2}
                            placeholder={strings('signup.q1')}
                            itemStyle={{ fontSize:23 }}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        visit: itemValue
                                    }
                                }))}>
                            <Picker.Item key={0} label={strings('signup.q1')} value={0} />
                            <Picker.Item key={1} label={strings('signup.no')} value={1} />
                            <Picker.Item key={2} label={strings('signup.yes')} value={2} />
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