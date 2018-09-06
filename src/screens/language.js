import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Button, Text, ListItem, Left, Right, Radio, Toast} from 'native-base';
import {ActivityIndicator, AsyncStorage, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios";
import {strings} from "../i18n";
import I18n from "../i18n";

export default class Language extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            lang: "en",
            confirm: ""
        };
    }
    componentDidMount(){
        AsyncStorage.getItem('lang').then(lang => {
            if(lang){
                this.setState({
                    lang,
                });
            }else{
                this.setState({
                    lang: "en"
                });
            }
        }).catch(error => {
            this.setState({
                lang: "en"
            });
        })
    }
    submit(){
        this.setState({
            isLoading: true,
        });
        let item= this.storeItem('lang', this.state.lang);
        this.setState({
            isLoading: false,
        });
        Toast.show({
            text: "تم تغيير اللغة بنجاح. يجب اعادة فتح التطبيق حتي يتم تطبيق الاعدادات الجديدة.",
            buttonText: strings("messages.ok"),
            type: "success",
            duration: 5000
        })
    }
    async storeItem(key, item) {
        try {
            let jsonOfItem = await AsyncStorage.setItem(key, item);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
    render() {

        return (
            <AppTemplate title={strings('settings.language')} backButton={true} navigation={this.props.navigation} activeTab="Settings">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        <ListItem
                            onPress={(lang) => {this.setState({lang: "ar"})}}
                        >
                            <Left>
                                <Text>العربية</Text>
                            </Left>
                            <Right>
                                <Radio selected={this.state.lang === "ar"}
                                       onPress={(lang) => {this.setState({lang: "ar"})}}
                                />
                            </Right>
                        </ListItem>
                        <ListItem
                            onPress={(lang) => {this.setState({lang: "en"})}}
                        >
                            <Left>
                                <Text>English</Text>
                            </Left>
                            <Right>
                                <Radio selected={this.state.lang === "en"}
                                       onPress={(lang) => {this.setState({lang: "en"})}}
                                />
                            </Right>
                        </ListItem>
                        <Button
                            onPress={() => this.submit()}
                            style={{flexDirection: "row"}}
                            block light>
                            <Text>{ strings('password.change') }</Text>
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