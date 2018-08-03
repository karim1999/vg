import React from 'react';
import {View, ImageBackground, StyleSheet, Text, Platform} from 'react-native';
import { Content } from 'native-base';
import Logo from './../components/logo';

export default class authTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params
        };
    }

    render() {

        return (
            <ImageBackground source={require("./../images/background.png")} style={{width: "100%", height: "100%"}}>
                {
                    (Platform.OS === 'ios') ?
                        <Content contentContainerStyle={{ flex: 1 }} style={{width: "100%"}}>
                            <View style={styles.container}>
                                <Logo title={this.props.title} error={this.props.error} />
                                { this.props.children }
                            </View>
                        </Content>
                        :
                        <View style={styles.container}>
                            <Logo title={this.props.title} error={this.props.error} />
                            { this.props.children }
                        </View>
                }

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