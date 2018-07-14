import React, { Component } from 'react';
import { Text, View } from "react-native";
import { Button, Container, Icon, List, ListItem } from "native-base";
import firebaseDb from "./../firebaseDb";
import _ from "lodash";
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {SERVER_URL} from "../config";
import Header from './../components/header'

export default class SingleChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            message: "",
            logs: [],
            ref: firebaseDb.ref('/chat/' + this.props.navigation.state.params.id),
            menu: false
        };
    }
    renderBubble (props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "grey",
                        marginTop: 10
                    },
                    left: {
                        marginTop: 10
                    }
                }}
            />
        )
    }
    toggleMenu() {
        this.setState({
            menu: !this.state.menu
        })
    }
    addNewMessage(data){
        let newPostKey = firebaseDb.ref('/chat/').child(this.state.id).push().key;
        let updates = {};
        updates['/chat/'+this.state.id+'/' + newPostKey] = data[0];
        return firebaseDb.ref().update(updates);
    }
    componentDidMount(){
        this.state.ref.once('value').then(data => {
            this.setState({
                logs: _.values(data.val())
            })
        });
        this.state.ref.on('value', data => {
            this.setState({
                logs: _.values(data.val())
            })
        });
    }
    // componentDidUnMount() {
    //     this.state.ref.off('value');
    // }
    render() {
        return (
            <Container style={{backgroundColor: "#FDF5F5"}}>
                <Header toggleMenu={() => this.toggleMenu()} title={this.state.title} navigation={this.props.navigation} right={this.state.id != 0}>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name="ios-arrow-back" style={{color: "#000000", fontSize: 35}}/>
                    </Button>
                </Header>
                {this.state.menu && (
                    <List style={{backgroundColor: "#FFFFFF", right: 0}}>
                        <ListItem onPress={() => {
                            this.setState({menu: false});
                            this.props.navigation.navigate("Project", {...this.props.navigation.state.params});
                        }}>
                            <Text>Open Project</Text>
                        </ListItem>
                    </List>
                )}
                {this.state.amount && (
                    <View style={{backgroundColor: "grey", width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{padding: 10, fontSize: 15}}>Total investments in this project: <Text style={{color: "#FFFFFF"}}>{this.state.amount}$</Text></Text>
                    </View>
                )}
                <GiftedChat
                    messages={_.reverse(this.state.logs)}
                    onSend={data => this.addNewMessage(data)}
                    alwaysShowSend={true}
                    isAnimated={true}
                    showUserAvatar={true}
                    renderBubble={this.renderBubble}
                    user={{
                        _id: this.state.user_id,
                        name: this.state.user_name,
                        avatar: SERVER_URL+"storage/"+this.state.user_img
                    }}
                />
            </Container>
        );
    }
}