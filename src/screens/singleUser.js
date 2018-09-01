import React, { Component } from 'react';
import {Linking, Text, View} from "react-native";
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

class SingleUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            user: []
        };
    }
    render() {
        return (
            <AppTemplate right={true} backButton={true} navigation={this.props.navigation}>

            </AppTemplate>

        );
    }
}
