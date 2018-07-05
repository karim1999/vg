import React from 'react';
import { ActivityIndicator, View, Text, ImageBackground, Image, StyleSheet, TextInput, TouchableOpacity, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
// import SERVER_URL from './../config';

export default class Complete extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params,
            isLoading: true,
            done: false,
            error: false,
        };
    }
    componentDidMount(){
        // return axios.post(this.state.data, 'http://192.168.1.5/'+'api/register').then((response) => {
        //     this.setState({
        //         isLoading: true,
        //         done: false,
        //         error: false,
        //     });
        // }).catch((error) => {
        //     this.setState({
        //
        //     });
        // })
    }
    render() {
        if(this.state.isLoading){
            return (
                <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                    <View style={styles.container}>
                        <Image source={require("./../images/logo-sm.png")} style={{width: 120, height: 110}} />
                        <Text style={styles.title}>Signing Up....</Text>
                        <ActivityIndicator size="large" color="#344955" />
                    </View>
                </ImageBackground>
            );
        }else{
            return (
                <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                    <View style={styles.container}>
                        <Image source={require("./../images/logo-sm.png")} style={{width: 120, height: 110}} />

                    </View>
                </ImageBackground>
            );
        }
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