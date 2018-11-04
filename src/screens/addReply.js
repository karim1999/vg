import React from "react";
import {View, ImageBackground, AsyncStorage, TouchableOpacity, ActivityIndicator, FlatList} from "react-native";
import {
    Container,
    Content,
    Text,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    H2,
    Toast,
    Form,
    Item, Label, Input, Icon, Button
} from "native-base";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {SERVER_URL, STORAGE_URL} from "../config";
import AppTemplate from './../components/appTemplate';
import ImagePicker from 'react-native-image-picker';
import axios from "axios";
import { strings } from '../i18n';
import I18n from "../i18n";
import _ from "lodash";
import firebaseApp from "./../firebaseDb";
let firebaseDb= firebaseApp.database();

class Replies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            replies: [],
            isLoading: false,
            message: "",
            reply: ""
        };
    }
    async submit(){
        this.setState({
            isLoading: true
        });
        await firebaseDb.ref('/replies/'+this.state.id).push({
            message: this.state.message,
            reply: this.state.reply
        });
        this.setState({
            isLoading: false
        });
        this.props.navigation.goBack();
    }
    render() {
        return (
            <AppTemplate back title={strings("chat.automatic")} navigation={this.props.navigation} activeTab="Notifications">
                <View style={{padding: 5, margin: 20, backgroundColor: "#FFFFFF"}}>
                    <Form>
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='ios-chatbubbles' />
                                    <Label>{ strings('chat.message') }</Label>
                                    <Input onChangeText={(message) => this.setState({message})}
                                           value={this.state.message}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input style={{textAlign: "right"}} onChangeText={(message) => this.setState({message})}
                                           value={this.state.message}
                                    />
                                    <Label>{ strings('chat.message') }</Label>
                                    <Icon name='ios-chatbubbles' />
                                </Item>
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <Item style={{height: 70}}>
                                    <Icon name='reply' type="Entypo" />
                                    <Label>{ strings('chat.reply') }</Label>
                                    <Input onChangeText={(reply) => this.setState({reply})}
                                           value={this.state.reply}
                                    />
                                </Item>
                            ) : (
                                <Item style={{height: 70}}>
                                    <Input style={{textAlign: "right"}} onChangeText={(reply) => this.setState({reply})}
                                           value={this.state.reply}
                                    />
                                    <Label>{ strings('chat.reply') }</Label>
                                    <Icon name='reply' type="Entypo" />
                                </Item>
                            )
                        }
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
const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Replies);
