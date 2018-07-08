import React from 'react';
import { StyleSheet, TextInput, Picker, Slider, Text } from 'react-native';
import AuthTemplate from './../components/authTemplate';
import NumericInput from 'react-native-numeric-input'

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
    render() {
        return (
            <AuthTemplate next="SignUp5" title="Sign Up (Step 4)" navigation={this.props.navigation} error={this.state.error}>
                <NumericInput
                    style={{ marginBottom: 20 }}
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
                    totalWidth={240}
                    totalHeight={50}
                    iconSize={25}
                    step={50000}
                    valueType='real'
                    rounded
                    textColor='#FFFFFF'
                    iconStyle={{ color: 'white' }}
                    rightButtonBackgroundColor='#344955'
                    leftButtonBackgroundColor='#344955'/>
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
                    <Picker.Item key="Short-term" label="Short-term" value="Short-term" />
                    <Picker.Item key="Mid-term" label="Mid-term" value="Mid-term" />
                    <Picker.Item key="Long-term" label="Long-term" value="Long-term" />
                </Picker>
                <TextInput
                    style={styles.textarea}
                    placeholderTextColor="#d2d2d2"
                    placeholder="Write about your project.."
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
    select: {
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
        fontSize: 23,
        color: "#FFFFFF",
    },

});