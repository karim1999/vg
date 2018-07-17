import React, { Component } from 'react';
import {Picker, Form, Icon, Toast, Item, Input, Content} from 'native-base';
import {ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";
import axios from "axios";
import {SERVER_URL} from "../config";

export default class Home extends Component {
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
                this.setState({
                    isLoading: false,
                });
                Toast.show({
                    text: "No internet connection",
                    buttonText: "Ok",
                    type: "danger"
                })
            });
        }).catch(error => {
            this.setState({
                isLoading: false,
            });
            Toast.show({
                text: "No internet connection",
                buttonText: "Ok",
                type: "danger"
            })
        });
    }
    async componentDidMount(){
        await this.onLoad();
    }

    render() {

        return (
            <AppTemplate fab={true} title="Home" navigation={this.props.navigation} activeTab="Home">
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
                                    onValueChange={(itemValue, itemIndex) => this.onValueChange(itemValue)}
                                >
                                    <Picker.Item label="All" value={0} />
                                    {this.state.categories.map((category) => (
                                        <Picker.Item key={category.id} label={category.name} value={category.id} />
                                    ))}
                                </Picker>
                            </Form>
                        </View>
                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 30, alignItems: 'flex-end', width: 200 }}>
                            <Item rounded>
                                <Icon style={{fontSize: 35}} name='ios-search' />
                                <Input onChangeText={(search) => this.onSearchChange(search)} placeholder='Search...'/>
                            </Item>
                        </View>
                    </View>
                    <Transition appear="horizontal" disappear="horizontal">
                        {this.state.isLoading? (
                            <View>
                                <ActivityIndicator size="large" color="#000000" />
                            </View>
                        ) : (
                            <FlatList
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
                    </Transition>
                </View>
            </AppTemplate>
        );
    }
}
