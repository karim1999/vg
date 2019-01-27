import React, { Component } from 'react';
import {AsyncStorage, Text, View, Linking, ActivityIndicator, Clipboard, Platform} from "react-native";
import {Button, Container, Icon, List, ListItem, ActionSheet, Toast} from "native-base";
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
import VideoPlayer from "./../components/videoPlayer";
import {AudioRecorder, AudioUtils} from 'react-native-audio';
let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';

let firebaseDb= firebaseApp.database();

class SingleChat extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const id = navigation.getParam('id', 0);

        this.state = {
            ...this.props.navigation.state.params,
            message: "",
            logs: [],
            ref: firebaseDb.ref('/chat/' + this.props.navigation.state.params.id),
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
        this.onLongPress = this.onLongPress.bind(this);
    }
    // getSeconds(){
    // }
    recordingInterval(time){
        // let current = (this.state.seconds == "00" ? 1 : this.state.seconds+1);
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        this.setState({
            minutes: min,
            seconds: sec
        });
    }
    prepareRecordingPath(){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }
    async startRecording(){
        await Permissions.check('microphone', { type: 'always' }).then(async response => {
            if(response === 'authorized'){
                // AudioRecord.start();
                this.prepareRecordingPath();
                await AudioRecorder.startRecording();
                AudioRecorder.onProgress = (data) => {
                    this.recordingInterval(data.currentTime)
                    // this.setState({currentTime: Math.floor(data.currentTime)});
                };
                this.setState({
                    isRecording: true
                });
                // this.intervalHandle = setInterval(this.recordingInterval, 1000);
            }else{
                await this.checkPermission();
            }
        });
    }
    async sendRecording(){
        // let audioFile = await AudioRecord.stop();
        let audioFile =await AudioRecorder.stopRecording();
        this.setState({
            audioFile,
            isLoading: true,
            isSendingRecord: true
        });
	        let uri = audioPath;
		//uri = 'file://'+audioFile;
        let data = new FormData();
        data.append('img', {
            name: "img",
            uri,
            type: 'image/png'
        });
	alert(uri);
        // AsyncStorage.getItem('token').then(userToken => {
        axios.post(SERVER_URL+'api/upload/img', data).then(resp => {
	
	alert("done");
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
            this.addNewMessage(result);
            this.setState({
                isSendingRecord: false
            });
            Toast.show({
                text: "You have sent a record successfully.",
                buttonText: "Ok",
                type: "success"
            });
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
            alert(JSON.stringify(err));
        });

        this.stopRecording();
    }
    async cancelRecording(){
        // AudioRecord.stop();
        const filePath = await AudioRecorder.stopRecording();
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
                        color: (props.currentMessage.user._id == this.props.navigation.state.params.user_id) ? "white" : "black",
                    }
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: (props.currentMessage.user._id == this.props.navigation.state.params.user_id) ? "#0084ff" : "grey",
                        marginTop: 10
                    },
                    left: {
                        backgroundColor: (props.currentMessage.user._id == this.props.navigation.state.params.user_id) ? "#0084ff" : "#f0f0f0",
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
        let newPostKey = firebaseDb.ref('/chat/').child(this.props.navigation.state.params.id).push().key;
        let updates = {};
        updates['/chat/'+this.props.navigation.state.params.id+'/' + newPostKey] = data[0];
        firebaseDb.ref().update(updates);
        let reply= _.filter(this.state.replies, item => {
            return item.message.toLowerCase() == data[0].text.toLowerCase();
        });
        if(reply.length >= 1){
            let newPostKey2 = firebaseDb.ref('/chat/').child(this.props.navigation.state.params.id).push().key;
            data[0].text= reply[0].reply;
            data[0]._id= newPostKey2;
            data[0].user.avatar= "https://img.icons8.com/metro/1600/reply-all-arrow.png";
            let updates2 = {};
            updates2['/chat/'+this.props.navigation.state.params.id+'/' + newPostKey2] = data[0];
            firebaseDb.ref().update(updates2);
        }
        if(this.props.navigation.state.params.id != 0){
            // OneSignal.getPermissionSubscriptionState((status) => {
            //     let userId= status.userId;
            // });
            axios.get(SERVER_URL+"api/project/"+this.props.navigation.state.params.id+"/users").then(response => {
                let devices= _.compact(_.map(response.data, user => user.id !== this.props.user.id && user.device_id));
                return devices;
            }).then(devices => {
                let notification= {
                    app_id: ONESIGNAL_APP_ID,
                    contents: {"en": "New message was sent to " + this.props.navigation.state.params.title + " group chat"},
                    data: {

                        type : 1,
                        screen: 'SingleChat',
                        ...this.props.navigation.state.params,
                        forward: false
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
    checkPermission = async () => {
        const p = await Permissions.check('microphone');
        if (p === 'authorized') return;
        this.requestPermission();
    };

    requestPermission = async () => {
        const p = await Permissions.request('microphone');
    };
    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.props.navigation.state.params.forward !== prevProps.navigation.state.params.forward) {
            // this.setState({
            //     ref: firebaseDb.ref('/chat/' + this.props.navigation.state.params.id)
            // });
            // alert(this.props.navigation.state.params.id);
            firebaseDb.ref('/chat/' + this.props.navigation.state.params.id).on('value', data => {
                this.setState({
                    ref: firebaseDb.ref('/chat/' + this.props.navigation.state.params.id),
                    logs: _.reverse(_.sortBy(_.values(data.val()), ['createdAt']))
                })
            });
            this.forward();
        }
        // this.componentDidMount();
        // this.setState({
        //     ref: firebaseDb.ref('/chat/' + this.props.navigation.state.params.id)
        // })
        // this.componentDidMount();
    }

    forward(){
        if(this.props.navigation.state.params.forward){
            Toast.show({
                text: "Sending...",
                buttonText: "Ok",
                type: "primary"
            })
            let result= [];
            if(this.props.navigation.state.params.forwardType == "audio"){
                result= [
                    {
                        _id: new Date().getTime(),
                        text: this.props.navigation.state.params.forwardText,
                        audio: this.props.navigation.state.params.forwardValue,
                        createdAt: new Date(),
                        user: {
                            _id: this.props.user.id,
                            name: this.props.user.name,
                            avatar: STORAGE_URL+this.props.user.img
                        }
                    }
                ];
            }else if(this.props.navigation.state.params.forwardType == "image"){
                result= [
                    {
                        _id: new Date().getTime(),
                        image: this.props.navigation.state.params.forwardValue,
                        text: this.props.navigation.state.params.forwardText,
                        type: "img",
                        createdAt: new Date(),
                        user: {
                            _id: this.props.user.id,
                            name: this.props.user.name,
                            avatar: STORAGE_URL + this.props.user.img
                        }
                    }
                ];
            }else if(this.props.navigation.state.params.forwardType == "document"){
                result= [
                    {
                        _id: new Date().getTime(),
                        text: this.props.navigation.state.params.forwardText,
                        document: this.props.navigation.state.params.forwardValue,
                        createdAt: new Date(),
                        user: {
                            _id: this.props.user.id,
                            name: this.props.user.name,
                            avatar: STORAGE_URL+this.props.user.img
                        }
                    }
                ];
            }else if(this.props.navigation.state.params.forwardType == "video"){
                result= [
                    {
                        _id: new Date().getTime(),
                        video: this.props.navigation.state.params.forwardValue,
                        text: this.props.navigation.state.params.forwardText,
                        type: "video",
                        createdAt: new Date(),
                        user: {
                            _id: this.props.user.id,
                            name: this.props.user.name,
                            avatar: STORAGE_URL + this.props.user.img
                        }
                    }
                ];
            }else{
                result= [
                    {
                        _id: new Date().getTime(),
                        text: this.props.navigation.state.params.forwardText,
                        createdAt: new Date(),
                        user: {
                            _id: this.props.user.id,
                            name: this.props.user.name,
                            avatar: STORAGE_URL+this.props.user.img
                        }
                    }
                ];
            }
            this.addNewMessage(result);
        }

    }
    componentDidMount(){

        // this.checkPermission();
        Permissions.check('microphone').then(response => {
            if (response === 'authorized'){
                // AudioRecorder.prepareRecordingAtPath(audioPath, {
                //     SampleRate: 22050,
                //     Channels: 1,
                //     AudioQuality: "Low",
                //     AudioEncoding: "aac"
                // });
                // // const options = {
                // //     sampleRate: 16000,
                // //     channels: 1,
                // //     bitsPerSample: 16,
                // //     wavFile: 'test.wav'
                // // };
                // //
                // // AudioRecord.init(options);
            }else{
                Permissions.request('microphone').then(response2 => {
                    if (response2 === 'authorized') {
                        // AudioRecorder.prepareRecordingAtPath(audioPath, {
                        //     SampleRate: 22050,
                        //     Channels: 1,
                        //     AudioQuality: "Low",
                        //     AudioEncoding: "aac"
                        // });
                        // const options = {
                        //     sampleRate: 16000,
                        //     channels: 1,
                        //     bitsPerSample: 16,
                        //     wavFile: 'test.wav'
                        // };
                        // AudioRecord.init(options);
                    }
                    this.setState({ authorized: (response2 ===  'authorized') ? true : false})
                })
            }
        });


        // this.state.ref.once('value').then(data => {
        //     this.setState({
        //         logs: _.values(data.val())
        //     })
        // });
        this.state.ref.on('value', data => {
            this.setState({
                logs: _.reverse(_.sortBy(_.values(data.val()), ['createdAt']))
            })
        });
        firebaseDb.ref('/replies/'+this.props.navigation.state.params.id).on('value', data => {
            this.setState({
                replies: _.map(data.val(), (value, key)=> {
                    return {...value, key};
                }),
            })
        });
        this.forward();

    }
    componentWillUnmount() {
        firebaseDb.ref('/replies/'+this.props.navigation.state.params.id).off();
        this.state.ref.off();
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
    renderCustomMessage(props) {
        if(props.currentMessage.document) {
            return <Text onPress={() => Linking.openURL(props.currentMessage.document)} style={{
                color: "blue",
                textDecorationLine: "underline",
                padding: 5
            }}>{props.currentMessage.text}</Text>
        }else if(props.currentMessage.audio){
            return <AudioPlayer url={props.currentMessage.audio} />
        }else if(props.currentMessage.video){
            return <VideoPlayer
                source={props.currentMessage.video}
                navigator={ this.props.navigation }
            />
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
        let BUTTONS = ["Image", "Video", "Document", "Export to text", "Cancel"];
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
                            if(buttonIndex === 0) {
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
                                        // alert(uri);
                                        let data = new FormData();
                                        data.append('img', {
                                            name: "img",
                                            uri,
                                            type: 'image/png'
                                        });
                                        // AsyncStorage.getItem('token').then(userToken => {
                                        axios.post(SERVER_URL + 'api/upload/img', data).then(async resp => {
                                            let result = [
                                                {
                                                    _id: new Date().getTime(),
                                                    image: STORAGE_URL + resp.data,
                                                    text: "",
                                                    type: "img",
                                                    createdAt: new Date(),
                                                    user: {
                                                        _id: this.props.user.id,
                                                        name: this.props.user.name,
                                                        avatar: STORAGE_URL + this.props.user.img
                                                    }
                                                }
                                            ];
                                            await this.addNewMessage(result);
                                            Toast.show({
                                                text: "You have sent a photo successfully.",
                                                buttonText: "Ok",
                                                type: "success"
                                            });
                                            this.setState({
                                                isSendingImage: false
                                            });
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
                                let options = {
                                    title: "Choose Video",
                                    mediaType: "video",
                                    takePhotoButtonTitle: "Record Video",
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
                                            isSendingVideo: true
                                        });
                                        let uri = response.uri;
                                        // alert(uri);
                                        let data = new FormData();
                                        data.append('img', {
                                            name: "img",
                                            uri,
                                            type: 'image/png'
                                        });
                                        // AsyncStorage.getItem('token').then(userToken => {
                                        axios.post(SERVER_URL + 'api/upload/img', data).then(async resp => {
                                            let result = [
                                                {
                                                    _id: new Date().getTime(),
                                                    video: STORAGE_URL + resp.data,
                                                    text: "Video",
                                                    type: "video",
                                                    createdAt: new Date(),
                                                    user: {
                                                        _id: this.props.user.id,
                                                        name: this.props.user.name,
                                                        avatar: STORAGE_URL + this.props.user.img
                                                    }
                                                }
                                            ];
                                            await this.addNewMessage(result);
                                            Toast.show({
                                                text: "You have sent a video successfully.",
                                                buttonText: "Ok",
                                                type: "success"
                                            });
                                            this.setState({
                                                isSendingVideo: false
                                            });
                                        }).catch((err) => {
                                            this.setState({
                                                isSendingVideo: false,
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

                            }else if(buttonIndex === 2){
                                DocumentPicker.show({
                                    filetype: [DocumentPickerUtil.allFiles()],
                                },(error,res) => {
                                    this.setState({
                                        document: res.uri,
                                        isSendingDocument: true
                                    });
                                    let uri = res.uri;
                                    // alert(uri);

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
                            }else if(buttonIndex === 3){
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
    onLongPress(context, message) {
        // alert(JSON.stringify(message))
        const options= [];
        if (!message.audio && !message.video && !message.image) {
            const options = [
                'Copy Text',
                'Forward',
                'Cancel'
            ];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Clipboard.setString(message.text);
                            break;
                        case 1:
                            this.props.navigation.navigate('Forward', message);
                            break;
                    }
                });
        }else{
            const options = [
                'Forward',
                'Cancel'
            ];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            this.props.navigation.navigate('Forward', message);
                            break;
                    }
                });
        }
    }
    render() {
        return (
            <Container style={{backgroundColor: "#f3f3f3"}}>
                <Header toggleMenu={() => this.toggleMenu()} title={this.props.navigation.state.params.title} navigation={this.props.navigation} right={this.props.navigation.state.params.id != 0}>
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
                        {
                            this.props.user.id == this.props.navigation.state.params.user_id && (
                                <ListItem style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]} onPress={() => {
                                    this.setState({menu: false});
                                    this.props.navigation.navigate("Replies", {...this.props.navigation.state.params});
                                }}>
                                    <Text>{ strings('chat.automatic') }</Text>
                                </ListItem>
                            )
                        }
                    </List>
                )}
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
                {
                    this.props.navigation.state.params.id != 0 && (
                        <View style={{backgroundColor: "grey", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{padding: 10, fontSize: 13}}> { strings('chat.totalCapital') } <Text style={{color: "#FFFFFF"}}> {this.formatMondey(this.state.total_amount_invested, 0, '.', ',')} {this.state.currency}</Text></Text>
                        </View>
                    )
                }
                <GiftedChat
                    messages={this.state.logs}
                    onSend={data => this.addNewMessage(data)}
                    alwaysShowSend={true}
                    placeholder={strings('chat.placeholder')}
                    isAnimated={true}
                    inverted={true}
                    onLongPress={this.onLongPress}
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
