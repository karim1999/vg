import React, { Component } from 'react';
import {Container, Content, Drawer, Button, Icon, Fab, List, ListItem, Text, Toast} from 'native-base';
import SideBar from './sidebar'
import Header from './header'
import {connect} from "react-redux";
import {setUser} from "../reducers";
import _ from "lodash";
import {Alert, AsyncStorage,Platform, RefreshControl, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios/index";
import {strings} from "../i18n";
import I18n from "../i18n";

class AppTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: false,
            refreshing: false,
        };
    }

    closeDrawer() {
        this.drawer._root.close()
    }
    openDrawer() {
        this.drawer._root.open()
    }
    toggleMenu() {
        this.setState({
            menu: !this.state.menu
        })
    }
    async investInProject(){
        this.setState({
            menu: false
        });
        await this.props.investInProject();
        this._onRefresh();
    }
    deleteProject(){
        Alert.alert(
            strings('app.sure'),
            strings('app.removedCompletely'),
            [
                {text: strings('messages.cancel'), onPress: () => console.log('Cancel Pressed')},
                {text: strings('messages.ok'), onPress: () => {
                        this.setState({
                            menu: false
                        });
                        this.props.deleteProject();
                    }},
            ],
            { cancelable: false }
        )
    }
    reportProject(){
        Alert.alert(
            strings('app.reportSure'),
            strings('app.reportNote'),
            [
                {text: strings('messages.cancel'), onPress: () => console.log('Cancel Pressed')},
                {text: strings('messages.ok'), onPress: () => {
                        this.setState({
                            menu: false
                        });
                        this.props.reportProject();
                    }},
            ],
            { cancelable: false }
        )
    }
    reportUser(){
        Alert.alert(
            strings('app.reportSure'),
            strings('app.reportNote'),
            [
                {text: strings('messages.cancel'), onPress: () => console.log('Cancel Pressed')},
                {text: strings('messages.ok'), onPress: () => {
                        this.setState({
                            menu: false
                        });
                        this.props.reportUser();
                    }},
            ],
            { cancelable: false }
        )
    }
    addPeople(){
        this.setState({
            menu: false
        });
        this.props.addPeople();
    }
    editProject(){
        this.setState({
            menu: false
        });
    }
    leaveProject(){
        Alert.alert(
            strings('app.sure'),
            strings('app.leaveProjectMsg'),
            [
                {text: strings('messages.cancel'), onPress: () => console.log('Cancel Pressed')},
                {text: strings('messages.ok'), onPress: () => {
                        this.setState({
                            menu: false
                        });
                        this.props.cancelInvestmentInProject();
                    }},
            ],
        )

    }
    async changeInvestment(){
        this.setState({
            menu: false
        });
        await this.props.investInProject();
        this._onRefresh();
    }
    _onRefresh(){
        this.setState({
            refreshing: true
        });
        if(this.props.pullToRefresh){
            this.props.onLoad().then(() => {
                this.setState({
                    refreshing: false
                });
            })
        }else{
            AsyncStorage.getItem('token').then(userToken => {
                return axios.post(SERVER_URL+'api/auth/me?token='+userToken).then(response => {
                    this.props.setUser(response.data);
                    this.setState({
                        refreshing: false
                    });
                }).catch(error => {
                    Toast.show({
                        text: strings("messages.unknownError"),
                        buttonText: strings("messages.ok"),
                        type: "danger"
                    });
                    this.setState({
                        refreshing: false
                    });
                })
            });
        }
    }
    render() {
        if(this.props.drawer){
            return (
                <Drawer
                    type={"displace"}
                    ref={(ref) => { this.drawer = ref; }}
                    content={<SideBar closeDrawer={() => this.closeDrawer()} navigation={this.props.navigation} />}
                    onClose={() => this.closeDrawer()}
                >
                    <Container>
                        <Header edit={this.props.edit} toggleMenu={() => this.toggleMenu()} title={this.props.title} navigation={this.props.navigation} right={this.props.right}>
                            {this.props.backButton ?
                                (I18n.locale === "ar") ?(
                                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                                        <Icon name="ios-arrow-forward" style={{color: "#000000", fontSize: 35}}/>
                                    </Button>
                                ): (
                                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                                        <Icon name="ios-arrow-back" style={{color: "#000000", fontSize: 35}}/>
                                    </Button>
                                ) : (
                                    <Button transparent onPress={() => this.openDrawer()}>
                                        <Icon type="Entypo" name="menu" style={{color: "#000000", fontSize: 35}}/>
                                    </Button>
                                )}
                        </Header>
                        <Content
                            refreshing={this.state.refreshing}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this._onRefresh()}
                                />
                            }
                            style={{ backgroundColor: "#f3f3f3", flex: 1 }}>
                            {this.state.menu && (
                                <List style={{backgroundColor: "#FFFFFF", right: 0}}>
                                    {(this.props.project) && (
                                        <ListItem onPress={() => this.props.navigation.navigate('Partners', {id: this.props.project})} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.partners") }</Text>
                                        </ListItem>
                                    )}
                                    {(this.props.project) && (
                                        <ListItem onPress={() => this.reportProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.report") }</Text>
                                        </ListItem>
                                    )}

                                    {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                        <ListItem onPress={() => this.addPeople()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.add_remove") }</Text>
                                        </ListItem>
                                    )}

                                    {_.find(this.props.jointProjects, project => project.id == this.props.project) && (
                                        <ListItem onPress={() => this.props.openChat()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.openChat") }</Text>
                                        </ListItem>
                                    )}
                                    {_.find(this.props.jointProjects, project => project.id == this.props.project)? (
                                        <ListItem onPress={() => this.changeInvestment()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.changeInvestment") }</Text>
                                        </ListItem>
                                    ) : (
                                        <ListItem onPress={() => this.investInProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.investProject") }</Text>
                                        </ListItem>
                                    )}
                                    {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                        <ListItem style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]} onPress={() => this.props.navigation.navigate("AddProject", {
                                            id: this.props.id,
                                            title: this.props.title,
                                            description: this.props.description,
                                            amount: this.props.amount,
                                            report: this.props.report,
                                            presentation: this.props.presentation,
                                            currency: this.props.currency,
                                            visibility: this.props.visibility,
                                            category: this.props.category_id
                                        })}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.editProject") }</Text>
                                        </ListItem>
                                    )}
                                    {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                        <ListItem onPress={() => this.deleteProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.deleteProject") }</Text>
                                        </ListItem>
                                    )}
                                    {(!_.find(this.props.myProjects, project => project.id == this.props.project) && _.find(this.props.jointProjects, project => project.id == this.props.project)) && (
                                        <ListItem onPress={() => this.leaveProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                            <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.leaveProject") }</Text>
                                        </ListItem>
                                    )}
                                </List>
                            )}

                            {this.props.children}
                        </Content>
                        {this.props.fab && (
                            <Fab
                                active={true}
                                style={{ backgroundColor: '#000000' }}
                                position="bottomRight"
                                onPress={() => this.props.navigation.navigate('AddProject')}>

                                <Icon size={25} type="Ionicons" name="ios-add-outline" style={{color:'#FFFFFF'}}  />
                            </Fab>
                        )}
                    </Container>
                </Drawer>
            )
        }else {
            return (
                <Container>
                    <Header edit={this.props.edit} toggleMenu={() => this.toggleMenu()} title={this.props.title} navigation={this.props.navigation} right={this.props.right}>
                        {this.props.backButton ?
                            (I18n.locale === "ar") ?(
                                <Button transparent onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="ios-arrow-forward" style={{color: "#000000", fontSize: 35}}/>
                                </Button>
                            ): (
                                <Button transparent onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="ios-arrow-back" style={{color: "#000000", fontSize: 35}}/>
                                </Button>
                            ) : (
                                <Button transparent onPress={() => this.openDrawer()}>
                                    <Icon type="Entypo" name="menu" style={{color: "#000000", fontSize: 35}}/>
                                </Button>
                            )}
                    </Header>
                    <Content
                        refreshing={this.state.refreshing}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this._onRefresh()}
                            />
                        }
                        style={{ backgroundColor: "#f3f3f3", flex: 1 }}>
                        {this.state.menu && (
                            <List style={{backgroundColor: "#FFFFFF", right: 0}}>
                                {(this.props.project) && (
                                    <ListItem onPress={() => this.props.navigation.navigate('Partners', {id: this.props.project})} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.partners") }</Text>
                                    </ListItem>
                                )}
                                {(this.props.project) && (
                                    <ListItem onPress={() => this.reportProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.report") }</Text>
                                    </ListItem>
                                )}

                                {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                    <ListItem onPress={() => this.addPeople()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.add_remove") }</Text>
                                    </ListItem>
                                )}

                                {_.find(this.props.jointProjects, project => project.id == this.props.project) && (
                                    <ListItem onPress={() => this.props.openChat()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.openChat") }</Text>
                                    </ListItem>
                                )}
                                {_.find(this.props.jointProjects, project => project.id == this.props.project)? (
                                    <ListItem onPress={() => this.changeInvestment()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.changeInvestment") }</Text>
                                    </ListItem>
                                ) : (
                                    <ListItem onPress={() => this.investInProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.investProject") }</Text>
                                    </ListItem>
                                )}
                                {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                    <ListItem style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]} onPress={() => this.props.navigation.navigate("AddProject", {
                                        id: this.props.id,
                                        title: this.props.title,
                                        description: this.props.description,
                                        amount: this.props.amount,
                                        report: this.props.report,
                                        presentation: this.props.presentation,
                                        currency: this.props.currency,
                                        visibility: this.props.visibility,
                                        category: this.props.category_id
                                    })}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.editProject") }</Text>
                                    </ListItem>
                                )}
                                {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                    <ListItem onPress={() => this.deleteProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.deleteProject") }</Text>
                                    </ListItem>
                                )}
                                {(!_.find(this.props.myProjects, project => project.id == this.props.project) && _.find(this.props.jointProjects, project => project.id == this.props.project)) && (
                                    <ListItem onPress={() => this.leaveProject()} style={[(I18n.locale === "ar") && {justifyContent: "flex-end"}]}>
                                        <Text style={[(I18n.locale === "ar") && {textAlign: "right"}]}>{ strings("app.leaveProject") }</Text>
                                    </ListItem>
                                )}
                            </List>
                        )}

                        {this.props.children}
                    </Content>
                    {this.props.fab && (
                        <Fab
                            active={true}
                            style={{ backgroundColor: '#000000' }}
                            position="bottomRight"
                            onPress={() => this.props.navigation.navigate('AddProject')}>

                            <Icon size={25} type="Ionicons" name="ios-add-outline" style={{color:'#FFFFFF'}}  />
                        </Fab>
                    )}
                </Container>
            )
        }
        // return ;
    }
}
const mapStateToProps = ({ user }) => ({
    user,
    favorites: user.favorites,
    jointProjects: user.jointprojects,
    myProjects: user.projects
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppTemplate);
