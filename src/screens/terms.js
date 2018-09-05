import React from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity, Picker as Picker2, Platform, ScrollView, Text} from 'react-native';
import {Body, CheckBox, ListItem, Picker} from 'native-base';
import countries from './../countries.json';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toast} from "native-base";
import {strings} from "../i18n";

export default class Terms extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params,
            accept: false
        };
    }
    check(){
        if(!this.state.accept){
            Toast.show({
                text: strings('terms.msg'),
                buttonText: "Ok",
                type: "danger"
            })
        }else{
            this.props.navigation.navigate("SignUp1", this.state.data);
        }
    }
    render() {
        return (
            <AuthTemplate next="SignUp1" title={strings('terms.title')} navigation={this.props.navigation} error={this.state.error}>
                <ListItem onPress={() => this.setState({accept: !this.state.accept})}>
                    <CheckBox checked={this.state.accept}/>
                    <Text style={{color: "#FFFFFF", fontSize: 20, marginLeft: 10}}>{strings("terms.accept")}</Text>
                </ListItem>
                <ScrollView>
                    <Text style={{color: "#f2f2f2", fontSize: 17, padding: 20, lineHeight: 25}}>
                        {strings('terms.terms')}
                    </Text>
                </ScrollView>

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
