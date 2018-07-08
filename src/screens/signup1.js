import React from 'react';
import { StyleSheet, TextInput, Picker } from 'react-native';
import countries from './../countries.json';
import AuthTemplate from './../components/authTemplate';

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

    render() {
        return (
            <AuthTemplate next="SignUp2" title="Sign Up (Step 1)" navigation={this.props.navigation} error={this.state.error}>
                <Picker
                    selectedValue={this.state.data.country}
                    style={styles.select}
                    itemStyle={{ fontSize:23 }}
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
                <TextInput
                    placeholderTextColor="#d2d2d2"
                    style={styles.input}
                    placeholder="City......"
                    keyboardType='phone-pad'
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
                    placeholder="Phone......"
                    onChangeText={(phone) => this.setState(prevState => (
                        {
                            data: {
                                ...prevState.data,
                                phone
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

});