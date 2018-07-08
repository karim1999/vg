import React from "react";
import {TouchableOpacity, View, ImageBackground, TouchableNativeFeedback} from "react-native";
import { Container, Content, Text, List, ListItem, Left, Body, Right, Thumbnail, H2 } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';

const routes = [
    {
        text: "Home",
        icon: "home",
        name: "Home"
    },
    {
        text: "Favorites",
        icon: "heart",
        name: "Favorite"
    },
    {
        text: "Messages",
        icon: "wechat",
        name: "Chat"
    },
    {
        text: "Settings",
        icon: "cogs",
        name: "Settings"
    },
    {
        text: "About",
        icon: "info-circle",
        name: "info-circle"
    },
];

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <Container style={{ backgroundColor: "#FFFFFF" }}>
                <ImageBackground source={require("./../images/img1.jpg")} style={{ width: "100%", height: 200 }}>
                    <View style={{  width: "100%", height: 200, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', alignItems: 'center' }}>
                        <Thumbnail large source={require("./../images/profile.jpg")} />
                        <H2 style={{ color: "#FFFFFF" }}>Karim Mahmoud</H2>
                    </View>
                </ImageBackground>
                <Content style={{ marginTop: 20 }}>
                    <List>
                        {
                            routes.map((route) => {
                                return (
                                    <TouchableNativeFeedback key={route.name} onPress={() => this.props.navigation.navigate(route.name)}>
                                        <ListItem style={{ marginTop: 20 }} icon>
                                            <Left>
                                                <Icon size={25} color="#000000" active name={route.icon} />
                                            </Left>
                                            <Body>
                                            <Text>{route.text}</Text>
                                            </Body>
                                            <Right>
                                                <IonicIcon size={25} name="ios-arrow-forward" />
                                            </Right>
                                        </ListItem>
                                    </TouchableNativeFeedback>
                                );
                            })
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}
