import React, { Component } from 'react';
import {ListItem, List, Left, Thumbnail, Body, Text, Right} from 'native-base';
import AppTemplate from './../components/appTemplate';
import {View} from "react-native";
import {setUser} from "../reducers";
import {connect} from "react-redux";
import {SERVER_URL, STORAGE_URL} from "../config";
import { strings } from '../i18n';

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
                        <ListItem avatar
                                  onPress={() => this.props.navigation.navigate("SingleChat", {id: 0, title: strings("chat.public"), user_id: this.props.user.id, user_name: this.props.user.name, user_img: this.props.user.img})}
                                  style={{padding: 10, marginLeft: 0}}
                        >
                            <Left>
                                <Thumbnail source={require("./../images/profile.jpg")} />
                            </Left>
                            <Body>
                            <Text>{strings("chat.public")}</Text>
                            <Text note>{strings("chat.publicDescription")}</Text>
                            </Body>
                            <Right>
                                <Text note></Text>
                            </Right>
                        </ListItem>
                        {this.props.jointProjects.map((project) => (
                            <ListItem avatar
                                      key={project.id}
                                      onPress={() => this.props.navigation.navigate("SingleChat", {...project})}
                                      style={{padding: 10, marginLeft: 0}}
                            >
                                <Left>
                                    <Thumbnail source={{uri: STORAGE_URL+project.img}} />
                                </Left>
                                <Body>
                                <Text>{project.title}</Text>
                                <Text note>{strings("chat.created_by")} {project.user.name}</Text>
                                </Body>
                                <Right>
                                    <Text note>{project.created_at}</Text>
                                </Right>
                            </ListItem>
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