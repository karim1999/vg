import React, { Component } from 'react';
import {ListItem, List, Left, Thumbnail, Body, Text, Right} from 'native-base';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";
import {View} from "react-native";
import {setUser} from "../reducers";
import {connect} from "react-redux";
import {SERVER_URL} from "../config";

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
            <AppTemplate title="Messages" navigation={this.props.navigation} activeTab="Chat">
                <View style={{padding: 10}}>
                    <Transition appear="horizontal" disappear="horizontal">
                        <View>
                            <ListItem avatar
                                      onPress={() => this.props.navigation.navigate("SingleChat", {id: 0, title: "Public Chat", user_id: this.props.user.id, user_name: this.props.user.name, user_img: this.props.user.img})}
                                      style={{padding: 10, marginLeft: 0}}
                            >
                                <Left>
                                    <Thumbnail source={require("./../images/profile.jpg")} />
                                </Left>
                                <Body>
                                <Text>Public Chat</Text>
                                <Text note>Chat for everybody</Text>
                                </Body>
                                <Right>
                                    <Text note></Text>
                                </Right>
                            </ListItem>
                            {this.props.jointProjects.map((project) => (
                                <ListItem avatar
                                          key={project.id}
                                          onPress={() => this.props.navigation.navigate("SingleChat", {...project, user_id: this.props.user.id, user_name: this.props.user.name, user_img: this.props.user.img})}
                                          style={{padding: 10, marginLeft: 0}}
                                >
                                    <Left>
                                        <Thumbnail source={{uri: SERVER_URL+"storage/"+project.img}} />
                                    </Left>
                                    <Body>
                                    <Text>{project.title}</Text>
                                    <Text note>created by: {project.user.name}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{project.created_at}</Text>
                                    </Right>
                                </ListItem>
                            ))}

                        </View>
                    </Transition>
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