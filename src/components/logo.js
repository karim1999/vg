import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class Logo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
                <View style={styles.container}>
                    <Image source={require("../images/logo-edited.png")} style={{width: 120, height: 130}} />
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
        fontSize: 27,
        textAlign: 'center',
        color: "#FFFFFF",
        marginTop: 20,
        marginBottom: 20,
    },
});