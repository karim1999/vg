import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Picker, Button, Text, Toast} from 'native-base';
import {ActivityIndicator, AsyncStorage, Slider, View} from "react-native";
import countries from './../countries.json';
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {SERVER_URL} from "../config";
import axios from "axios";
import {strings} from "../i18n";
import I18n from "../i18n";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected2: undefined,
            ...this.props.user,
            isLoading: false
        };
    }
    onValueChange2(value: string) {
        this.setState({
            selected2: value
        });
    }
    submit(){
        this.setState({
            isLoading: true,
        });

        AsyncStorage.getItem('token').then(userToken => {
            return axios.post(SERVER_URL+'api/user/edit?token='+userToken, {
                country: this.state.country,
                city: this.state.city,
                phone: this.state.phone,
                name: this.state.name,
                description: this.state.description,
                facebook: this.state.facebook,
                twitter: this.state.twitter,
                linkedin: this.state.linkedin,
                money: this.state.money
            }).then(response => {
                this.props.setUser(response.data);
                Toast.show({
                    text: strings("profile.editDone"),
                    buttonText: strings("messages.ok"),
                    type: "success"
                });
                console.log(response.data);
            }).catch(error => {
                console.log(error);
                Toast.show({
                    text: strings("messages.noInternet"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            })
        }).finally(() => {
            this.setState({
                isLoading: false,
            });
        });
    }
    render() {

        return (
            <AppTemplate title={strings('profile.title')} backButton={true} navigation={this.props.navigation} activeTab="Settings">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='pencil' />
                                    <Label>{strings('profile.name')}</Label>
                                    <Input onChangeText={(name) => this.setState({name})}
                                           value={this.state.name}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input onChangeText={(name) => this.setState({name})}
                                           style={{textAlign: "right"}}
                                           value={this.state.name}
                                    />
                                    <Label>{strings('profile.name')}</Label>
                                    <Icon type="FontAwesome" name='pencil' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='info' />
                                    <Label>{strings('profile.personalInfo')}</Label>
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
                                    <Label>{strings('profile.personalInfo')}</Label>
                                    <Icon type="FontAwesome" name='info' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-folder-open' />
                                    <Label>{strings('profile.country')}</Label>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{ width: undefined }}
                                        placeholder="Select your SIM"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.country}
                                        onValueChange={(country) => this.setState({country})}
                                    >
                                        {countries.data.map((country)=>{ return(<Picker.Item key={country.name} label={country.name} value={country.name} />) })}
                                    </Picker>
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{ width: undefined }}
                                        placeholder="Select your SIM"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.country}
                                        onValueChange={(country) => this.setState({country})}
                                    >
                                        {countries.data.map((country)=>{ return(<Picker.Item key={country.name} label={country.name} value={country.name} />) })}
                                    </Picker>
                                    <Label>{strings('profile.country')}</Label>
                                    <Icon name='ios-folder-open' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-home' />
                                    <Label>{strings('profile.city')}</Label>
                                    <Input
                                        onChangeText={(city) => this.setState({city})}
                                        value={this.state.city}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input
                                        style={{textAlign: "right"}}
                                        onChangeText={(city) => this.setState({city})}
                                        value={this.state.city}
                                    />
                                    <Label>{strings('profile.city')}</Label>
                                    <Icon name='ios-home' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-home' />
                                    <Label>{strings('profile.phone')}</Label>
                                    <Input
                                        keyboardType='phone-pad'
                                        onChangeText={(phone) => this.setState({phone})}
                                        value={this.state.phone}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input
                                        style={{textAlign: "right"}}
                                        keyboardType='phone-pad'
                                        onChangeText={(phone) => this.setState({phone})}
                                        value={this.state.phone}
                                    />
                                    <Label>{strings('profile.phone')}</Label>
                                    <Icon name='ios-home' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon type="FontAwesome" name='money' />
                                    <Label>{strings('profile.wallet')}</Label>
                                    <Slider
                                        value={Number(this.state.money)}
                                        onValueChange={(money) => this.setState({money})}
                                        style={{flex: 1}} step={5000} maximumValue={1000000} minimumValue={5000}/>
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Slider
                                        value={Number(this.state.money)}
                                        onValueChange={(money) => this.setState({money})}
                                        style={{flex: 1}} step={5000} maximumValue={1000000} minimumValue={5000}/>
                                    <Label>{strings('profile.wallet')}</Label>
                                    <Icon type="FontAwesome" name='money' />
                                </Item>
                            )
                        }

                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='logo-facebook' />
                                    <Label>{strings('profile.facebook')}</Label>
                                    <Input
                                        onChangeText={(facebook) => this.setState({facebook})}
                                        value={this.state.facebook}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input
                                        style={{textAlign: "right"}}
                                        onChangeText={(facebook) => this.setState({facebook})}
                                        value={this.state.facebook}
                                    />
                                    <Label>{strings('profile.facebook')}</Label>
                                    <Icon name='logo-facebook' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='logo-twitter' />
                                    <Label>{strings('profile.twitter')}</Label>
                                    <Input
                                        onChangeText={(twitter) => this.setState({twitter})}
                                        value={this.state.twitter}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input
                                        style={{textAlign: "right"}}
                                        onChangeText={(twitter) => this.setState({twitter})}
                                        value={this.state.twitter}
                                    />
                                    <Label>{strings('profile.twitter')}</Label>
                                    <Icon name='logo-twitter' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='logo-linkedin' />
                                    <Label>{strings('profile.linkedin')}</Label>
                                    <Input
                                        onChangeText={(linkedin) => this.setState({linkedin})}
                                        value={this.state.linkedin}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input
                                        style={{textAlign: "right"}}
                                        onChangeText={(linkedin) => this.setState({linkedin})}
                                        value={this.state.linkedin}
                                    />
                                    <Label>{strings('profile.linkedin')}</Label>
                                    <Icon name='logo-linkedin' />
                                </Item>
                            )
                        }
                        <Button
                            onPress={() => this.submit()}
                            style={{flexDirection: "row"}}
                            block light>
                            <Text>{strings('profile.save')}</Text>
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
)(Profile);