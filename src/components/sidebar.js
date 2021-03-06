import React from "react";
import {View, ImageBackground, AsyncStorage, ScrollView} from "react-native";
import { Container, Content, Text, List, ListItem, Left, Body, Right, Thumbnail, H2 } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {SERVER_URL, STORAGE_URL} from "../config";
import {strings} from "../i18n";
import I18n from "../i18n";

const routes = [
    {
        text: "home",
        icon: "home",
        name: "Home"
    },
    {
        text: "favorites",
        icon: "heart",
        name: "Favorite"
    },
    {
        text: "messages",
        icon: "wechat",
        name: "Chat"
    },
    {
        text: "settings",
        icon: "cogs",
        name: "Settings"
    }
];

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    logout(){
        return AsyncStorage.removeItem('token').then(()=>{
            this.props.navigation.navigate('Auth');
        });
    }
    action(name){
        this.props.closeDrawer();
        this.props.navigation.navigate(name);
    }
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
                <ImageBackground source={require("./../images/background.png")} style={{ width: "100%", height: 200 }}>
                    <View style={{  width: "100%", height: 200, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', alignItems: 'center' }}>
                        <Thumbnail large source={{uri: STORAGE_URL+this.props.user.img}} />
                        <H2 style={{ color: "#FFFFFF" }}>{this.props.user.name}</H2>
                    </View>
                </ImageBackground>
                <View style={{ marginTop: 20, flex: 1 }}>
                    <List>
                        {
                            routes.map((route) => (
                                    (I18n.locale !== "ar") ? (
                                        <ListItem style={{ marginTop: 10, marginBottom: 10 }}
                                                  key={route.name}
                                                  onPress={() => this.action(route.name)}
                                                  icon>
                                            <Left>
                                                <Icon size={25} color="#000000" active name={route.icon} />
                                            </Left>
                                            <Body>
                                            <Text>{ strings('sidebar.'+route.text) }</Text>
                                            </Body>
                                            <Right>
                                                <IonicIcon size={25} name="ios-arrow-forward" />
                                            </Right>
                                        </ListItem>
                                    ) : (
                                        <ListItem style={{ marginTop: 10, marginBottom: 10 }}
                                                  key={route.name}
                                                  onPress={() => this.action(route.name)}
                                                  icon>
                                            <Left>
                                                <IonicIcon size={25} name="ios-arrow-back" />
                                            </Left>
                                            <Body>
                                            <Text style={{textAlign: "right"}}>{ strings('sidebar.'+route.text) }</Text>
                                            </Body>
                                            <Right>
                                                <Icon size={25} color="#000000" active name={route.icon} />
                                            </Right>
                                        </ListItem>
                                    )
                                )
                            )
                        }
                        {
                            (I18n.locale !== "ar") ? (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                          onPress={() => this.logout()}
                                >
                                    <Left>
                                        <IonicIcon size={25} color="#000000" active name="ios-log-out" />
                                    </Left>
                                    <Body>
                                    <Text>{ strings('sidebar.logout') }</Text>
                                    </Body>
                                    <Right>
                                        <IonicIcon size={25} name="ios-arrow-forward" />
                                    </Right>
                                </ListItem>
                            ) : (
                                <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }} icon
                                          onPress={() => this.logout()}
                                >
                                    <Left>
                                        <IonicIcon size={25} name="ios-arrow-back" />
                                    </Left>
                                    <Body>
                                    <Text style={{textAlign: "right"}}>{ strings('sidebar.logout') }</Text>
                                    </Body>
                                    <Right>
                                        <IonicIcon size={25} color="#000000" active name="ios-log-out" />
                                    </Right>
                                </ListItem>
                            )
                        }
                    </List>
                </View>
            </ScrollView>
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
)(SideBar);
