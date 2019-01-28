import React, { Component } from 'react';
import {
    Picker,
    Form,
    Icon,
    Toast,
    Item,
    Input,
    Content,
    Segment,
    Button,
    List,
    ListItem,
    Left,
    Body, Thumbnail, Right, Radio
} from 'native-base';
import {
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import axios from "axios";
import {ONESIGNAL_APP_ID, SERVER_URL, STORAGE_URL} from "../config";
import OneSignal from "react-native-onesignal";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import _ from "lodash";
import { strings } from '../i18n';
import I18n from "../i18n";
var moment = require('moment');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            categories: [],
            projects: [],
            refreshing: false,
            search: "",
            searchUsers: "",
            data: [],
            data2: [],
            isLoading: true,
            error: false,
            isVoting: false,
            tab: 1,
            users: [],
            polls: [],
            from: "",
            to: "",
            advanced: false,
            now: moment().format("YYYY-MM-DD")
        };
    }
    convertNumber = function(n){
        return Number(String(n).replace(/\D/g,''));
    };

    formatMondey = function(n, c, d, t){
        if(c != ""){
            c = isNaN(c = Math.abs(c)) ? 2 : c;
            d = d == undefined ? "." : d;
            t = t == undefined ? "," : t;
            let s = n < 0 ? "-" : "";
            let i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
            let j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }else{
            return c;
        }
    };

    async getData(){
        let data= [];
        if(this.state.selected === 0){
            data= this.state.projects;
        }else{
            data= await _.filter(this.state.projects, project => project.category_id == this.state.selected);
        }
        if(this.state.search !== ""){
            data= await _.filter(data, project => project.title.toLowerCase().indexOf(this.state.search) > -1);
        }
        if(this.state.from !== ""){
            data= await _.filter(data, project => project.amount >= this.state.from);
        }
        if(this.state.to !== ""){
            data= await _.filter(data, project => project.amount <= this.state.to);
        }
        this.setState({
            data
        });
        if(this.state.searchUsers !== ""){
            this.setState({
                data2: await _.filter(this.state.users, user => user.name.toLowerCase().indexOf(this.state.searchUsers) > -1)
            })
        }else{
            this.setState({
                data2: this.state.users
            })
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
    async onFromChange(from) {
        await this.setState({
            from,
            isLoading: true
        });
        this.getData().then(()=> {
            this.setState({
                isLoading: false
            });
        });
    }
    async onToChange(to) {
        await this.setState({
            to,
            isLoading: true
        });
        this.getData().then(()=> {
            this.setState({
                isLoading: false
            });
        });
    }
    async onSearchChange2(searchUsers) {
        await this.setState({
            searchUsers,
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
        return axios.get(SERVER_URL+"api/home/all").then(response => {
            this.setState({
                projects: response.data.projects,
                users: response.data.users,
                polls: response.data.votings,
                categories: response.data.categories,
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
        }).then(() => {
            this.getData();
            this.setState({
                isLoading: false,
            });
        });
    }

    async componentDidMount(){
        await this.onLoad();
    }
    componentWillMount() {
        OneSignal.init(ONESIGNAL_APP_ID);
        OneSignal.inFocusDisplaying(2);

        OneSignal.getPermissionSubscriptionState((status) => {
            AsyncStorage.getItem('token').then(userToken => {
                return axios.post(SERVER_URL+"api/user/device?token="+userToken, { id: status.userId }).then(response => {
                }).catch(error => {
                    Toast.show({
                        text: strings("messages.noInternet"),
                        buttonText: strings("messages.ok"),
                        type: "danger"
                    })
                });
            })

        });
        // let results = _.map(this.props.jointProjects, function(project) { return {[project.id]: true}; });
        // for(let i= 0; i < results.length; i++){
        //     OneSignal.sendTag("key", "value");
        // }

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
        console.log("Notification received: ", notification);
        // alert(JSON.stringify(notification.notification.payload));
        // Toast.show({
        //     text: "onReceived: " + notification.payload.body+" from "+notification.payload.title,
        //     buttonText: "Ok",
        //     type: "success"
        // })
    }

    onOpened(openResult) {
        // alert(JSON.stringify(openResult.notification.payload.additionalData));
        if(openResult.notification){
            if(openResult.notification.payload){
                if(openResult.notification.payload.additionalData){
                    if(openResult.notification.payload.additionalData.screen){
                        this.props.navigation.navigate(openResult.notification.payload.additionalData.screen, openResult.notification.payload.additionalData);
                    }
                }
            }
        }
        // console.log('Message: ', openResult.notification.payload.body);
        // console.log('Data: ', openResult.notification.payload.additionalData);
        // console.log('isActive: ', openResult.notification.isAppInFocus);
        // console.log('openResult: ', openResult);
        // alert(openResult.notification.payload.additionalData.name);
        // if(openResult.notification.payload.additionalData.type == 1){
        //     this.props.navigation.navigate("SingleChat", {...openResult.notification.payload.additionalData.project})
        // }
        // Toast.show({
        //     text: openResult.notification.payload.body+" from "+openResult.notification.payload.title,
        //     buttonText: "Ok",
        //     type: "success"
        // })
    }

    onIds(device) {
        alert('Device info: '+ device);
    }
    vote(id){
        this.setState({
            isVoting: true,
        });
        AsyncStorage.getItem('token').then(userToken => {
            axios.post(SERVER_URL+'api/vote/'+id+'?token='+userToken).then(response => {
                this.setState({
                    isVoting: false
                });
                this.props.setUser(response.data);
                Toast.show({
                    text: "Thanks for voting",
                    buttonText: "Ok",
                    type: "success"
                });
            }).catch(error => {
                this.setState({
                    isVoting: false,
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
            <AppTemplate drawer pullToRefresh={true} onLoad={() => this.onLoad()} fab={true} title={strings("home.home")} navigation={this.props.navigation} activeTab="Home">
                <FlatList
                    data={this.state.polls}
                    extraData={[this.state.isVoting, this.props.user]}
                    renderItem={({item}) => (!_.find(this.props.user.answers, answer => answer.voting_id == item.id) && moment(this.state.now).isBefore(item.end_at)) && (
                        <View style={{padding: 0, backgroundColor: "white"}}>
                            <Button
                                style={{width: "100%", alignItems: "center"}} light><Text style={[{flex: 1, color: "#f00", marginLeft: 5, marginRight: 5}, (I18n.locale === "ar") && {textAlign: "right"}]}> { item.question } </Text>
                                <Icon name="question-circle" type="FontAwesome" style={{color: "#000000", fontSize: 25}}/>
                            </Button>
                            {
                                this.state.isVoting ? (
                                    <ActivityIndicator size="large" color="#000000" />
                                ) : (
                                    _.map(item.choices, (choice) => (
                                            <Item
                                                onPress={() => this.vote(choice.id)}
                                                style={{height: 40, padding: 5, marginLeft: 5, marginRight: 5}}
                                            >
                                                <Left>
                                                    <Text>{choice.choice}</Text>
                                                </Left>
                                                <Right>
                                                    <Radio selected={false}/>
                                                </Right>
                                            </Item>
                                        )
                                    )
                                )
                            }
                        </View>
                    )}
                    keyExtractor = { (item, index) => index.toString() }
                />
                <View style={{padding: 10}}>
                    <Segment>
                        <Button style={{
                            backgroundColor: this.state.tab === 2 ? "#000" : undefined,
                            borderColor: "#000",
                            padding: 20
                        }}
                                active={this.state.tab === 2} first onPress={() => this.setState({tab: 2})}><Text style={{color: this.state.tab === 2 ? "white" : '#000'}}>{strings("home.users")}</Text></Button>
                        <Button
                            style={{
                                backgroundColor: this.state.tab === 1 ? "#000" : undefined,
                                borderColor: "#000",
                                padding: 20
                            }} active={this.state.tab === 1} last  onPress={() => this.setState({tab: 1})}><Text style={{color: this.state.tab === 1 ? "white" : '#000'}}>{strings("home.projects")}</Text></Button>
                    </Segment>
                </View>
                {this.state.tab === 1? (
                    <View style={{padding: 20}}>
                        <View style={{ flex: 10, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, paddingLeft: 5, paddingRight: 5, alignItems: 'flex-start', flex: 3 }}>
                                {/*<Form*/}
                                    {/*style={{flex: 1}}*/}
                                {/*>*/}
                                    <Picker
                                        mode="dropdown"
                                        iosHeader="Categories"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        style={{flex: 1, width: "100%"}}
                                        selectedValue={this.state.selected}
                                        placeholder={strings('home.all')}
                                        placeholderStyle={{ color: "#000" }}
                                        onValueChange={(itemValue, itemIndex) => this.onValueChange(itemValue)}
                                    >
                                        {this.state.categories.map((category) => (
                                            <Picker.Item key={category.id} label={(I18n.locale !== "ar") ? category.name : category.name_ar} value={category.id} />
                                        ))}
                                    </Picker>
                                {/*</Form>*/}
                            </View>
                            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, alignItems: 'flex-end', flex: 6 }}>
                                <Item rounded>
                                    <Icon style={{fontSize: 35}} name='ios-search' />
                                    <Input onChangeText={(search) => this.onSearchChange(search)} placeholder={strings("home.search")}/>
                                </Item>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                <Item bordered={false} style={{ alignItems: 'center', justifyContent: "center" }} underline={false} onPress={()=>this.setState({advanced: !this.state.advanced})}>
                                    <Icon style={{fontSize: 35}} name={this.state.advanced ? 'ios-arrow-dropup-circle' : 'ios-arrow-dropdown-circle'} />
                                </Item>
                            </View>
                        </View>
                        {
                            this.state.advanced && (
                                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                                    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, alignItems: 'flex-end', flex: 1 }}>
                                        <Item rounded>
                                            <Icon style={{fontSize: 35}} name='money' type="FontAwesome" />
                                            <Input
                                                value={this.formatMondey(this.convertNumber(this.state.from), 0, '.', ',')}
                                                keyboardType='phone-pad'
                                                onChangeText={(from) => this.onFromChange(from)} placeholder={strings("home.from")}/>
                                        </Item>
                                    </View>
                                    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, alignItems: 'flex-end', flex: 1 }}>
                                        <Item rounded>
                                            <Icon style={{fontSize: 35}} name='money' type="FontAwesome" />
                                            <Input
                                                value={this.formatMondey(this.convertNumber(this.state.to), 0, '.', ',')}
                                                keyboardType='phone-pad'
                                                onChangeText={(to) => this.onToChange(to)} placeholder={strings("home.to")}/>
                                        </Item>
                                    </View>
                                </View>
                            )
                        }
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
                                            onPress={() => this.props.navigation.navigate("Project", {...item, user_name: item.user.name, user_img: item.user.img, user_id: item.user.id})}
                                        >
                                            <ProjectCard
                                                goUser={()=> this.props.navigation.navigate('User', {id: item.user.id})}
                                                key={item.id} {...item} user_name={item.user.name} />
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor = { (item, index) => index.toString() }
                                />
                            )}
                        </View>
                    </View>

                ) : (
                    <View style={{padding: 20}}>
                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
                            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, alignItems: 'flex-end', flex: 1 }}>
                                <Item rounded>
                                    <Icon style={{fontSize: 35}} name='ios-search' />
                                    <Input onChangeText={(searchUsers) => this.onSearchChange2(searchUsers)} placeholder={strings("home.search")}/>
                                </Item>
                            </View>
                        </View>
                        <List>
                            <FlatList
                                ListEmptyComponent={
                                    <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>{strings("home.notFound")}</Text>
                                }
                                data={this.state.data2}
                                renderItem={({item}) => (
                                    <ListItem
                                        onPress={()=> this.props.navigation.navigate('User', {id: item.id})}
                                        avatar>
                                        <Left>
                                            <Thumbnail small source={{uri: STORAGE_URL+item.img}} />
                                        </Left>
                                        <Body>
                                        <Text>{item.name}</Text>
                                        <Text note>{_.truncate(item.description)}</Text>
                                        </Body>
                                        <Right>
                                            {/*<Text note>3:43 pm</Text>*/}
                                        </Right>
                                    </ListItem>
                                )}
                                keyExtractor = { (item, index) => index.toString() }
                            />
                        </List>
                    </View>
                )}
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
