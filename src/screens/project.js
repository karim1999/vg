import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {AsyncStorage, Image, View} from 'react-native';
import {Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Toast} from 'native-base';
import {SERVER_URL} from "../config";
import NumericInput from 'react-native-numeric-input'
import {setUser} from "../reducers";
import {connect} from "react-redux";
import axios from "axios";
import _ from "lodash";

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            isInvesting: false,
            investmentAmount: 50000,
            isLoading: false
        };
    }
    investInProject(){
        this.setState({
            isLoading: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.post(SERVER_URL+'api/invest/'+this.state.id+'?token='+userToken, {amount: this.state.investmentAmount}).then(response => {
                this.setState({
                    isLoading: false,
                    isInvesting: true
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
    cancelInvestmentInProject(){
        this.setState({
            isLoading: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.delete(SERVER_URL+'api/invest/'+this.state.id+'?token='+userToken).then(response => {
                this.setState({
                    isLoading: false,
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
            <AppTemplate right={true} title={this.state.title} backButton={true} navigation={this.props.navigation} activeTab="Home">
                {_.find(this.props.jointProjects, project => project.id == this.state.id)? (
                    <Button
                        onPress={() => this.props.navigation.navigate("SingleChat", {id: this.state.id, amount: this.state.amount, title: this.state.title, user_id: this.props.user.id, user_name: this.props.user.name, user_img: this.props.user.img})}
                        style={{width: "100%", alignItems: "center"}} light><Text style={{flex: 1}}> Open this project chat now. </Text>
                        <Icon name="ios-chatboxes" style={{color: "#000000", fontSize: 25}}/>
                    </Button>
                ) : (
                    <Button onPress={() => this.setState({isInvesting: !this.state.isInvesting})} style={{width: "100%", alignItems: "center"}} primary><Text style={{flex: 1}}> Invest in this project now. </Text>
                        <Icon name={this.state.isInvesting? "ios-arrow-dropup-circle": "ios-arrow-dropdown-circle"} style={{color: "#FFFFFF", fontSize: 25}}/>
                    </Button>
                )}
                {this.state.isInvesting && (
                    <View style={{padding: 10, paddingTop: 20, backgroundColor: "#000000", justifyContent: "center", alignItems: "center"}}>
                        <NumericInput
                            value={this.state.investmentAmount}
                            onChange={investmentAmount => this.setState({investmentAmount})}
                            totalWidth={220}
                            totalHeight={40}
                            iconSize={20}
                            step={50000}
                            minValue={50000}
                            maxValue={Number(this.props.user.money)}
                            valueType='real'
                            rounded
                            textColor='#FFFFFF'
                            iconStyle={{ color: '#000000' }}
                            rightButtonBackgroundColor='#FFFFFF'
                            leftButtonBackgroundColor='#FFFFFF'/>
                        <Button style={{marginTop: 20}} onPress={()=> {this.investInProject()}} block light>
                            <Text>Invest in this project</Text>
                        </Button>
                    </View>
                )}
                <View style={{padding: 20}}>
                    <Card style={{flex: 0}}>
                        <CardItem style={{ paddingBottom: 5 }}>
                            <Left>
                                <Thumbnail source={{uri: SERVER_URL+"storage/"+this.state.user_img}} />
                                <Body>
                                <Text>{this.state.user_name}</Text>
                                <Text note>{this.state.created_at}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem style={{ paddingTop: 0 }}>
                            <Body>
                            <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>
                                {this.state.title}
                                </Text>
                            <Text style={{ fontSize: 15, marginBottom: 10 }}>
                                {this.state.description}
                                </Text>
                            <Image source={{uri: SERVER_URL+"storage/"+this.state.img}} style={{height: 250, width: "100%", flex: 1}}/>
                            <View style={{ marginTop: 10, flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 17 }}> Total Money Needed: </Text>
                                <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 13, fontWeight: "bold" }}> {this.state.amount}$ </Text></Button>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                <Text style={{ fontSize: 17 }}> Total Money Collected: </Text>
                                <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 13, fontWeight: "bold" }}> {this.state.amount}$ </Text></Button>
                            </View>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{color: '#87838B'}}>
                                    <Icon type="MaterialCommunityIcons" name="presentation-play"  />
                                    <Text>Presentation</Text>
                                </Button>
                            </Left>
                            <Right>
                                <Button transparent textStyle={{color: '#87838B'}}>
                                    <Icon type="FontAwesome" name="file-text-o" />
                                    <Text>Report</Text>
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                </View>
            </AppTemplate>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    user,
    favorites: user.favorites,
    jointProjects: user.jointprojects
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);