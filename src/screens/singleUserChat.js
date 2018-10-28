import React, { Component } from 'react';
import { Text, View } from "react-native";
import { Button, Container, Icon, List, ListItem } from "native-base";
import firebaseApp from "./../firebaseDb";
import _ from "lodash";
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {ONESIGNAL_API_KEY, ONESIGNAL_APP_ID, SERVER_URL, STORAGE_URL} from "../config";
import Header from './../components/header'
import OneSignal from "react-native-onesignal";
import axios from "axios";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {strings} from "../i18n";
import I18n from "../i18n";
let firebaseDb= firebaseApp.database();

class SingleChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            message: "",
            logs: [],
            ref: "/private/messages",
            menu: false
        };
    }
    renderBubble (props) {
        return (
            <Bubble
                {...props}
                textStyle={{
                    left: {
                        color: (props.currentMessage.user._id == this.state.user_id) ? "white" : "black",
                    }
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: (props.currentMessage.user._id == this.state.user_id) ? "#0084ff" : "grey",
                        marginTop: 10
                    },
                    left: {
                        backgroundColor: (props.currentMessage.user._id == this.state.user_id) ? "#0084ff" : "#f0f0f0",
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
        firebaseDb.ref(this.state.ref).push(data[0]);
        if(this.state.id != 0){
            // OneSignal.getPermissionSubscriptionState((status) => {
            //     let userId= status.userId;
            // });
            axios.get(SERVER_URL+"api/project/"+this.state.id+"/users").then(response => {
                let devices= _.compact(_.map(response.data, user => user.id !== this.props.user.id && user.device_id));
                return devices;
            }).then(devices => {
                let notification= {
                    app_id: ONESIGNAL_APP_ID,
                    contents: {"en": "New message was sent to " + this.state.title + " group chat"},
                    data: {
                        type : 1,
                    },
                    include_player_ids: devices
                };
                axios.post('https://onesignal.com/api/v1/notifications', notification , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": ONESIGNAL_API_KEY
                    }
                }).then(response => {
                    console.log(response.data.id);
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }
    componentDidMount(){
        firebaseDb.ref('/private/').once('value', snapshot => {
            let data= _.chain(snapshot.val()).map((value, key) => {
                return {...value, key};
            }).filter(chat => {
                return (chat.user_id == this.props.user.id && chat.other_id == this.state.id) || (chat.user_id == this.state.id && chat.other_id == this.props.user.id)
            }).value();
            if(data.length >= 1){
                this.setState({
                    ref: '/private/'+data[0].key+'/messages/'
                }, ()=>{
                    this.fireListener();
                })
            }else{
                // let newChatKey = firebaseDb.ref('private').key;
                let message= firebaseDb.ref('/private/').push({
                    user_id: this.props.user.id,
                    user_name: this.props.user.name,
                    user_img: this.props.user.img,
                    other_id: this.state.id,
                    other_name: this.state.title,
                    other_img: this.state.img,
                }) .then((snap) => {
                    const key = snap.key;
                    this.setState({
                        ref: '/private/'+key+'/messages/'
                    }, ()=>{
                        this.fireListener();
                    })
                })
            }
        });
    }
    fireListener(){
        firebaseDb.ref(this.state.ref).on('value', data => {
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
                <Header toggleMenu={() => this.toggleMenu()} title={this.state.title} navigation={this.props.navigation}>
                    {
                        (I18n.locale === "ar") ?(
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="ios-arrow-forward" style={{color: "#000000", fontSize: 35}}/>
                            </Button>
                        ): (
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="ios-arrow-back" style={{color: "#000000", fontSize: 35}}/>
                            </Button>
                        )
                    }
                </Header>
                {this.state.menu && (
                    <List style={{backgroundColor: "#FFFFFF", right: 0}}>
                        <ListItem style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]} onPress={() => {
                            this.setState({menu: false});
                            this.props.navigation.navigate("Project", {...this.props.navigation.state.params});
                        }}>
                            <Text>{ strings('chat.openProject') }</Text>
                        </ListItem>
                    </List>
                )}
                {this.state.total_amount_invested && (
                    <View style={{backgroundColor: "grey", width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{padding: 10, fontSize: 13}}> { strings('chat.totalCapital') } <Text style={{color: "#FFFFFF"}}> {this.formatMondey(this.state.total_amount_invested, 0, '.', ',')} {this.state.currency}</Text></Text>
                    </View>
                )}
                <GiftedChat
                    messages={_.reverse(this.state.logs)}
                    onSend={data => this.addNewMessage(data)}
                    alwaysShowSend={true}
                    placeholder={strings('chat.placeholder')}
                    isAnimated={true}
                    onPressAvatar={(user) => this.props.navigation.navigate('User', {id: user._id})}
                    showUserAvatar={true}
                    renderBubble={(props) => this.renderBubble(props)}
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