import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Arrows extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.navigation}>
                <TouchableOpacity
                    style={styles.leftArrow}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Icon name="arrow-circle-left" size={50} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.rightArrow}
                    onPress={() => this.props.navigation.navigate(this.props.next, this.props.data)}
                >
                    <Icon name="arrow-circle-right" size={50} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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