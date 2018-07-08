import React, { Component } from 'react';
import {Icon, Content, ListItem, Left, Button, Body, Text, Right, Switch, Thumbnail} from 'native-base';
import { View } from 'react-native';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "key1"
        };
    }
    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }
    render() {

        return (
            <AppTemplate title="Settings" navigation={this.props.navigation} activeTab="Settings">
                <Transition appear="horizontal" disappear="horizontal">
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <Thumbnail source={require("./../images/profile.png")} style={{width: 200, height: 200}} />
                    </View>
                </Transition>
            </AppTemplate>
        );
    }
}