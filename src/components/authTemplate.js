import React from 'react';
import { View, ImageBackground, StyleSheet, Text } from 'react-native';
import Logo from './../components/logo';
import Arrows from './../components/arrows';

export default class authTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params
        };
    }

    render() {

        return (
            <ImageBackground source={require("./../images/background.webp")} style={{width: "100%", height: "100%"}}>
                <View style={styles.container}>
                    <Logo title={this.props.title} error={this.props.error} />
                    { this.props.children }
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
});