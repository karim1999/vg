import React, { Component } from 'react';
import {ListItem, List, Left, Thumbnail, Body, Text, Right} from 'native-base';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";
import {TouchableOpacity} from "react-native";

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
                <Transition appear="horizontal" disappear="horizontal">
                    <List>
                        {/*<ListItem itemDivider style={{justifyContent: "center", alignItems: "center", backgroundColor: "#D0D0D0", marginBottom: 10 }}>*/}
                        {/*</ListItem>*/}
                        <TouchableOpacity style={{backgroundColor: "#FFFFFF", marginBottom: 10}}>
                            <ListItem avatar>
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
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: "#FFFFFF", marginBottom: 10}}>
                            <ListItem avatar>
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
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: "#FFFFFF", marginBottom: 10}}>
                            <ListItem avatar>
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
                        </TouchableOpacity>
                    </List>
                </Transition>
            </AppTemplate>
        );
    }
}