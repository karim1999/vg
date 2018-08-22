import React, { Component } from 'react';
import { Text, View } from "react-native";
import { Button, Container, Icon, List, ListItem } from "native-base";
import firebaseDb from "./../firebaseDb";
import _ from "lodash";
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {ONESIGNAL_API_KEY, ONESIGNAL_APP_ID, SERVER_URL, STORAGE_URL} from "../config";
import Header from './../components/header'
import OneSignal from "react-native-onesignal";
import axios from "axios";
import {connect} from "react-redux";
import {setUser} from "../reducers";

class SingleChat extends Component {
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
        firebaseDb.ref().update(updates);
        if(this.state.id != 0){
            OneSignal.getPermissionSubscriptionState((status) => {
                let userId= status.userId;
            });
            let notification= {
                app_id: ONESIGNAL_APP_ID,
                contents: {"en": "New Message"},
                data: {
                    project: {...this.props.navigation.state.params},
                    type : 1,
                    title : this.state.title+" Chat",
                    body : "A new message was sent.",
                },
                included_segments: ["All"],
                filters: [
                    {[this.state.id]: true}
                ]
            };
            fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ONESIGNAL_API_KEY
                },
                body: JSON.stringify(notification),
            });
        }
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
   formatMondey = function(n, c, d, t){
       c = isNaN(c = Math.abs(c)) ? 2 : c;
       d = d == undefined ? "." : d;
       t = t == undefined ? "," : t;
       let s = n < 0 ? "-" : "";
       let i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
       let j = (j = i.length) > 3 ? j % 3 : 0;
       return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    // componentDidUnMount() {
    //     this.state.ref.off('value');
    // }
    render() {
        return (
            <Container style={{backgroundColor: "#f3f3f3"}}>
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
                {this.state.total_amount_invested && (
                    <View style={{backgroundColor: "grey", width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{padding: 10, fontSize: 13}}>Total capital available in this project: <Text style={{color: "#FFFFFF"}}>{this.formatMondey(this.state.total_amount_invested, 0, '.', ',')}{this.state.currency}</Text></Text>
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
                        _id: this.props.user.id,
                        name: this.props.user.name,
                        avatar: STORAGE_URL+this.props.user.img
                    }}
                />
            </Container>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleChat);