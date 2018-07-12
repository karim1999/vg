import React, { Component } from 'react';
import {ListItem, List, Left, Thumbnail, Body, Text, Right} from 'native-base';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";
import {View} from "react-native";

export default class Chat extends Component {
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
            <AppTemplate title="Messages" navigation={this.props.navigation} activeTab="Chat">
                <View style={{padding: 20}}>
                    <Transition appear="horizontal" disappear="horizontal">
                        <List>
                            <ListItem avatar
                                      onPress={() => this.props.navigation.navigate("SingleChat", {title: "Chat1"})}
                                      style={{backgroundColor: "#FFFFFF", marginBottom: 10}}
                            >
                                <Left>
                                    <Thumbnail source={require("./../images/profile.jpg")} />
                                </Left>
                                <Body>
                                <Text>Kumar Pratik</Text>
                                <Text note>Doing what you like will always keep you happy . .</Text>
                                </Body>
                                <Right>
                                    <Text note>3:43 pm</Text>
                                </Right>
                            </ListItem>

                            <ListItem avatar
                                      onPress={() => this.props.navigation.navigate("SingleChat", {title: "Chat2"})}
                                      style={{backgroundColor: "#FFFFFF", marginBottom: 10}}
                            >
                                <Left>
                                    <Thumbnail source={require("./../images/profile.jpg")} />
                                </Left>
                                <Body>
                                <Text>Kumar Pratik</Text>
                                <Text note>Doing what you like will always keep you happy . .</Text>
                                </Body>
                                <Right>
                                    <Text note>3:43 pm</Text>
                                </Right>
                            </ListItem>
                            <ListItem avatar
                                      style={{backgroundColor: "#FFFFFF", marginBottom: 10}}
                                      onPress={() => this.props.navigation.navigate("SingleChat", {title: "Chat3"})}
                            >
                                <Left>
                                    <Thumbnail source={require("./../images/profile.jpg")} />
                                </Left>
                                <Body>
                                <Text>Kumar Pratik</Text>
                                <Text note>Doing what you like will always keep you happy . .</Text>
                                </Body>
                                <Right>
                                    <Text note>3:43 pm</Text>
                                </Right>
                            </ListItem>
                        </List>
                    </Transition>
                </View>
            </AppTemplate>
        );
    }
}