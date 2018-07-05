import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import countries from './../countries.json';

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
    signIn= ()=>{
        console.log(this.state.data);
    };

    render() {

        return (
            <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                <View style={styles.container}>
                    <Image source={require("./../images/logo-sm.png")} style={{width: 120, height: 110}} />
                    <Text style={styles.title}>Sign Up (Step 1)</Text>
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
                    <View style={styles.navigation}>
                        <TouchableOpacity
                            style={styles.leftArrow}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Icon name="arrow-circle-left" size={50} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rightArrow}
                            onPress={() => this.props.navigation.navigate('SignUp2', this.state.data)}
                        >
                            <Icon name="arrow-circle-right" size={50} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
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
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: "#FFFFFF",
        marginTop: 20,
        marginBottom: 20,
    },
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
    button: {
        backgroundColor: "#344955",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
        marginTop: 20,
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