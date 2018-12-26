import React, { Component } from 'react';
import {Linking, Text, View} from "react-native";
import {ActionSheet, Button, Container, Icon, List, ListItem, Toast} from "native-base";
import firebaseApp from "./../firebaseDb";
import _ from "lodash";
import {Bubble, GiftedChat, Actions, MessageImage, MessageText} from 'react-native-gifted-chat';
import {ONESIGNAL_API_KEY, ONESIGNAL_APP_ID, SERVER_URL, STORAGE_URL} from "../config";
import Header from './../components/header'
import OneSignal from "react-native-onesignal";
import axios from "axios";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {strings} from "../i18n";
import I18n from "../i18n";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from "react-native-image-picker";
import AudioRecord from 'react-native-audio-record';
import Permissions from 'react-native-permissions';
import AudioPlayer from "./../components/audioPlayer";

let firebaseDb= firebaseApp.database();

class SingleChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            message: "",
            logs: [],
            ref: "/private/messages",
            menu: false,
            img: "",
            document: "",
            isRecording: false,
            seconds: 0,
            minutes: 0,
            record: "",
            replies: [],
            audioFile: '',
            authorized: false,
            isSendingRecord: false,
            isSendingImage: false,
            isSendingVideo: false,
            isSendingDocument: false
        };
        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderCustomMessage = this.renderCustomMessage.bind(this);
        this.recordingInterval = this.recordingInterval.bind(this);
    }
    // getSeconds(){
    // }
    recordingInterval(){
        let current = (this.state.seconds == "00" ? 1 : this.state.seconds+1);
        let min = Math.floor(current / 60);
        let sec = current - (min * 60);
        this.setState({
            minutes: min,
            seconds: sec
        });
    }
    async startRecording(){
        await Permissions.check('microphone', { type: 'always' }).then(async response => {
            if(response === 'authorized'){
                AudioRecord.start();
                this.setState({
                    isRecording: true
                });
                this.intervalHandle = setInterval(this.recordingInterval, 1000);
            }else{
                await this.checkPermission();
            }
        });
    }
    async sendRecording(){
        let audioFile = await AudioRecord.stop();
        this.setState({
            audioFile,
            isLoading: true,
            isSendingRecord: true
        });
        let uri = 'file://'+audioFile;
        let data = new FormData();
        data.append('img', {
            name: "img",
            uri,
            type: 'image/png'
        });
        // AsyncStorage.getItem('token').then(userToken => {
        axios.post(SERVER_URL+'api/upload/img', data).then(async resp => {
            this.setState({
                isLoading: false,
            });
            let result= [
                {
                    _id: new Date().getTime(),
                    text: "recording",
                    audio: STORAGE_URL+resp.data,
                    createdAt: new Date(),
                    user: {
                        _id: this.props.user.id,
                        name: this.props.user.name,
                        avatar: STORAGE_URL+this.props.user.img
                    }
                }
            ];
            await this.addNewMessage(result);
            this.setState({
                isSendingRecord: false
            });
            Toast.show({
                text: "You have sent a record successfully.",
                buttonText: "Ok",
                type: "success"
            })
        }).catch((err) => {
            this.setState({
                isLoading: false,
                isSendingRecord: false
            });
            // Toast.show({
            //     text: strings("messages.noInternet"),
            //     buttonText: strings("messages.ok"),
            //     type: "danger"
            // })
            // alert(JSON.stringify(err));
        });

        this.stopRecording();
    }
    cancelRecording(){
        AudioRecord.stop();
        this.stopRecording();
    }
    stopRecording(){
        clearInterval(this.intervalHandle);
        this.setState({
            isRecording: false,
            seconds: 0,
            minutes: 0
        });
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
        let newPostKey = firebaseDb.ref(this.state.ref).push().key;
        let updates = {};
        updates[this.state.ref+'/' + newPostKey] = data[0];
        firebaseDb.ref().update(updates);
        let reply= _.filter(this.state.replies, item => {
            return item.message.toLowerCase() == data[0].text.toLowerCase();
        });
        if(reply.length >= 1){
            let newPostKey2 = firebaseDb.ref(this.state.ref).push().key;
            data[0].text= reply[0].reply;
            data[0]._id= newPostKey2;
            data[0].user.avatar= "https://img.icons8.com/metro/1600/reply-all-arrow.png";
            let updates2 = {};
            updates2[this.state.ref+'/' + newPostKey2] = data[0];
            firebaseDb.ref().update(updates2);
        }
        if(this.state.device_id){
            firebaseDb.ref('/notifications/').push({
                "title": this.props.user.name+" sent you a message",
                "img": STORAGE_URL+this.props.user.img,
                "description": this.props.user.name,
                "screen": "SingleUserChat",
                "target": this.state.id,
                "data": {
                    ...this.props.navigation.state.params
                }
            });

            let notification= {
                app_id: ONESIGNAL_APP_ID,
                contents: {"en": "New message was sent from " +this.props.user.name},
                data: {
                    type : 1,
                },
                include_player_ids: [this.state.device_id]
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
        }
    }
    checkPermission = async () => {
        const p = await Permissions.check('microphone');
        console.log('permission check', p);
        if (p === 'authorized') return;
        this.requestPermission();
    };

    requestPermission = async () => {
        const p = await Permissions.request('microphone');
        console.log('permission request', p);
    };
    async componentDidMount(){
        // this.checkPermission();
        Permissions.check('microphone').then(response => {
            if (response === 'authorized'){
                const options = {
                    sampleRate: 16000,
                    channels: 1,
                    bitsPerSample: 16,
                    wavFile: 'test.wav'
                };

                AudioRecord.init(options);
            }else{
                Permissions.request('microphone').then(response2 => {
                    if (response2 === 'authorized') {
                        const options = {
                            sampleRate: 16000,
                            channels: 1,
                            bitsPerSample: 16,
                            wavFile: 'test.wav'
                        };
                        AudioRecord.init(options);
                    }
                    this.setState({ authorized: (response2 ===  'authorized') ? true : false})
                })
            }
        });

        const options = {
            sampleRate: 16000,
            channels: 1,
            bitsPerSample: 16,
            wavFile: 'test.wav'
        };

        AudioRecord.init(options);
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
                logs: _.reverse(_.sortBy(_.values(data.val()), ['createdAt']))
            })
        });
        firebaseDb.ref('/private/').off();
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
    renderCustomMessage(props) {
        if(props.currentMessage.document){
            return <Text onPress={() => Linking.openURL(props.currentMessage.document)} style={{color: "blue", textDecorationLine: "underline", padding: 5}}>{props.currentMessage.text}</Text>
        }else if(props.currentMessage.audio){
            return <AudioPlayer url={props.currentMessage.audio} />
        }else{
            return <MessageText {...props}/>
        }
    }
    renderCustomActions(props) {
        // if (Platform.OS === 'ios') {
        //     return (
        //         <CustomActions
        //             {...props}
        //         />
        //     );
        // }
        let BUTTONS = ["Image", "Document", "Export to text", "Cancel"];
        return (
            <View style={{alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                <Icon style={{padding: 10}} onPress={() =>
                    ActionSheet.show(
                        {
                            options: BUTTONS,
                            cancelButtonIndex: 3,
                            title: "Attachments"
                        },
                        buttonIndex => {
                            if(buttonIndex === 0){
                                let options = {
                                    title: "Choose Image",
                                    storageOptions: {
                                        skipBackup: true,
                                        path: 'images'
                                    }
                                };
                                ImagePicker.showImagePicker(options, (response) => {
                                    console.log('Response = ', response);
                                    if (response.didCancel) {
                                        console.log('User cancelled image picker');
                                    }
                                    else if (response.error) {
                                        console.log('ImagePicker Error: ', response.error);
                                    }
                                    else {
                                        console.log(response.data);
                                        this.setState({
                                            img: response.uri,
                                            isSendingImage: true
                                        });
                                        let uri = response.uri;
                                        let data = new FormData();
                                        data.append('img', {
                                            name: "img",
                                            uri,
                                            type: 'image/png'
                                        });
                                        // AsyncStorage.getItem('token').then(userToken => {
                                        axios.post(SERVER_URL+'api/upload/img', data).then(async resp => {
                                            this.setState({
                                                isLoading: false,
                                            });
                                            let result= [
                                                {
                                                    _id: new Date().getTime(),
                                                    image: STORAGE_URL+resp.data,
                                                    text: "",
                                                    type: "img",
                                                    createdAt: new Date(),
                                                    user: {
                                                        _id: this.props.user.id,
                                                        name: this.props.user.name,
                                                        avatar: STORAGE_URL+this.props.user.img
                                                    }
                                                }
                                            ];
                                            await this.addNewMessage(result);
                                            this.setState({
                                                isSendingImage: false
                                            });
                                            Toast.show({
                                                text: "You have sent a photo successfully.",
                                                buttonText: "Ok",
                                                type: "success"
                                            })
                                        }).catch((err) => {
                                            this.setState({
                                                isSendingImage: false,
                                            });
                                            Toast.show({
                                                text: strings("messages.noInternet"),
                                                buttonText: strings("messages.ok"),
                                                type: "danger"
                                            })
                                        })
                                        // });
                                    }
                                });
                            }else if(buttonIndex === 1){
                                DocumentPicker.show({
                                    filetype: [DocumentPickerUtil.allFiles()],
                                },(error,res) => {
                                    this.setState({
                                        document: res.uri,
                                        isSendingDocument: true
                                    });
                                    let uri = res.uri;
                                    let data = new FormData();
                                    data.append('img', {
                                        name: "img",
                                        uri,
                                        type: 'image/png'
                                    });
                                    // AsyncStorage.getItem('token').then(userToken => {
                                    axios.post(SERVER_URL+'api/upload/img', data).then(async resp => {
                                        let result= [
                                            {
                                                _id: new Date().getTime(),
                                                text: res.fileName,
                                                document: STORAGE_URL+resp.data,
                                                createdAt: new Date(),
                                                user: {
                                                    _id: this.props.user.id,
                                                    name: this.props.user.name,
                                                    avatar: STORAGE_URL+this.props.user.img
                                                }
                                            }
                                        ];
                                        await this.addNewMessage(result);
                                        this.setState({
                                            isSendingDocument: false,
                                        });
                                        Toast.show({
                                            text: "You have sent a document successfully.",
                                            buttonText: "Ok",
                                            type: "success"
                                        })
                                    }).catch((err) => {
                                        this.setState({
                                            isSendingDocument: false,
                                        });
                                        Toast.show({
                                            text: strings("messages.noInternet"),
                                            buttonText: strings("messages.ok"),
                                            type: "danger"
                                        })
                                    })
                                })
                            }else if(buttonIndex === 2){
                                let str= encodeURIComponent(JSON.stringify(this.state.logs));
                                // let str2= str.replace("%2F", "karim_special_string");
                                let str2= _.replace(str, /%2F/gm, 'karim_special_string');
                                Linking.openURL(SERVER_URL+"api/export/"+str2);
                            }
                        }
                    )} name="plus-circle" type="FontAwesome" />
                {!this.state.isRecording && (
                    <Icon onPress={()=> this.startRecording()} style={{padding: 10}} name="ios-mic" />
                )}
                {this.state.isRecording && (
                    <Icon onPress={()=> this.cancelRecording()} style={{padding: 10}} name="times-circle" type="FontAwesome" />
                )}
                {this.state.isRecording && (
                    <Text style={{padding: 10}}>{(this.state.minutes < 10)? "0"+this.state.minutes : this.state.minutes}:{(this.state.seconds < 10)? "0"+this.state.seconds : this.state.seconds}</Text>
                )}
                {this.state.isRecording && (
                    <Icon onPress={()=> this.sendRecording()} style={{padding: 10}} name="md-send" />
                )}
            </View>
        );
    }

    componentDidUnMount() {
        firebaseDb.ref(this.state.ref).off();
    }
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
                {
                    this.state.isSendingImage && (
                        <Button
                            style={{width: "100%", alignItems: "center"}} primary><Text style={[{flex: 1, color: "#fff"}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("chat.sendingImage") } </Text>
                            <ActivityIndicator style={{}} size="small" color="#000000" />
                        </Button>
                    )
                }
                {
                    this.state.isSendingDocument && (
                        <Button
                            style={{width: "100%", alignItems: "center"}} primary><Text style={[{flex: 1, color: "#fff"}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("chat.sendingDocument") } </Text>
                            <ActivityIndicator style={{}} size="small" color="#000000" />
                        </Button>
                    )
                }
                {
                    this.state.isSendingVideo && (
                        <Button
                            style={{width: "100%", alignItems: "center"}} primary><Text style={[{flex: 1, color: "#fff"}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("chat.sendingVideo") } </Text>
                            <ActivityIndicator style={{}} size="small" color="#000000" />
                        </Button>
                    )
                }
                {
                    this.state.isSendingRecord && (
                        <Button
                            style={{width: "100%", alignItems: "center"}} primary><Text style={[{flex: 1, color: "#fff"}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("chat.sendingRecord") } </Text>
                            <ActivityIndicator style={{}} size="small" color="#000000" />
                        </Button>
                    )
                }

                <GiftedChat
                    messages={this.state.logs}
                    onSend={data => this.addNewMessage(data)}
                    alwaysShowSend={true}
                    placeholder={strings('chat.placeholder')}
                    isAnimated={true}
                    inverted={true}
                    onPressAvatar={(user) => this.props.navigation.navigate('User', {id: user._id})}
                    showUserAvatar={true}
                    renderBubble={(props) => this.renderBubble(props)}
                    renderActions={this.renderCustomActions}
                    renderMessageText={this.renderCustomMessage}

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