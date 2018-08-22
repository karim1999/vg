import React from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity, Picker as Picker2, Platform} from 'react-native';
import { Picker } from 'native-base';
import countries from './../countries.json';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toast} from "native-base";

export default class SignUp1 extends React.Component {
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
        if(this.state.data.country == ""){
            Toast.show({
                text: "Country field is required.",
                buttonText: "Ok",
                type: "danger"
            })
        }else if(this.state.data.city == ""){
            Toast.show({
                text: "City field is required.",
                buttonText: "Ok",
                type: "danger"
            })
        }else if(this.state.data.phone == ""){
            Toast.show({
                text: "phone field is required.",
                buttonText: "Ok",
                type: "danger"
            })
        }else{
            this.props.navigation.navigate("SignUp2", this.state.data);
        }
    }
    render() {
        return (
            <AuthTemplate next="SignUp2" title="Sign Up (Step 1)" navigation={this.props.navigation} error={this.state.error}>
                {
                    (Platform.OS === 'ios') ?
                        <Picker
                            selectedValue={this.state.data.country}
                            style={styles.select}
                            itemStyle={{ fontSize:50 }}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        country: itemValue
                                    }
                                }))
                            }>
                            {countries.data.map((country)=>{ return(<Picker.Item key={country.name} label={country.name} value={country.name} />) })}
                        </Picker>
                        :
                        <Picker2
                            selectedValue={this.state.data.country}
                            style={styles.select2}
                            itemStyle={{ fontSize:50 }}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        country: itemValue
                                    }
                                }))
                            }>
                            {countries.data.map((country)=>{ return(<Picker.Item key={country.name} label={country.name} value={country.name} />) })}
                        </Picker2>
                }

                <TextInput
                    placeholderTextColor="#d2d2d2"
                    style={styles.input}
                    placeholder="City"
                    onChangeText={(city) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                city,
                            }
                        }))}
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#d2d2d2"
                    placeholder="Phone"
                    keyboardType='phone-pad'
                    onChangeText={(phone) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                phone
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
