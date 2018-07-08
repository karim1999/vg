import React, { Component } from 'react';
import { Picker, Form } from 'native-base';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "key1"
        };
    }
    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }
    render() {

        return (
            <AppTemplate title="Home" navigation={this.props.navigation} activeTab="Home">
                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, paddingLeft: 5, paddingRight: 5, alignItems: 'flex-start' }}>
                        <Form>
                            <Picker
                                mode="dropdown"
                                iosHeader="Select your SIM"
                                iosIcon={<IonicIcon name="ios-arrow-down-outline" />}
                                style={{ width: 130 }}
                                selectedValue={this.state.selected}
                                onValueChange={this.onValueChange.bind(this)}
                            >
                                <Picker.Item label="Wallet" value="key0" />
                                <Picker.Item label="ATM Card" value="key1" />
                                <Picker.Item label="Debit Card" value="key2" />
                                <Picker.Item label="Credit Card" value="key3" />
                                <Picker.Item label="Net Banking" value="key4" />
                            </Picker>
                        </Form>
                    </View>
                    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, padding: 5, alignItems: 'flex-end', width: 200 }}>
                        <IonicIcon name='ios-search' size={33} />
                    </View>
                </View>
                <Transition appear="horizontal" disappear="horizontal">
                    <View>
                        <ProjectCard />
                        <ProjectCard />
                        <ProjectCard />
                    </View>
                </Transition>
            </AppTemplate>
        );
    }
}