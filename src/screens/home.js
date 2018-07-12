import React, { Component } from 'react';
import { Picker, Form, Icon } from 'native-base';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";
import axios from "axios";
import {SERVER_URL} from "../config";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "key1",
            projects: [],
            isLoading: true,
            error: false
        };
    }
    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }
    componentDidMount(){
        return axios.get(SERVER_URL+"api/projects").then(response => {
            this.setState({
                projects: response.data,
                isLoading: false
            });
        }).catch(error => {
            this.setState({
                isLoading: false,
                error: "No internet connection"
            });
        });
    }
    render() {

        return (
            <AppTemplate title="Home" navigation={this.props.navigation} activeTab="Home">
                <View style={{padding: 20}}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, paddingLeft: 5, paddingRight: 5, alignItems: 'flex-start' }}>
                            <Form>
                                <Picker
                                    mode="dropdown"
                                    iosHeader="Select your SIM"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
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
                            <Icon style={{fontSize: 35}} name='ios-search' />
                        </View>
                    </View>
                    <Transition appear="horizontal" disappear="horizontal">
                        {this.state.isLoading? (
                            <View>
                                <ActivityIndicator size="large" color="#000000" />
                            </View>
                        ) : (
                            <View>
                                {this.state.projects.map((project) => (
                                    <TouchableOpacity
                                        key={project.id}
                                        onPress={() => this.props.navigation.navigate("Project", {...project, user_name: project.user.name, user_img: project.user.img})}
                                    >
                                        <ProjectCard key={project.id} {...project} user_name={project.user.name} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </Transition>

                </View>
            </AppTemplate>
        );
    }
}
