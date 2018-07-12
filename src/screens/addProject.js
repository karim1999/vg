import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {Form, Item, Input, Label, Icon, Picker} from 'native-base';
import {Slider, View} from "react-native";

export default class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected2: undefined
        };
    }
    onValueChange2(value: string) {
        this.setState({
            selected2: value
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
                            <Input/>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='info' />
                            <Label>Description:</Label>
                            <Input multiline = {true}
                                   numberOfLines = {10}
                            />
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon name='md-images' />
                            <Label>Image:</Label>
                            <Input/>
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
                                selectedValue={this.state.selected2}
                                onValueChange={this.onValueChange2.bind(this)}
                            >
                                <Picker.Item label="Wallet" value="key0" />
                                <Picker.Item label="ATM Card" value="key1" />
                                <Picker.Item label="Debit Card" value="key2" />
                                <Picker.Item label="Credit Card" value="key3" />
                                <Picker.Item label="Net Banking" value="key4" />
                            </Picker>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='money' />
                            <Label>Money needed:</Label>
                            <Slider style={{flex: 1}} step={5000} maximumValue={1000000} minimumValue={5000}/>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="MaterialCommunityIcons" name='presentation-play' />
                            <Label>Presentation:</Label>
                            <Input/>
                        </Item>
                        <Item style={{height: 70}}>
                            <Icon type="FontAwesome" name='file-text' />
                            <Label>Report:</Label>
                            <Input/>
                        </Item>
                    </Form>
                </View>
            </AppTemplate>
        );
    }
}