import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Picker, Toast, Button, Text} from 'native-base';
import {AsyncStorage, Slider, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

export default class AddProject extends Component {
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
                category: ""
            }
        }
        this.state = {
            selected2: undefined,
            isLoading: false,
            ...data,
            image_data: null,
            image_url: "",
            categories: []
        };
    }
    onValueChange2(value: string) {
        this.setState({
            selected2: value
        });
    }
    submit(){
        AsyncStorage.getItem('token').then(userToken => {
            return axios.post(SERVER_URL+'api/projects?token='+userToken, {
                title: this.state.title,
                description: this.state.description,
                amount: this.state.amount,
                report: this.state.report,
                presentation: this.state.presentation,
                category: this.state.category
            }).then(response => {
                AsyncStorage.getItem('token').then(userToken => {
                    RNFetchBlob.fetch('POST', SERVER_URL+'api/project/'+response.data.id+'/img'+'?token='+userToken, {
                        'Content-Type' : 'multipart/form-data',
                    }, [
                        { name : 'img', filename : 'img.png', type:'image/png', data: response.data},
                    ]).then((resp) => {
                        this.setState({
                            isLoading: false,
                        });
                        this.props.setUser(resp.data);
                        console.log(resp.data);
                    }).catch((err) => {
                        this.setState({
                            isLoading: false,
                        });
                        Toast.show({
                            text: "Error reaching the server.",
                            buttonText: "Ok",
                            type: "danger"
                        })
                    })
                });

            }).catch(error => {
                console.log(error);
                this.setState({
                    isLoading: false,
                });
                Toast.show({
                    text: "Error reaching the server.",
                    buttonText: "Ok",
                    type: "danger"
                })
            })
        });
    }
    selectImage(){
        let options = {
            title: 'Select Avatar',
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
                    isLoading: true,
                    image_data: response.data
                });
            }
        });
    }
    componentDidMount(){
        return axios.get(SERVER_URL+"api/categories").then(response => {
            this.setState({
                categories: response.data,
            });
        }).catch(error => {
            Toast.show({
                text: "No internet connection",
                buttonText: "Ok",
                type: "danger"
            })
        });
    }
    render() {
        return (
            <AppTemplate title="Add Project" backButton={true} navigation={this.props.navigation} activeTab="Home">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='pencil' />
                            <Label>Title:</Label>
                            <Input onChangeText={(title) => this.setState({title})}
                                   value={this.state.title}
                            />
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='info' />
                            <Label>Description:</Label>
                            <Input multiline = {true}
                                   numberOfLines = {10}
                                   onChangeText={(description) => this.setState({description})}
                                   value={this.state.description}
                            />
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon name='md-images' />
                            <Label>Image:</Label>
                            <Button
                                style={{alignSelf: "center"}}
                                onPress={() => this.selectImage()} light>
                                <Text>Select</Text>
                            </Button>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon name='ios-folder-open' />
                            <Label>Category:</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ width: undefined }}
                                placeholder="Select your SIM"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.category}
                                onValueChange={(itemValue, itemIndex) => this.onValueChange(itemValue)}
                            >
                                {this.state.categories.map((category) => (
                                    <Picker.Item key={category.id} label={category.name} value={category.id} />
                                ))}
                            </Picker>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='money' />
                            <Label>Amount Needed:</Label>
                            <Slider
                                value={Number(this.state.money)}
                                onValueChange={(money) => this.setState({money})}
                                style={{flex: 1}} step={5000} maximumValue={1000000} minimumValue={5000}/>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="MaterialCommunityIcons" name='presentation-play' />
                            <Label>Presentation:</Label>
                            <Input
                                onChangeText={(presentation) => this.setState({presentation})}
                                value={this.state.presentation}
                            />
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='file-text' />
                            <Label>Report:</Label>
                            <Input
                                onChangeText={(report) => this.setState({report})}
                                value={this.state.report}
                            />
                        </Item>
                        <Button
                            onPress={() => this.submit()}
                            block light>
                            <Text>Save</Text>
                        </Button>
                    </Form>
                </View>
            </AppTemplate>
        );
    }
}