import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class Logo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
                <View style={styles.container}>
                    <Image source={require("../images/logo-sm.png")} style={{width: 120, height: 110}} />
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
});