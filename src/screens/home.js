import React, { Component } from 'react';
import {Picker, Form, Icon, Toast, Item, Input, Content} from 'native-base';
import {ActivityIndicator, FlatList, Platform, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import axios from "axios";
import {ONESIGNAL_APP_ID, SERVER_URL} from "../config";
import OneSignal from "react-native-onesignal";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import _ from "lodash";
import { strings } from '../i18n';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            categories: [],
            projects: [],
            refreshing: false,
            search: "",
            data: [],
            isLoading: true,
            error: false
        };
    }
    async getData(){
        if(this.state.selected === 0){
            this.state.data= this.state.projects;
        }else{
            this.state.data= await _.filter(this.state.projects, project => project.category_id == this.state.selected);
        }
        if(this.state.search !== ""){
            this.state.data= await _.filter(this.state.data, project => project.title.toLowerCase().indexOf(this.state.search) > -1);
        }

    }
    async onValueChange(category) {
        await this.setState({
            selected: category,
            isLoading: true
        });
        this.getData().then(()=> {
            this.setState({
                isLoading: false
            });
        });
    }
    async onSearchChange(search) {
        await this.setState({
            search,
            isLoading: true
        });
        this.getData().then(()=> {
            this.setState({
                isLoading: false
            });
        });
    }
    _onRefresh(){
        this.setState({
            refreshing: true
        });
        this.onLoad().then(() => {
            this.setState({
                refreshing: false
            });
        })
    }
    onLoad(){
        return axios.get(SERVER_URL+"api/projects").then(response => {
            this.setState({
                projects: response.data,
            });
            return axios.get(SERVER_URL+"api/categories").then(response2 => {
                this.setState({
                    categories: response2.data,
                });
                this.getData();
            }).catch(error => {
                Toast.show({
                    text: strings("messages.noInternet"),
                    buttonText: strings("messages.noInternet"),
                    type: "danger"
                })
            }).finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
        }).catch(error => {
            this.setState({
                isLoading: false,
            });
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
            })
        });
    }

    async componentDidMount(){
        await this.onLoad();
    }
    componentWillMount() {
        OneSignal.init(ONESIGNAL_APP_ID);
        OneSignal.inFocusDisplaying(2);

        let results = _.map(this.props.jointProjects, function(project) { return {[project.id]: true}; });
        for(let i= 0; i < results.length; i++){
            OneSignal.sendTag("key", "value");
        }

        OneSignal.addEventListener('received', (notification) => this.onReceived(notification));
        OneSignal.addEventListener('opened', (openResult) => this.onOpened(openResult));
        OneSignal.addEventListener('ids', () => this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', () => this.onReceived);
        OneSignal.removeEventListener('opened', () => this.onOpened);
        OneSignal.removeEventListener('ids', (device) => this.onIds(device));
    }

    onReceived(notification) {
        // console.log("Notification received: ", notification);
        // Toast.show({
        //     text: "onReceived: " + notification.payload.body+" from "+notification.payload.title,
        //     buttonText: "Ok",
        //     type: "success"
        // })
    }

    onOpened(openResult) {
        // console.log('Message: ', openResult.notification.payload.body);
        // console.log('Data: ', openResult.notification.payload.additionalData);
        // console.log('isActive: ', openResult.notification.isAppInFocus);
        // console.log('openResult: ', openResult);
        // alert(openResult.notification.payload.additionalData.name);
        if(openResult.notification.payload.additionalData.type == 1){
            this.props.navigation.navigate("SingleChat", {...openResult.notification.payload.additionalData.project})
        }
        // Toast.show({
        //     text: openResult.notification.payload.body+" from "+openResult.notification.payload.title,
        //     buttonText: "Ok",
        //     type: "success"
        // })
    }

    onIds(device) {
        // console.log('Device info: ', device);
    }

    render() {

        return (
            <AppTemplate pullToRefresh={true} onLoad={() => this.onLoad()} fab={true} title={strings("home.home")} navigation={this.props.navigation} activeTab="Home">
                <View style={{padding: 20}}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, paddingLeft: 5, paddingRight: 5, alignItems: 'flex-start' }}>
                            <Form>
                                <Picker
                                    mode="dropdown"
                                    iosHeader="Categories"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    style={{ width: 130 }}
                                    selectedValue={this.state.selected}
                                    placeholder={strings('home.all')}
                                    placeholderStyle={{ color: "#000" }}
                                    onValueChange={(itemValue, itemIndex) => this.onValueChange(itemValue)}
                                >
                                    {this.state.categories.map((category) => (
                                        <Picker.Item key={category.id} label={category.name} value={category.id} />
                                    ))}
                                </Picker>
                            </Form>
                        </View>
                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, alignItems: 'flex-end', width: 200 }}>
                            <Item rounded>
                                <Icon style={{fontSize: 35}} name='ios-search' />
                                <Input onChangeText={(search) => this.onSearchChange(search)} placeholder={strings("home.search")}/>
                            </Item>
                        </View>
                    </View>
                    <View>
                        {this.state.isLoading? (
                            <View>
                                <ActivityIndicator size="large" color="#000000" />
                            </View>
                        ) : (
                            <FlatList
                                ListEmptyComponent={
                                    <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>{strings("home.notFound")}</Text>
                                }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => this._onRefresh()}
                                    />
                                }
                                data={this.state.data}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => this.props.navigation.navigate("Project", {...item, user_name: item.user.name, user_img: item.user.img})}
                                    >
                                        <ProjectCard key={item.id} {...item} user_name={item.user.name} />
                                    </TouchableOpacity>
                                )}
                                keyExtractor = { (item, index) => index.toString() }
                            />
                        )}
                    </View>
                </View>
            </AppTemplate>
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
)(Home);
