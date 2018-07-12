import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Image, View} from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import {SERVER_URL} from "../config";

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params
        };
    }
    render() {

        return (
            <AppTemplate title={this.state.title} backButton={true} navigation={this.props.navigation} activeTab="Home">
                <View style={{padding: 20}}>
                    <Card style={{flex: 0}}>
                        <CardItem style={{ paddingBottom: 5 }}>
                            <Left>
                                <Thumbnail source={{uri: SERVER_URL+"storage/"+this.state.user_img}} />
                                <Body>
                                <Text>{this.state.user_name}</Text>
                                <Text note>{this.state.created_at}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem style={{ paddingTop: 0 }}>
                            <Body>
                            <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>
                                {this.state.title}
                                </Text>
                            <Text style={{ fontSize: 15, marginBottom: 10 }}>
                                {this.state.description}
                                </Text>
                            <Image source={{uri: SERVER_URL+"storage/"+this.state.img}} style={{height: 250, width: "100%", flex: 1}}/>
                            <Text style={{ fontSize: 20, marginTop: 10 }}>
                                Total Money Needed: {this.state.amount}
                            </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{color: '#87838B'}}>
                                    <Icon name="logo-github" />
                                    <Text>1,926 stars</Text>
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
                </View>
            </AppTemplate>
        );
    }
}