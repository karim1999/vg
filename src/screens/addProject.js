import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Picker, Toast, Button, Text, Radio, ListItem, Left, Right} from 'native-base';
import {ActivityIndicator, AsyncStorage, Slider, View} from "react-native";
import {ONESIGNAL_API_KEY, ONESIGNAL_APP_ID, SERVER_URL, STORAGE_URL} from "../config";
import axios from "axios";
import ImagePicker from "react-native-image-picker";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { strings } from '../i18n';
import I18n from "../i18n";
import firebaseApp from "../firebaseDb";
let firebaseDb= firebaseApp.database();

class AddProject extends Component {
    constructor(props) {
        super(props);
        let data= {};
        if(this.props.navigation.state.params){
            data= this.props.navigation.state.params;
        }else{
            data= {
                title: "",
                description: "",
                amount: 0,
                report: "",
                presentation: "",
                category: 1,
                visibility: 1,
                currency: "$",
            };
        }
        this.state = {
            selected2: undefined,
            isLoading: false,
            ...data,
            image_data: null,
            presentationUri: "",
            reportUri: "",
            imgUri: "",
            imgUri1: "",
            imgUri2: "",
            imgUri3: "",
            imgUri4: "",
            categories: []
        };
    }
    submit() {
        if (this.state.imgUri != "" && this.state.title != "" && this.state.description != "" && this.state.amount != 0 && this.state.category != 0){
            this.setState({
                isLoading: true,
            });
            AsyncStorage.getItem('token').then(userToken => {
                let data = new FormData();
                data.append('title', this.state.title);
                data.append('description', this.state.description);
                data.append('amount', this.convertNumber(this.state.amount));
                data.append('category_id', this.state.category);
                data.append('visibility', this.state.visibility);
                data.append('currency', this.state.currency);
                if (this.state.imgUri) {
                    data.append('img', {
                        name: "img",
                        uri: this.state.imgUri,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri1) {
                    data.append('img1', {
                        name: "img",
                        uri: this.state.imgUri1,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri2) {
                    data.append('img2', {
                        name: "img",
                        uri: this.state.imgUri2,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri3) {
                    data.append('img3', {
                        name: "img",
                        uri: this.state.imgUri3,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri4) {
                    data.append('img4', {
                        name: "img",
                        uri: this.state.imgUri4,
                        type: 'image/png'
                    });
                }
                if (this.state.presentationUri) {
                    data.append('presentation', {
                        name: "presentation",
                        uri: this.state.presentationUri,
                        type: 'image/png'
                    });
                }
                if (this.state.reportUri) {
                    data.append('report', {
                        name: "report",
                        uri: this.state.reportUri,
                        type: 'image/png',
                    });
                }
                return axios.post(SERVER_URL + 'api/projects?token=' + userToken, data).then(response => {
                    firebaseDb.ref('/notifications/').push({
                        "title": this.props.user.name+" added a new project",
                        "img": STORAGE_URL+this.props.user.img,
                        "description": "",
                        "screen": "User",
                        "data": {
                            id: this.props.user.id
                        }
                    });

                    let notification= {
                        app_id: ONESIGNAL_APP_ID,
                        contents: {"en": "New project was added"},
                        data: {
                            type : 1,
                        },
                        included_segments: ["All"]
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
                    this.props.setUser(response.data);
                    Toast.show({
                        text: strings("add_project.addDone"),
                        buttonText: "Ok",
                        type: "success"
                    });
                    this.props.navigation.navigate("Home", {data: "refresh"});
                }).catch(error => {
                    console.warn(error);
                    Toast.show({
                        text: strings("messages.noInternet"),
                        buttonText: "Ok",
                        type: "danger"
                    })
                })
            }).then(() => {
                this.setState({
                    isLoading: false,
                });
            });
        }else {
            if(this.state.title == ""){
                Toast.show({
                    text: strings("add_project.requiredField", {name: "Title"}),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else if(this.state.description == ""){
                Toast.show({
                    text: strings("add_project.requiredField", {name: "Description"}),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else if(this.state.amount == 0){
                Toast.show({
                    text: strings("add_project.requiredField", {name: "Amount"}),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else if(this.state.category == 0){
                Toast.show({
                    text: strings("add_project.requiredField", {name: "Category"}),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else{
                Toast.show({
                    text: strings("add_project.requiredField", {name: "Image"}),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }
        }
    }
    submit2() {
        if (this.state.title != "" && this.state.description != "" && this.state.amount != 0 && this.state.category != 0){
            this.setState({
                isLoading: true,
            });
            AsyncStorage.getItem('token').then(userToken => {
                let data = new FormData();
                data.append('title', this.state.title);
                data.append('description', this.state.description);
                data.append('amount', this.convertNumber(this.state.amount));
                data.append('category_id', this.state.category);
                data.append('visibility', this.state.visibility);
                data.append('currency', this.state.currency);
                if (this.state.imgUri) {
                    data.append('img', {
                        name: "img",
                        uri: this.state.imgUri,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri1) {
                    data.append('img', {
                        name: "img",
                        uri: this.state.imgUri1,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri2) {
                    data.append('img', {
                        name: "img",
                        uri: this.state.imgUri2,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri3) {
                    data.append('img', {
                        name: "img",
                        uri: this.state.imgUri3,
                        type: 'image/png'
                    });
                }
                if (this.state.imgUri4) {
                    data.append('img', {
                        name: "img",
                        uri: this.state.imgUri4,
                        type: 'image/png'
                    });
                }
                if (this.state.presentationUri) {
                    data.append('presentation', {
                        name: "presentation",
                        uri: this.state.presentationUri,
                        type: 'image/png'
                    });
                }
                if (this.state.reportUri) {
                    data.append('report', {
                        name: "report",
                        uri: this.state.reportUri,
                        type: 'image/png',
                    });
                }
                return axios.post(SERVER_URL + 'api/projects/'+this.props.navigation.state.params.id+'?token=' + userToken, data, {
                    headers: { 'content-type': 'application/x-www-form-urlencoded' }
                }).then(response => {
                    this.props.setUser(response.data);
                    Toast.show({
                        text: strings("add_project.editDone"),
                        buttonText: "Ok",
                        type: "success"
                    });
                    this.props.navigation.navigate("Home", {data: "refresh"});
                }).catch(error => {
                    console.warn(error);
                    Toast.show({
                        text: strings("messages.noInternet"),
                        buttonText: "Ok",
                        type: "danger"
                    })
                })
            }).then(() => {
                this.setState({
                    isLoading: false,
                });
            });
        }else {
            if(this.state.title == ""){
                Toast.show({
                    text: strings("add_project.requiredField", "Title"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else if(this.state.description == ""){
                Toast.show({
                    text: strings("add_project.requiredField", "Description"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else if(this.state.amount == 0){
                Toast.show({
                    text: strings("add_project.requiredField", "Amount"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else if(this.state.category == 0){
                Toast.show({
                    text: strings("add_project.requiredField", "Category"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }else{
                Toast.show({
                    text: strings("messages.unknownError"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            }
        }
    }
    selectImage(){
        let options = {
            title: strings("messages.image"),
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
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response.data);
                this.setState({
                    imgUri: response.uri
                });
            }
        });
    }
    selectImage1(){
        let options = {
            title: strings("messages.image"),
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
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response.data);
                this.setState({
                    imgUri1: response.uri
                });
            }
        });
    }
    selectImage2(){
        let options = {
            title: strings("messages.image"),
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
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response.data);
                this.setState({
                    imgUri2: response.uri
                });
            }
        });
    }
    selectImage3(){
        let options = {
            title: strings("messages.image"),
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
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response.data);
                this.setState({
                    imgUri3: response.uri
                });
            }
        });
    }
    selectImage4(){
        let options = {
            title: strings("messages.image"),
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
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log(response.data);
                this.setState({
                    imgUri4: response.uri
                });
            }
        });
    }
    addOrEdit(){

        if(this.props.navigation.state.params){
            this.submit2();
        }else{
          if(this.state.imgUri != ""){
            this.submit();
          }else{
            Toast.show({
                text: strings("messages.image_required"),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
          }
        }

    }
    componentDidMount(){
        return axios.get(SERVER_URL+"api/categories").then(response => {
            this.setState({
                categories: response.data,
            });
        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
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
    convertNumber = function(n){
        return Number(String(n).replace(/\D/g,''));
    };
    selectPresentation(){
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        },(error,res) => {
            this.setState({
                presentationUri: res.uri
            });
        })
    }
    selectReport(){
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        },(error,res) => {
            this.setState({
                reportUri: res.uri
            });
        })
    }
    render() {
        return (
            <AppTemplate title={strings("add_project.title")} backButton={true} navigation={this.props.navigation} activeTab="Home">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='pencil' />
                                    <Label>{strings("add_project.title_text")}</Label>
                                    <Input onChangeText={(title) => this.setState({title})}
                                           value={this.state.title}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input style={{textAlign: "right"}} onChangeText={(title) => this.setState({title})}
                                           value={this.state.title}
                                    />
                                    <Label>{strings("add_project.title_text")}</Label>
                                    <Icon type="FontAwesome" name='pencil' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='info' />
                                    <Label>{strings("add_project.description")}</Label>
                                    <Input multiline = {true}
                                           numberOfLines = {10}
                                           onChangeText={(description) => this.setState({description})}
                                           value={this.state.description}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input multiline = {true}
                                           style={{textAlign: "right"}}
                                           numberOfLines = {10}
                                           onChangeText={(description) => this.setState({description})}
                                           value={this.state.description}
                                    />
                                    <Label>{strings("add_project.description")}</Label>
                                    <Icon type="FontAwesome" name='info' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='md-images' />
                                    <Label>{strings("add_project.image")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.image")}</Label>
                                    <Icon name='md-images' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='md-images' />
                                    <Label>{strings("add_project.image")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage1()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri1) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage1()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri1) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.image")}</Label>
                                    <Icon name='md-images' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='md-images' />
                                    <Label>{strings("add_project.image")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage2()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri2) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage2()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri2) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.image")}</Label>
                                    <Icon name='md-images' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='md-images' />
                                    <Label>{strings("add_project.image")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage3()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri3) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage3()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri3) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.image")}</Label>
                                    <Icon name='md-images' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='md-images' />
                                    <Label>{strings("add_project.image")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage4()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri4) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectImage4()} light>
                                        <Text>
                                            {
                                                (this.state.imgUri4) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.image")}</Label>
                                    <Icon name='md-images' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-folder-open' />
                                    <Label>{strings("add_project.industry")}:</Label>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{ width: undefined }}
                                        placeholder={strings('add_project.industry')}
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.category}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue})}
                                    >
                                        {this.state.categories.map((category) => (
                                            <Picker.Item key={category.id} label={category.name} value={category.id} />
                                        ))}
                                    </Picker>
                                </Item>
                            ) : (
                                <Item style={{height: 70, alignSelf: "flex-end"}}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{ width: undefined }}
                                        placeholder={strings('add_project.industry')}
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.category}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue})}
                                    >
                                        {this.state.categories.map((category) => (
                                            <Picker.Item key={category.id} label={category.name} value={category.id} />
                                        ))}
                                    </Picker>
                                    <Label style={{textAlign: "right"}}>{strings("add_project.industry")}:</Label>
                                    <Icon name='ios-folder-open' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='money' />
                                    <Label>{strings("add_project.capitalNeeded")}</Label>
                                    <Input onChangeText={(amount) => this.setState({amount})}
                                           value={this.formatMondey(this.convertNumber(this.state.amount), 0, '.', ',')}
                                           keyboardType='phone-pad'
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input style={{textAlign: "right"}} onChangeText={(amount) => this.setState({amount})}
                                           value={this.formatMondey(this.convertNumber(this.state.amount), 0, '.', ',')}
                                           keyboardType='phone-pad'
                                    />
                                    <Label>{strings("add_project.capitalNeeded")}</Label>
                                    <Icon type="FontAwesome" name='money' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem
                                    onPress={(currency) => {this.setState({currency: "$"})}}
                                >
                                    <Left>
                                        <Text>USD ($)</Text>
                                    </Left>
                                    <Right>
                                        <Radio selected={this.state.currency === "$"}
                                               onPress={(currency) => {this.setState({currency: "$"})}}
                                        />
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem
                                    onPress={(currency) => {this.setState({currency: "$"})}}
                                >
                                    <Left>
                                        <Radio selected={this.state.currency === "$"}
                                               onPress={(currency) => {this.setState({currency: "$"})}}
                                        />
                                    </Left>
                                    <Right>
                                        <Text>USD ($)</Text>
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem
                                    onPress={(currency) => {this.setState({currency: "SAR"})}}
                                >
                                    <Left>
                                        <Text>SAR</Text>
                                    </Left>
                                    <Right>
                                        <Radio selected={this.state.currency === "SAR"}
                                               onPress={(currency) => {this.setState({currency: "SAR"})}}
                                        />
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem
                                    onPress={(currency) => {this.setState({currency: "SAR"})}}
                                >
                                    <Left>
                                        <Radio selected={this.state.currency === "SAR"}
                                               onPress={(currency) => {this.setState({currency: "SAR"})}}
                                        />
                                    </Left>
                                    <Right>
                                        <Text>SAR</Text>
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="MaterialCommunityIcons" name='presentation-play' />
                                    <Label>{strings("add_project.presentation")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectPresentation()} light>
                                        <Text>
                                            {
                                                (this.state.presentationUri) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectPresentation()} light>
                                        <Text>
                                            {
                                                (this.state.presentationUri) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                            {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.presentation")}</Label>
                                    <Icon type="MaterialCommunityIcons" name='presentation-play' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='file-text' />
                                    <Label>{strings("add_project.report")}</Label>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectReport()} light>
                                        <Text>
                                            {
                                                (this.state.reportUri) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                </Item>
                            ) : (
                                <Item style={{height: 70, justifySelf: "flex-end", alignSelf: "flex-end"}}>
                                    <Button
                                        style={{alignSelf: "center"}}
                                        onPress={() => this.selectReport()} light>
                                        <Text>
                                            {
                                                (this.state.reportUri) && (
                                                    <Icon name="md-checkmark-circle" style={{color: "green", fontSize: 17, marginRight: 10}} />
                                                )
                                            }
                                             {strings("add_project.select")}</Text>
                                    </Button>
                                    <Label>{strings("add_project.report")}</Label>
                                    <Icon type="FontAwesome" name='file-text' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem
                                    onPress={(visibility) => {this.setState({visibility: 1})}}
                                >
                                    <Left>
                                        <Text>{strings("add_project.public")}</Text>
                                    </Left>
                                    <Right>
                                        <Radio selected={this.state.visibility === 1}
                                               onPress={(visibility) => {this.setState({visibility: 1})}}
                                        />
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem
                                    onPress={(visibility) => {this.setState({visibility: 1})}}
                                >
                                    <Left>
                                        <Radio selected={this.state.visibility === 1}
                                               onPress={(visibility) => {this.setState({visibility: 1})}}
                                        />
                                    </Left>
                                    <Right>
                                        <Text>{strings("add_project.public")}</Text>
                                    </Right>
                                </ListItem>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem
                                    onPress={(visibility) => {this.setState({visibility: 2})}}
                                >
                                    <Left>
                                        <Text>{strings("add_project.private")}</Text>
                                    </Left>
                                    <Right>
                                        <Radio selected={this.state.visibility === 2}
                                               onPress={(visibility) => {this.setState({visibility: 2})}}
                                        />
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem
                                    onPress={(visibility) => {this.setState({visibility: 2})}}
                                >
                                    <Left>
                                        <Radio selected={this.state.visibility === 2}
                                               onPress={(visibility) => {this.setState({visibility: 2})}}
                                        />
                                    </Left>
                                    <Right>
                                        <Text>{strings("add_project.private")}</Text>
                                    </Right>
                                </ListItem>
                            )
                        }
                        <Button
                            onPress={() => this.addOrEdit()}
                            style={{flexDirection: "row"}}
                            block light>
                            <Text>{strings("add_project.save")}</Text>
                            {this.state.isLoading && (
                                <ActivityIndicator style={{}} size="small" color="#000000" />
                            )}
                        </Button>
                    </Form>
                </View>
            </AppTemplate>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    user,
    favorites: user.favorites,
    jointProjects: user.jointprojects,
    myProjects: user.projects
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddProject);
