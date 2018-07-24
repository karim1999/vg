import React, { Component } from 'react';
import {Container, Content, Drawer, Button, Icon, Fab, List, ListItem, Text, Toast} from 'native-base';
import SideBar from './sidebar'
import Header from './header'
import {connect} from "react-redux";
import {setUser} from "../reducers";
import _ from "lodash";
import {Alert, AsyncStorage, RefreshControl, View} from "react-native";
import {SERVER_URL} from "../config";
import axios from "axios/index";

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
    investInProject(){
        this.setState({
            menu: false
        });
        this.props.investInProject();
    }
    deleteProject(){
        Alert.alert(
            'Are you sure?',
            'The project will be removed completely after this action.',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                {text: 'OK', onPress: () => {
                        this.setState({
                            menu: false
                        });
                        this.props.deleteProject();
                    }},
            ],
            { cancelable: false }
        )
    }
    editProject(){
        this.setState({
            menu: false
        });
    }
    leaveProject(){
        Alert.alert(
            'Are you sure?',
            'By leaving the project you won\'t be able to access the project chat.',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                {text: 'OK', onPress: () => {
                        this.setState({
                            menu: false
                        });
                        this.props.cancelInvestmentInProject();
                    }},
            ],
        )

    }
    changeInvestment(){
        this.setState({
            menu: false
        });
        this.props.investInProject();
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
                        text: "No internet connection",
                        buttonText: "Ok",
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
        return (
            <Container>
                <Drawer
                    ref={(ref) => { this.drawer = ref; }}
                    content={<SideBar navigation={this.props.navigation} />}
                    onClose={() => this.closeDrawer()}
                >
                    <Header toggleMenu={() => this.toggleMenu()} title={this.props.title} navigation={this.props.navigation} right={this.props.right}>
                        {this.props.backButton ? (
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
                        style={{ backgroundColor: "#FDF5F5", flex: 1 }}>
                        {this.state.menu && (
                            <List style={{backgroundColor: "#FFFFFF", right: 0}}>
                                {_.find(this.props.jointProjects, project => project.id == this.props.project) && (
                                    <ListItem onPress={() => this.props.openChat()}>
                                        <Text>Open Chat</Text>
                                    </ListItem>
                                )}
                                {_.find(this.props.jointProjects, project => project.id == this.props.project)? (
                                    <ListItem onPress={() => this.changeInvestment()}>
                                        <Text>Change Investment Value</Text>
                                    </ListItem>
                                ) : (
                                    <ListItem onPress={() => this.investInProject()}>
                                        <Text>Invest In the project</Text>
                                    </ListItem>
                                )}
                                {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                    <ListItem onPress={() => this.props.navigation.navigate("AddProject", {
                                        id: this.props.id,
                                        title: this.props.title,
                                        description: this.props.description,
                                        amount: this.props.amount,
                                        report: this.props.report,
                                        presentation: this.props.presentation,
                                        category: this.props.category_id
                                    })}>
                                        <Text>Edit Project</Text>
                                    </ListItem>
                                )}
                                {_.find(this.props.myProjects, project => project.id == this.props.project) && (
                                    <ListItem onPress={() => this.deleteProject()}>
                                        <Text>Delete Project</Text>
                                    </ListItem>
                                )}
                                {(!_.find(this.props.myProjects, project => project.id == this.props.project) && _.find(this.props.jointProjects, project => project.id == this.props.project)) && (
                                    <ListItem onPress={() => this.leaveProject()}>
                                        <Text>Leave Project</Text>
                                    </ListItem>
                                )}
                            </List>
                        )}

                        {this.props.children}
                    </Content>
                </Drawer>
                {this.props.fab && (
                    <Fab
                        active={true}
                        style={{ backgroundColor: '#000000' }}
                        position="bottomRight"
                        onPress={() => this.props.navigation.navigate('AddProject')}>
                        <Icon name="ios-add-circle" style={{color: "#FFFFFF", fontSize: 35}} />
                    </Fab>
                )}
            </Container>
        );
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