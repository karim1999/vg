import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    signIn= ()=>{
        console.log("signin...");
    };

    render() {
        return (
            <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                <View style={styles.container}>
                    <Image source={require("./../images/logo-sm.png")} style={{width: 120, height: 110}} />
                    <Text style={styles.title}>Sign Up (Step 5)</Text>
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="Code of referral......"
                        onChangeText={(referral) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    referral
                                }
                            }))}
                    />
                    <TextInput
                        placeholderTextColor="#d2d2d2"
                        style={styles.input}
                        placeholder="How did you know about us......"
                        onChangeText={(how) => this.setState(prevState => (
                            {
                                data: {
                                    ...prevState.data,
                                    how
                                }
                            }))}
                    />

                    <View style={styles.navigation}>
                        <TouchableOpacity
                            style={styles.leftArrow}
                            onPress={() => this.props.navigation.navigate('SignUp4', this.state.data)}
                        >
                            <Icon name="arrow-circle-left" size={50} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rightArrow}
                            onPress={() => this.props.navigation.navigate('Complete', this.state.data)}
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
    textarea: {
        height: 150,
        width: "70%",
        fontSize: 23,
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