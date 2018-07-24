import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Picker, Toast, Button, Text} from 'native-base';
import {ActivityIndicator, AsyncStorage, Slider, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import {connect} from "react-redux";
import {setUser} from "../reducers";

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
            };
        }
        this.state = {
            selected2: undefined,
            isLoading: false,
            ...data,
            image_data: null,
            categories: []
        };
    }
    submit() {
        if (this.state.image_data && this.state.title != "" && this.state.description != "" && this.state.amount != 0 && this.state.category != 0){
            this.setState({
                isLoading: true,
            });
            AsyncStorage.getItem('token').then(userToken => {
                return axios.post(SERVER_URL + 'api/projects?token=' + userToken, {
                    title: this.state.title,
                    description: this.state.description,
                    amount: this.state.amount,
                    report: this.state.report,
                    presentation: this.state.presentation,
                    category_id: this.state.category
                }).then(response => {
                    if (this.state.image_data) {
                        console.log(response.data);
                        return AsyncStorage.getItem('token').then(userToken => {
                            return RNFetchBlob.fetch('POST', SERVER_URL + 'api/projects/' + response.data.id + '/img' + '?token=' + userToken, {
                                'Content-Type': 'multipart/form-data',
                            }, [
                                {name: 'img', filename: 'img.png', type: 'image/png', data: this.state.image_data},
                            ]).then((resp) => {
                                this.props.setUser(JSON.parse(resp.data));
                                console.log(JSON.parse(resp.data));
                                Toast.show({
                                    text: "Project was added successfully.",
                                    buttonText: "Ok",
                                    type: "success"
                                });
                                this.props.navigation.navigate("Home", {data: "refresh"});
                            })
                        });
                    } else {
                        Toast.show({
                            text: "Project was added successfully.",
                            buttonText: "Ok",
                            type: "success"
                        })
                    }

                }).catch(error => {
                    console.log(error);
                    Toast.show({
                        text: "Error reaching the server.",
                        buttonText: "Ok",
                        type: "danger"
                    })
                })
            }).finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
        }else {
            if(this.state.title == ""){
                Toast.show({
                    text: "Title field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else if(this.state.description == ""){
                Toast.show({
                    text: "description field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else if(this.state.amount == 0){
                Toast.show({
                    text: "Amount field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else if(this.state.category == 0){
                Toast.show({
                    text: "Category field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else{
                Toast.show({
                    text: "Image field is required.",
                    buttonText: "Ok",
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
                return axios.put(SERVER_URL + 'api/projects/'+this.props.navigation.state.params.id+'?token=' + userToken, {
                    title: this.state.title,
                    description: this.state.description,
                    amount: this.state.amount,
                    report: this.state.report,
                    presentation: this.state.presentation,
                    category_id: this.state.category
                }).then(response => {
                    this.props.setUser(JSON.parse(JSON.stringify(response.data)));
                    if (this.state.image_data) {
                        console.log(response.data);
                        return AsyncStorage.getItem('token').then(userToken => {
                            return RNFetchBlob.fetch('POST', SERVER_URL + 'api/projects/' + this.props.navigation.state.params.id + '/img' + '?token=' + userToken, {
                                'Content-Type': 'multipart/form-data',
                            }, [
                                {name: 'img', filename: 'img.png', type: 'image/png', data: this.state.image_data},
                            ]).then((resp) => {
                                this.props.setUser(JSON.parse(resp.data));
                                console.log(JSON.parse(resp.data));
                                Toast.show({
                                    text: "Project was edited successfully.",
                                    buttonText: "Ok",
                                    type: "success"
                                });
                                this.props.navigation.navigate("Home", {data: "refresh"});
                            })
                        });
                    } else {
                        Toast.show({
                            text: "Project was edited successfully.",
                            buttonText: "Ok",
                            type: "success"
                        })
                        this.props.navigation.navigate("Home", {data: "refresh"});
                    }

                }).catch(error => {
                    console.log(error);
                    Toast.show({
                        text: "Error reaching the server.",
                        buttonText: "Ok",
                        type: "danger"
                    })
                })
            }).finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
        }else {
            if(this.state.title == ""){
                Toast.show({
                    text: "Title field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else if(this.state.description == ""){
                Toast.show({
                    text: "description field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else if(this.state.amount == 0){
                Toast.show({
                    text: "Amount field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else if(this.state.category == 0){
                Toast.show({
                    text: "Category field is required.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }else{
                Toast.show({
                    text: "Something went wrong.",
                    buttonText: "Ok",
                    type: "danger"
                })
            }
        }
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
                    image_data: response.data
                });
            }
        });
    }
    addOrEdit(){
        if(this.props.navigation.state.params){
            this.submit2();
        }else{
            this.submit();
        }
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
                                onValueChange={(itemValue, itemIndex) => this.setState({ category: itemValue})}
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
                                value={Number(this.state.amount)}
                                onValueChange={(amount) => this.setState({amount})}
                                style={{flex: 1}} step={5000} maximumValue={1000000} minimumValue={5000}/>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="MaterialCommunityIcons" name='presentation-play' />
                            <Label>Presentation Link:</Label>
                            <Input
                                onChangeText={(presentation) => this.setState({presentation})}
                                value={this.state.presentation}
                            />
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='file-text' />
                            <Label>Report Link:</Label>
                            <Input
                                onChangeText={(report) => this.setState({report})}
                                value={this.state.report}
                            />
                        </Item>
                        <Button
                            onPress={() => this.addOrEdit()}
                            style={{flexDirection: "row"}}
                            block light>
                            <Text>Save</Text>
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