import React, { Component } from 'react';
import {ListItem, List, Left, Thumbnail, Body, Text, Right} from 'native-base';
import AppTemplate from './../components/appTemplate';
import {View} from "react-native";
import {setUser} from "../reducers";
import {connect} from "react-redux";
import {SERVER_URL, STORAGE_URL} from "../config";
import { strings } from '../i18n';
import I18n from "../i18n";

class Chat extends Component {
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
            <AppTemplate title={strings("chat.messages")} navigation={this.props.navigation} activeTab="Chat">
                <View style={{padding: 10}}>
                    <View>
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem avatar
                                          onPress={() => this.props.navigation.navigate("SingleChat", {id: 0, title: strings("chat.public"), user_id: 0, user_name: this.props.user.name, user_img: this.props.user.img})}
                                          style={{padding: 10, marginLeft: 0}}
                                >
                                    <Left>
                                        <Thumbnail square source={require("./../images/logo-edited.png")} small />
                                    </Left>
                                    <Body>
                                    <Text>{strings("chat.public")}</Text>
                                    <Text note>{strings("chat.publicDescription")}</Text>
                                    </Body>
                                    <Right>
                                        <Text note></Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem avatar
                                          onPress={() => this.props.navigation.navigate("SingleChat", {id: 0, title: strings("chat.public"), user_id: 0, user_name: this.props.user.name, user_img: this.props.user.img})}
                                          style={{padding: 10, marginLeft: 0}}
                                >
                                    <Left>
                                    </Left>
                                    <Body>
                                    <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{strings("chat.public")}</Text>
                                    <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]} note>{strings("chat.publicDescription")}</Text>
                                    </Body>
                                    <Right>
                                        <Thumbnail square source={require("./../images/logo-edited.png")} small />
                                    </Right>
                                </ListItem>
                            )
                        }
                        {this.props.jointProjects.map((project) => (
                            (I18n.locale !== "ar") ? (
                                <ListItem avatar
                                          key={project.id}
                                          onPress={() => this.props.navigation.navigate("SingleChat", {...project, user_name: project.user.name, user_img: project.user.img, user_id: project.user.id})}
                                          style={{padding: 10, marginLeft: 0}}
                                >
                                    <Left>
                                        <Thumbnail source={{uri: STORAGE_URL+project.img}} small />
                                    </Left>
                                    <Body>
                                    <Text>{project.title}</Text>
                                    <Text note>{strings("chat.created_by")} {project.user.name}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{project.created_at}</Text>
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem avatar
                                          key={project.id}
                                          onPress={() => this.props.navigation.navigate("SingleChat", {...project, user_name: project.user.name, user_img: project.user.img, user_id: project.user.id})}
                                          style={{padding: 10, marginLeft: 0}}
                                >
                                    <Left>
                                        <Text note>{project.created_at}</Text>
                                    </Left>
                                    <Body>
                                    <Text style={{textAlign: "right"}}>{project.title}</Text>
                                    <Text style={{textAlign: "right"}} note>{strings("chat.created_by")} {project.user.name}</Text>
                                    </Body>
                                    <Right>
                                        <Thumbnail source={{uri: STORAGE_URL+project.img}} small />
                                    </Right>
                                </ListItem>
                                )
                        ))}

                    </View>
                </View>
            </AppTemplate>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    user,
    jointProjects: user.jointprojects
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
