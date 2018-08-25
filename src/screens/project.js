import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {ActivityIndicator, AsyncStorage, Image, View, Linking} from 'react-native';
import {Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Toast} from 'native-base';
import {SERVER_URL, STORAGE_URL} from "../config";
import NumericInput from 'react-native-numeric-input'
import {setUser} from "../reducers";
import {connect} from "react-redux";
import axios from "axios";
import _ from "lodash";
import MultiSelect from "react-native-quick-select";
import {strings} from "../i18n";

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            isInvesting: false,
            investmentAmount: 50000,
            isLoading: false,
            isAddingPeople: false,
            users: [],
            selectedUsers: []
        };
    }
    onSelectedUsersChange = selectedUsers => {
        this.setState({ selectedUsers });
    };
    showInvestmentPanel(){
        this.setState({
            isInvesting: !this.state.isInvesting,
        })
    }
    showAddPanel(){
        this.setState({
            isAddingPeople: !this.state.isAddingPeople,
        })
    }
    investInProject(){
        this.setState({
            isLoading: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.post(SERVER_URL+'api/invest/'+this.state.id+'?token='+userToken, {amount: this.state.investmentAmount}).then(response => {
                this.setState({
                    isLoading: false,
                    isInvesting: false
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
    deleteProject(){
        this.setState({
            isLoading: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            return axios.delete(SERVER_URL+'api/projects/'+this.state.id+'?token='+userToken).then(response => {
                this.setState({
                    isLoading: false,
                });
                this.props.setUser(response.data);
                this.props.navigation.navigate("Home");
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

    openChat(){
        this.props.navigation.navigate("SingleChat", {...this.props.navigation.state.params});
    }
    formatMondey = function(n, c, d, t){
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d == undefined ? "." : d;
        t = t == undefined ? "," : t;
        let s = n < 0 ? "-" : "";
        let i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
        let j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    componentDidMount(){
        this.setState({
            isLoading: true,
        });
        return axios.get(SERVER_URL+"api/users").then(response => {
            this.setState({
                users: response.data,
            });
            return axios.get(SERVER_URL+"api/project/"+this.state.id+'/users').then(response2 => {
                let selectedUsers= _.map(response2.data, 'id');
                this.setState({
                    selectedUsers,
                    isLoading: false,
                });
            }).catch(error => {
                Toast.show({
                    text: strings("messages.noInternet"),
                    buttonText: strings("messages.noInternet"),
                    type: "danger"
                });
                this.setState({
                    isLoading: false,
                });
            })

        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
            });
            this.setState({
                isLoading: false,
            });
        });
    }
    addPeople(){
        this.setState({
            isLoading: true,
        });
        return axios.post(SERVER_URL+"api/project/"+this.state.id+'/link', {
            users: _.join(this.state.selectedUsers, ',')
        }).then(response2 => {
            Toast.show({
                text: "Users were updated successfully.",
                buttonText: strings("messages.ok"),
                type: "success"
            });
            this.setState({
                isLoading: false,
            });
        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.noInternet"),
                type: "danger"
            });
            this.setState({
                isLoading: false,
            });
        })
    }
    render() {
        return (
            <AppTemplate right={true} {...this.props.navigation.state.params} backButton={true} navigation={this.props.navigation} activeTab="Home" investInProject={() => this.showInvestmentPanel()} cancelInvestmentInProject={() => this.cancelInvestmentInProject()} deleteProject={() => this.deleteProject()} project={this.state.id} openChat={() => this.openChat()} addPeople={() => this.showAddPanel()}>
                {_.find(this.props.jointProjects, project => project.id == this.state.id)? (
                    <Button
                        onPress={() => this.openChat()}
                        style={{width: "100%", alignItems: "center"}} light={true}><Text style={{flex: 1}}> Open this project chat now. </Text>
                        <Icon name="ios-chatboxes" style={{color: "#000000", fontSize: 25}}/>
                    </Button>
                ) : (
                    <Button onPress={() => this.setState({isInvesting: !this.state.isInvesting})} style={{width: "100%", alignItems: "center"}} dark><Text style={{flex: 1}}> Invest in this project now. </Text>
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
                            {this.state.isLoading && (
                                <ActivityIndicator style={{}} size="small" color="#000000" />
                            )}
                        </Button>
                    </View>
                )}
                {this.state.isAddingPeople && (
                    <View style={{padding: 10, paddingTop: 20, backgroundColor: "#000000"}}>
                        <MultiSelect
                            items={this.state.users}
                            uniqueKey="id"
                            onSelectedItemsChange={this.onSelectedUsersChange}
                            selectedItems={this.state.selectedUsers}
                            selectText="Select Users"
                            searchInputPlaceholderText="Search Users..."
                            altFontFamily="ProximaNova-Light"
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="#CCC"
                            submitButtonText="Select"
                        />
                        <Button style={{marginTop: 20}} onPress={()=> {this.addPeople()}} block light>
                            <Text>Save</Text>
                            {this.state.isLoading && (
                                <ActivityIndicator style={{}} size="small" color="#000000" />
                            )}
                        </Button>
                    </View>
                )}
                <View style={{padding: 20}}>
                    <Card style={{flex: 0}}>
                        <CardItem style={{ paddingBottom: 5 }}>
                            <Left>
                                <Thumbnail source={{uri: STORAGE_URL+this.state.user_img}} />
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
                            <Image source={{uri: STORAGE_URL+this.state.img}} style={{height: 250, width: "100%", flex: 1}}/>
                            <View style={{ marginTop: 10, flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 15 }}> Total Capital Needed: </Text>
                                <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 12, fontWeight: "bold" }}> {this.formatMondey(this.state.amount, 0, '.', ',')}$ </Text></Button>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                <Text style={{ fontSize: 15 }}> Total Capital Invested: </Text>
                                <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 12, fontWeight: "bold" }}> {this.formatMondey(this.state.total_amount_invested, 0, '.', ',')}$ </Text></Button>
                            </View>
                            </Body>
                        </CardItem>
                        <CardItem>
                            {this.state.presentation && (
                                <Left>
                                    <Button onPress={ ()=>{ Linking.openURL(STORAGE_URL+ this.state.presentation)}} transparent textStyle={{color: '#87838B'}}>
                                        <Icon type="MaterialCommunityIcons" name="presentation-play"  />
                                        <Text>Presentation</Text>
                                    </Button>
                                </Left>
                            )}
                            {this.state.study && (
                                <Right>
                                    <Button onPress={ ()=>{ Linking.openURL(STORAGE_URL+this.state.study)}}  transparent textStyle={{color: '#87838B'}}>
                                        <Icon type="FontAwesome" name="file-text-o" />
                                        <Text>Report</Text>
                                    </Button>
                                </Right>
                            )}
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