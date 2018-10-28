import React, { Component } from 'react';
import {ListItem, List, Left, Thumbnail, Body, Text, Right, Segment, Button} from 'native-base';
import AppTemplate from './../components/appTemplate';
import {FlatList, View} from "react-native";
import {setUser} from "../reducers";
import {connect} from "react-redux";
import {SERVER_URL, STORAGE_URL} from "../config";
import { strings } from '../i18n';
import I18n from "../i18n";
import firebaseApp from "./../firebaseDb";
import _ from "lodash";
let firebaseDb= firebaseApp.database();

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "key1",
            tab: 1,
            users: [],
            isLoading: false
        };
    }
    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }
    componentDidMount(){
        this.setState({
            isLoading: true
        });
        firebaseDb.ref('/private/').on('value', snapshot => {
            let data= _.chain(snapshot.val()).map((value, key) => {
                return {...value, key};
            }).filter(chat => {
                return (chat.user_id == this.props.user.id) || (chat.other_id == this.props.user.id)
            }).value();
            this.setState({
                users: data
            })
        });
        this.setState({
            isLoading: false
        });
    }
    render() {

        return (
            <AppTemplate title={strings("chat.messages")} navigation={this.props.navigation} activeTab="Chat">
                <View style={{padding: 10}}>
                    <Segment>
                        <Button style={{
                            backgroundColor: this.state.tab === 2 ? "#000" : undefined,
                            borderColor: "#000",
                        }}
                                active={this.state.tab === 2} first onPress={() => this.setState({tab: 2})}><Text style={{color: this.state.tab === 2 ? "white" : '#000'}}>Users</Text></Button>
                        <Button
                            style={{
                                backgroundColor: this.state.tab === 1 ? "#000" : undefined,
                                borderColor: "#000",
                            }} active={this.state.tab === 1} last  onPress={() => this.setState({tab: 1})}><Text style={{color: this.state.tab === 1 ? "white" : '#000'}}>Groups</Text></Button>
                    </Segment>
                    {this.state.tab === 1? (
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
                    ): (
                        <List>
                            <FlatList
                                ListEmptyComponent={
                                    <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>{strings("home.notFound")}</Text>
                                }
                                data={this.state.users}
                                renderItem={({item}) => (
                                    <ListItem
                                        noBorder
                                        onPress={()=> this.props.navigation.navigate("SingleUserChat", {id: (this.props.user.id == item.user_id) ? item.other_id : item.user_id, title: (this.props.user.id == item.user_id) ? item.other_name : item.user_name, img: (this.props.user.id == item.user_id) ? item.other_img : item.user_img})}
                                        avatar>
                                        <Left>
                                            <Thumbnail small source={{uri: (this.props.user.id == item.user_id) ? STORAGE_URL+item.other_img : STORAGE_URL+item.user_img}} />
                                        </Left>
                                        <Body>
                                        <Text>{(this.props.user.id == item.user_id) ? item.other_name : item.user_name}</Text>
                                        {/*<Text note>{_.truncate(item.description)}</Text>*/}
                                        </Body>
                                        <Right>
                                            {/*<Text note>3:43 pm</Text>*/}
                                        </Right>
                                    </ListItem>
                                )}
                                keyExtractor = { (item, index) => index.toString() }
                            />
                        </List>
                    )}
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
