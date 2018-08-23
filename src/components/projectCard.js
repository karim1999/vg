import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, AsyncStorage, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {Button, Text, Left, Body, Card, CardItem, Right, Toast} from 'native-base';
import {SERVER_URL, STORAGE_URL} from "../config";
import {setUser} from "../reducers";
import {connect} from "react-redux";
import _ from "lodash";
import axios from "axios";

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isFavored: false
        };
    }
    addToFavorites(){
        this.setState({
            isLoading: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.post(SERVER_URL+'api/favorites/'+this.props.id+'?token='+userToken).then(response => {
                this.setState({
                    isLoading: false,
                    isFavored: true,
                });
                this.props.setUser(response.data);
            }).catch(error => {
                this.setState({
                    isLoading: false,
                });
                Toast.show({
                    text: "Error reaching the server.",
                    buttonText: "Ok",
                    type: "danger"
                })
            })
        });
    }
    removeFromFavorites(){
        this.setState({
            isLoading: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.delete(SERVER_URL+'api/favorites/'+this.props.id+'?token='+userToken).then(response => {
                this.setState({
                    isLoading: false,
                    isFavored: false,
                });
                this.props.setUser(response.data);
            }).catch(error => {
                this.setState({
                    isLoading: false,
                });
                Toast.show({
                    text: "Error reaching the server.",
                    buttonText: "Ok",
                    type: "danger"
                })
            })
        });
    }
    render() {
        return (
            <Card style={{flex: 0}}>
                <CardItem>
                    <Left>
                        <Image source={require("./../images/logo.png")} style={{ width: 100, height: 25 }} />
                    </Left>
                    {

                    }
                    {this.state.isLoading? (
                        <Right>
                            <ActivityIndicator color="#000000" />
                        </Right>
                    ): (
                        <Right>
                            {_.find(this.props.favorites, project => project.id == this.props.id)? (
                                <TouchableOpacity
                                    onPress={() => this.removeFromFavorites()}
                                >
                                    <Icon name="heart" color="#bb0000" size={25} />
                                </TouchableOpacity>
                            ): (
                                <TouchableOpacity
                                    onPress={() => this.addToFavorites()}
                                >
                                    <Icon name="heart-outlined" color="#000000" size={25} />
                                </TouchableOpacity>
                            )}
                        </Right>
                    )}
                </CardItem>
                <CardItem style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <Body>
                    <Image source={{uri: STORAGE_URL+this.props.img}} style={{height: 200, width: '100%'}}/>
                    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={{ fontSize: 20, marginTop: 10 }}>
                            {this.props.title}
                        </Text>
                        <Text>
                            {_.truncate(this.props.description)}
                        </Text>
                    </View>
                    </Body>
                </CardItem>
                <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Left>
                        <Button transparent textStyle={{color: '#87838B'}}>
                            <Icon name="back-in-time" />
                            <Text>{this.props.created_at}</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent textStyle={{color: '#87838B'}}>
                            <Icon name="user" />
                            <Text>{this.props.user_name}</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({

});
const mapStateToProps = ({ user }) => ({
    user,
    favorites: user.favorites,
    myProjects: user.projects
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectCard);