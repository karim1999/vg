import React from 'react';
import {StyleSheet, TextInput, Picker as Picker2, Slider, Text, View, TouchableOpacity, Platform} from 'react-native';
import {Picker} from 'native-base';
import AuthTemplate from './../components/authTemplate';
import NumericInput from 'react-native-numeric-input'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toast} from "native-base";

export default class SignUp4 extends React.Component {
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
        if(this.state.data.amount == ""){
            Toast.show({
                text: "The amount field is required.",
                buttonText: "Ok",
                type: "danger"
            })
        }else{
            this.props.navigation.navigate("SignUp5", this.state.data);
        }
    }

    render() {
        return (
            <AuthTemplate next="SignUp5" title="Sign Up (Step 4)" navigation={this.props.navigation} error={this.state.error}>
                <View style={{flexDirection: "row", width: "70%", marginBottom: 20}}>
                    <Text style={{color: "white", fontSize: 22, textAlign: "left", alignSelf: "center", flex: 1}}>Money: </Text>
                    <NumericInput
                        type='up-down'
                        style={{marginTop: 20, justifySelf: "center", alignSelf: "center" }}
                        onChange={amount => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    amount
                                }
                            })
                        )}
                        minValue={50000}
                        maxValue={1000000000}
                        totalWidth={120}
                        totalHeight={45}
                        iconSize={20}
                        step={50000}
                        value={this.state.data.amount}
                        valueType='real'
                        rounded
                        textColor='#FFFFFF'
                        iconStyle={{ color: 'white' }}
                        borderColor='#344955'
                        rightButtonBackgroundColor='#344955'
                        leftButtonBackgroundColor='#344955'
                        upDownButtonsBackgroundColor='#344955'/>
                </View>
                {
                    (Platform.OS === 'ios') ?
                        <Picker
                            selectedValue={this.state.data.type}
                            style={styles.select}
                            itemStyle={{ fontSize:23 }}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        type: itemValue
                                    }
                                }))}>
                            <Picker.Item key={0} label="Prefered investment type" value={0} />
                            <Picker.Item key="Short-term" label="Short-term" value="Short-term" />
                            <Picker.Item key="Mid-term" label="Mid-term" value="Mid-term" />
                            <Picker.Item key="Long-term" label="Long-term" value="Long-term" />
                        </Picker>
                        :
                        <Picker2
                            selectedValue={this.state.data.type}
                            style={styles.select2}
                            itemStyle={{ fontSize:23 }}
                            onValueChange={(itemValue, itemIndex) => this.setState(prevState => (
                                {
                                    data: {
                                        ...prevState.data,
                                        type: itemValue
                                    }
                                }))}>
                            <Picker.Item key={0} label="Prefered investment type" value={0} />
                            <Picker.Item key="Short-term" label="Short-term" value="Short-term" />
                            <Picker.Item key="Mid-term" label="Mid-term" value="Mid-term" />
                            <Picker.Item key="Long-term" label="Long-term" value="Long-term" />
                        </Picker2>
                }
                <TextInput
                    style={styles.textarea}
                    placeholderTextColor="#d2d2d2"
                    placeholder="Write about your project"
                    multiline = {true}
                    numberOfLines = {4}
                    onChangeText={(idea) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                idea
                            }
                        })
                    )}
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
    textarea: {
        height: 70,
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
    }

});