import React from "react";
import {View, ImageBackground, AsyncStorage, TouchableOpacity, Linking, ActivityIndicator} from "react-native";
import {
    Container,
    Content,
    Text,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Icon,
    Thumbnail,
    H2,
    Toast,
    Button
} from "native-base";
import {SERVER_URL, STORAGE_URL} from "../config";
import AppTemplate from './../components/appTemplate';
import ImagePicker from 'react-native-image-picker';
import axios from "axios";
import { strings } from '../i18n';
import I18n from "../i18n";
import _ from 'lodash';
import {connect} from "react-redux";
import {setUser} from "../reducers";

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            id: this.props.navigation.state.params.id,
            user: [],
            isFollowed: false
        };
    }
    componentDidMount(){
        return axios.get(SERVER_URL+'api/users/'+this.state.id).then(response => {
            this.setState({
                user: response.data
            });
        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        }).then(() => {
            this.setState({
                isLoading: false
            });
        })
    }
    addToFollows(){
        this.setState({
            isFollowed: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.post(SERVER_URL+'api/follow/'+this.state.id+'?token='+userToken).then(response => {
                this.setState({
                    isFollowed: false,
                });
                this.props.setUser(response.data);
            }).catch(error => {
                this.setState({
                    isFollowed: false,
                });
                Toast.show({
                    text: strings("messages.noInternet"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            })
        });
    }
    removeFromFollows(){
        this.setState({
            isFollowed: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.delete(SERVER_URL+'api/unfollow/'+this.state.id+'?token='+userToken).then(response => {
                this.setState({
                    isFollowed: false,
                });
                this.props.setUser(response.data);
            }).catch(error => {
                this.setState({
                    isFollowed: false,
                });
                Toast.show({
                    text: strings("messages.noInternet"),
                    buttonText: strings("messages.ok"),
                    type: "danger"
                })
            })
        });
    }

    render() {
        return (
            (this.state.isLoading)? (
                <AppTemplate backButton title={strings("settings.user")} navigation={this.props.navigation} activeTab="Settings">
                    <ActivityIndicator size="large" color="#000000" />
                </AppTemplate>
            ):(
                <AppTemplate edit={this.props.user.id == this.state.id} backButton title={strings("settings.user")} navigation={this.props.navigation} activeTab="Settings">
                    <ImageBackground source={require("./../images/background.png")} style={{ width: "100%", height: 300 }}>
                        <View style={{  width: "100%", height: 300, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                            >
                                <Thumbnail large source={{uri: STORAGE_URL+this.state.user.img}} />
                            </TouchableOpacity>
                            <H2 style={{ color: "#FFFFFF" }}>{this.state.user.name}</H2>
                            {
                                this.props.user.id != this.state.id && (
                                    <View style={{flexDirection: "row", justifyContent: "center", marginTop: 20}}>
                                        <Button onPress={()=>this.props.navigation.navigate("SingleUserChat", {id: this.state.id, title: this.state.user.name, img: this.state.user.img})} success style={{marginRight: 10}} iconLeft rounded><Icon style={{color: "white"}} type="Entypo" name='chat' /><Text>Chat</Text></Button>
                                        {
                                            !_.find(this.props.user.follows, user => user.id == this.state.id)? (
                                                <Button onPress={()=> this.addToFollows()} primary style={{marginLeft: 10}} iconRight rounded><Text>Follow</Text>
                                                    {this.state.isFollowed ? (
                                                        <ActivityIndicator color="white"/>
                                                    ) : (
                                                        <Icon style={{color: "white"}} type="FontAwesome" name='user-plus' />
                                                    )}
                                                    </Button>
                                            ) : (
                                                <Button onPress={()=> this.removeFromFollows()} warning style={{marginLeft: 10}} iconRight rounded><Text>Unfollow</Text>
                                                    {this.state.isFollowed ? (
                                                        <ActivityIndicator color="white"/>
                                                    ): (
                                                        <Icon style={{color: "white"}} type="FontAwesome" name='user-times' />
                                                    )}
                                                </Button>
                                            )
                                        }
                                    </View>
                                )
                            }
                        </View>
                    </ImageBackground>
                    <Content style={{ padding: 20, backgroundColor: "white" }}>
                        <List>
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="user" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{this.state.user.name}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{this.state.user.name}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{this.state.user.name}</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{this.state.user.name}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="user" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="envelope" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{_.truncate(this.state.user.email)}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{_.truncate(this.state.user.email)}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{_.truncate(this.state.user.email)}</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{_.truncate(this.state.user.email)}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="envelope" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="globe" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{this.state.user.country}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{this.state.user.country}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{this.state.user.country}</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{this.state.user.country}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="globe" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="address-book" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{this.state.user.city}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{this.state.user.city}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{this.state.user.city}</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{this.state.user.city}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="address-book" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="phone" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{this.state.user.phone}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{this.state.user.phone}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{this.state.user.phone}</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{this.state.user.phone}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="phone" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="money" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{this.state.user.money}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{this.state.user.money}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{this.state.user.money} $</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{this.state.user.money}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="money" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                            {
                                (this.state.user.facebook) && (
                                    (I18n.locale !== "ar") ? (
                                        <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                        >
                                            <Left style={{flex: 1}}>
                                                <Icon type="FontAwesome" size={25} color="#000000" active name="facebook" />
                                            </Left>
                                            <Body style={{flex: 99, marginLeft: 10}}>
                                            <Text
                                                onPress={() => Linking.openURL(this.state.user.facebook)}
                                            >{this.state.user.facebook}</Text>
                                            </Body>
                                            {/*<Right>*/}
                                                {/*<Text*/}
                                                    {/*onPress={() => Linking.openURL(this.state.user.facebook)}*/}
                                                {/*>{this.state.user.facebook}</Text>*/}
                                            {/*</Right>*/}
                                        </ListItem>
                                    ) : (
                                        <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                        >
                                            {/*<Left>*/}
                                                {/*<Text*/}
                                                    {/*onPress={() => Linking.openURL(this.state.user.facebook)}*/}
                                                {/*>{this.state.user.facebook}</Text>*/}
                                            {/*</Left>*/}
                                            <Body>
                                            <Text
                                                onPress={() => Linking.openURL(this.state.user.facebook)}
                                            >{this.state.user.facebook}</Text>
                                            </Body>
                                            <Right>
                                                <Icon type="FontAwesome" size={25} color="#000000" active name="facebook" />
                                            </Right>
                                        </ListItem>
                                    )
                                )
                            }
                            {
                                (this.state.user.twitter) && (
                                    (I18n.locale !== "ar") ? (
                                        <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                        >
                                            <Left style={{flex: 1}}>
                                                <Icon type="FontAwesome" size={25} color="#000000" active name="twitter" />
                                            </Left>
                                            <Body style={{flex: 99, marginLeft: 10}}>
                                            <Text
                                                onPress={() => Linking.openURL(this.state.user.twitter)}
                                            >{this.state.user.twitter}</Text>
                                            </Body>
                                            {/*<Right>*/}
                                                {/*<Text*/}
                                                    {/*onPress={() => Linking.openURL(this.state.user.twitter)}*/}
                                                {/*>{this.state.user.twitter}</Text>*/}
                                            {/*</Right>*/}
                                        </ListItem>
                                    ) : (
                                        <ListItem key="twitter" style={{ marginTop: 10, marginBottom: 10 }}
                                        >
                                            {/*<Left>*/}
                                                {/*<Text*/}
                                                    {/*onPress={() => Linking.openURL(this.state.user.twitter)}*/}
                                                {/*>{this.state.user.twitter}</Text>*/}
                                            {/*</Left>*/}
                                            <Body>
                                            <Text
                                                onPress={() => Linking.openURL(this.state.user.twitter)}
                                            >{this.state.user.twitter}</Text>
                                            </Body>
                                            <Right>
                                                <Icon type="FontAwesome" size={25} color="#000000" active name="twitter" />
                                            </Right>
                                        </ListItem>
                                    )
                                )
                            }
                            {
                                (this.state.user.linkedin) && (
                                    (I18n.locale !== "ar") ? (
                                        <ListItem key="linkedin" style={{ marginTop: 10, marginBottom: 10 }}
                                        >
                                            <Left style={{flex: 1}}>
                                                <Icon type="FontAwesome" size={25} color="#000000" active name="linkedin" />
                                            </Left>
                                            <Body style={{flex: 99, marginLeft: 10}}>
                                            <Text
                                                onPress={() => Linking.openURL(this.state.user.linkedin)}
                                            >{this.state.user.linkedin}</Text>
                                            </Body>
                                            {/*<Right>*/}
                                                {/*<Text*/}
                                                    {/*onPress={() => Linking.openURL(this.state.user.linkedin)}*/}
                                                {/*>{this.state.user.linkedin}</Text>*/}
                                            {/*</Right>*/}
                                        </ListItem>
                                    ) : (
                                        <ListItem key="linkedin" style={{ marginTop: 10, marginBottom: 10 }}
                                        >
                                            {/*<Left>*/}
                                                {/*<Text*/}
                                                    {/*onPress={() => Linking.openURL(this.state.user.linkedin)}*/}
                                                {/*>{this.state.user.linkedin}</Text>*/}
                                            {/*</Left>*/}
                                            <Body>
                                            <Text
                                                onPress={() => Linking.openURL(this.state.user.linkedin)}
                                            >{this.state.user.linkedin}</Text>
                                            </Body>
                                            <Right>
                                                <Icon type="FontAwesome" size={25} color="#000000" active name="linkedin" />
                                            </Right>
                                        </ListItem>
                                    )
                                )
                            }
                            {
                                (I18n.locale !== "ar") ? (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        <Left style={{flex: 1}}>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="info" />
                                        </Left>
                                        <Body style={{flex: 99, marginLeft: 10}}>
                                        <Text>{this.state.user.description}</Text>
                                        </Body>
                                        {/*<Right>*/}
                                            {/*<Text>{this.state.user.description}</Text>*/}
                                        {/*</Right>*/}
                                    </ListItem>
                                ) : (
                                    <ListItem key="logout" style={{ marginTop: 10, marginBottom: 10 }}
                                    >
                                        {/*<Left>*/}
                                            {/*<Text>{this.state.user.description}</Text>*/}
                                        {/*</Left>*/}
                                        <Body>
                                        <Text>{this.state.user.description}</Text>
                                        </Body>
                                        <Right>
                                            <Icon type="FontAwesome" size={25} color="#000000" active name="info" />
                                        </Right>
                                    </ListItem>
                                )
                            }
                        </List>
                    </Content>
                </AppTemplate>
            )
        );
    }
}
const mapStateToProps = ({ user }) => ({
	user,
});

const mapDispatchToProps = {
	setUser
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(User);
