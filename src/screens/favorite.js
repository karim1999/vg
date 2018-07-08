import React, { Component } from 'react';
import { Picker, Form } from 'native-base';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";

export default class Favorite extends Component {
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
            <AppTemplate title="Favorite" navigation={this.props.navigation} activeTab="Favorite">
                <Transition appear="horizontal" disappear="horizontal">
                    <View>
                        <ProjectCard />
                        <ProjectCard />
                        <ProjectCard />
                        <ProjectCard />
                    </View>
                </Transition>
            </AppTemplate>
        );
    }
}