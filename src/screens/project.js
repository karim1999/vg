import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {ActivityIndicator, AsyncStorage, Image, View, Linking, TouchableOpacity, FlatList} from 'react-native';
import {
    Card,
    CardItem,
    Thumbnail,
    Text,
    Button,
    Icon,
    Left,
    Body,
    Right,
    Toast,
    List,
    ListItem,
    Item, Textarea, Form, Label
} from 'native-base';
import {SERVER_URL, STORAGE_URL, ONESIGNAL_APP_ID, ONESIGNAL_API_KEY} from "../config";
import NumericInput from 'react-native-numeric-input'
import {setUser} from "../reducers";
import {connect} from "react-redux";
import axios from "axios";
import _ from "lodash";
import MultiSelect from "react-native-quick-select";
import {strings} from "../i18n";
import I18n from "../i18n";
import Stars from 'react-native-stars';

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
            allUsers: [],
            isCommenting: false,
            isReviewing: false,
            comment: "",
            comments: [],
            rate: 0,
            isLoadingComments: false,
            selectedUsers: [],
            project: {},
            disableReviewing: false
        };
    }
    async addComment(){
        this.setState({
            isCommenting: true
        });
        const userToken = await AsyncStorage.getItem('token');
        axios.post(SERVER_URL+"api/project/"+this.state.id+"/comment/add?token="+userToken, {
            comment: this.state.comment
        }).then(response => {
            this.setState({
                comments: response.data,
                isCommenting: false,
                comment: ""
            });
            Toast.show({
                text: "You have added a comment successfully.",
                buttonText: strings("messages.ok"),
                type: "success"
            });
        }).catch(error => {
            alert(JSON.stringify(error));
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
            });
            this.setState({
                isCommenting: false,
            });
        });

    }
    async addReview(rate){
        this.setState({
            isReviewing: true,
            rate
        });
        const userToken = await AsyncStorage.getItem('token');
        axios.post(SERVER_URL+"api/project/"+this.state.id+"/review/add?token="+userToken, {
            review: this.state.rate
        }).then(response => {
            this.setState({
                isReviewing: false,
                disableReviewing: true
            });
            this.props.setUser(response.data);
            Toast.show({
                text: "You have added a review successfully.",
                buttonText: strings("messages.ok"),
                type: "success"
            });
        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
            });
            this.setState({
                isReviewing: false,
            });
        });

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
                axios.get(SERVER_URL+"api/project/"+this.state.id+"/users").then(response2 => {
                    let devices= _.compact(_.map(response2.data, user => user.id !== this.props.user.id && user.device_id));
                    return devices;
                }).then(devices => {
                    let notification= {
                        app_id: ONESIGNAL_APP_ID,
                        contents: {"en": "New investment in one of your projects"},
                        data: {
                            type : 1,
                        },
                        include_player_ids: devices
                    };
                    axios.post('https://onesignal.com/api/v1/notifications', notification , {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": ONESIGNAL_API_KEY
                        }
                    }).then(response => {
                        console.log(response.data.id);
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });

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
                    text: strings("messages.unknownError"),
                    buttonText: strings("messages.ok"),
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
                    text: strings("messages.unknownError"),
                    buttonText: strings("messages.ok"),
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
                    text: strings("messages.unknownError"),
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
            isLoadingComments: true
        });
        axios.get(SERVER_URL+"api/project/"+this.state.id+"/comments").then(response => {
            this.setState({
                comments: response.data.comments,
                project: response.data,
                isLoadingComments: false,
            });
        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
                type: "danger"
            });
            this.setState({
                isLoadingComments: false,
            });
        });
        axios.get(SERVER_URL+"api/users").then(response => {
            let filterOwner= _.filter(response.data, (user)=>{
                return user.id != this.props.user.id;
            });
            this.setState({
                allUsers: response.data,
                users: filterOwner
            });
            return axios.get(SERVER_URL+"api/project/"+this.state.id+'/users').then(response2 => {
                let selectedUsers= _.pull(_.map(response2.data, 'id'), this.props.user.id);
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
            users: _.join(_.concat(this.state.selectedUsers, this.props.user.id), ',')
        }).then(response2 => {
            Toast.show({
                text: strings("project.usersUpdated"),
                buttonText: strings("messages.ok"),
                type: "success"
            });
            this.setState({
                isLoading: false,
            });
        }).catch(error => {
            Toast.show({
                text: strings("messages.noInternet"),
                buttonText: strings("messages.ok"),
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
                        style={{width: "100%", alignItems: "center"}} light={true}><Text style={[{flex: 1}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("project.openChat") } </Text>
                        <Icon name="ios-chatboxes" style={{color: "#000000", fontSize: 25}}/>
                    </Button>
                ) : (
                    <Button onPress={() => this.setState({isInvesting: !this.state.isInvesting})} style={{width: "100%", alignItems: "center"}} dark><Text  style={[{flex: 1}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("project.investProject") } </Text>
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
                            <Text>{ strings("project.investProject") }</Text>
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
                            submitButtonText={strings('project.select')}
                        />
                        <Button style={{marginTop: 20}} onPress={()=> {this.addPeople()}} block light>
                            <Text>{ strings("project.save") }</Text>
                            {this.state.isLoading && (
                                <ActivityIndicator style={{}} size="small" color="#000000" />
                            )}
                        </Button>
                    </View>
                )}
                <View style={{padding: 20}}>
                    <Card style={{flex: 0}}>
                        <TouchableOpacity
                            onPress={()=> this.props.navigation.navigate('User', {id: this.state.user_id})}
                        >
                            <CardItem style={{ paddingBottom: 5 }}>
                                <Left>
                                    <Thumbnail source={{uri: STORAGE_URL+this.state.user_img}} />
                                    <Body>
                                    <Text>{this.state.user_name}</Text>
                                    <Text note>{this.state.created_at}</Text>
                                    </Body>
                                </Left>
                                <Button primary={this.state.visibility == 1} light={this.state.visibility != 1} style={{alignItem: 'flex-end'}}><Text>{(this.state.visibility == 1? strings("add_project.public") : strings("add_project.private"))}</Text></Button>
                            </CardItem>
                        </TouchableOpacity>
                        <CardItem style={{ paddingTop: 0 }}>
                            <Body>
                            <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold", width: '100%' }}>
                                {this.state.title}
                            </Text>
                            {!this.state.isLoadingComments && (
                                <View>
                                    <Stars
                                        disabled={_.find(this.props.user.reviews, review => review.project_id == this.state.id) || this.state.disableReviewing}
                                        half={false}
                                        default={this.state.project.rate}
                                        update={(rate)=>{this.addReview(rate)}}
                                        spacing={1}
                                        count={5}
                                        starSize={25}
                                        backingColor='white'
                                        fullStar= {<Icon name="ios-star" style={{color: "yellow"}}/>}
                                        halfStar={<Icon name="ios-star-half" style={{color: "yellow"}}/>}
                                        emptyStar= {<Icon name="ios-star-outline" style={{color: "black"}}/>}
                                    />
                                </View>
                            )}
                            <Image source={{uri: STORAGE_URL+this.state.img}} style={{height: 250, width: "100%", flex: 1, marginTop: 10}}/>
                            {
                                (this.state.project.img1) && (
                                    <Image source={{uri: STORAGE_URL+this.state.project.img1}} style={{height: 250, width: "100%", flex: 1, marginTop: 10}}/>
                                )
                            }
                            {
                                (this.state.project.img2) && (
                                    <Image source={{uri: STORAGE_URL+this.state.project.img2}} style={{height: 250, width: "100%", flex: 1, marginTop: 10}}/>
                                )
                            }
                            {
                                (this.state.project.img3) && (
                                    <Image source={{uri: STORAGE_URL+this.state.project.img3}} style={{height: 250, width: "100%", flex: 1, marginTop: 10}}/>
                                )
                            }
                            {
                                (this.state.project.img4) && (
                                    <Image source={{uri: STORAGE_URL+this.state.project.img4}} style={{height: 250, width: "100%", flex: 1, marginTop: 10}}/>
                                )
                            }
                            <Text style={{ fontSize: 15, marginBottom: 10, marginTop: 10 }}>
                                {this.state.description}
                            </Text>
                            {
                                (I18n.locale === "ar") ? (
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10, alignSelf: "flex-end", justifySelf: "flex-end" }}>
                                        <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 12, fontWeight: "bold" }}> {this.formatMondey(this.state.amount, 0, '.', ',')} {this.state.currency} </Text></Button>
                                        <Text style={{ fontSize: 15, textAlign: "right", alignSelf: "flex-end" }}> { strings("project.capitalNeeded") } </Text>
                                    </View>
                                ) : (
                                    <View style={{ marginTop: 10, flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ fontSize: 15 }}> { strings("project.capitalNeeded") } </Text>
                                        <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 12, fontWeight: "bold" }}> {this.formatMondey(this.state.amount, 0, '.', ',')} {this.state.currency} </Text></Button>
                                    </View>
                                )
                            }
                            {
                                (I18n.locale === "ar") ? (
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10, alignSelf: "flex-end", justifySelf: "flex-end" }}>
                                        <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 12, fontWeight: "bold" }}> {this.formatMondey(this.state.total_amount_invested, 0, '.', ',')} {this.state.currency} </Text></Button>
                                        <Text style={{ fontSize: 15 }}> { strings("project.capitalInvested") } </Text>
                                    </View>
                                ) : (
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                        <Text style={{ fontSize: 15 }}> { strings("project.capitalInvested") } </Text>
                                        <Button rounded small dark style={{padding: 4}}><Text style={{ fontSize: 12, fontWeight: "bold" }}> {this.formatMondey(this.state.total_amount_invested, 0, '.', ',')} {this.state.currency} </Text></Button>
                                    </View>
                                )
                            }
                            </Body>
                        </CardItem>
                        <CardItem>
                            {this.state.presentation && (
                                <Left>
                                    <Button onPress={ ()=>{ Linking.openURL(STORAGE_URL+ this.state.presentation)}} transparent textStyle={{color: '#87838B'}}>
                                        <Icon type="MaterialCommunityIcons" name="presentation-play"  />
                                        <Text>{ strings("project.presentation") }</Text>
                                    </Button>
                                </Left>
                            )}
                            {this.state.study && (
                                <Right>
                                    <Button onPress={ ()=>{ Linking.openURL(STORAGE_URL+this.state.study)}}  transparent textStyle={{color: '#87838B'}}>
                                        <Icon type="FontAwesome" name="file-text-o" />
                                        <Text>{ strings("project.report") }</Text>
                                    </Button>
                                </Right>
                            )}
                        </CardItem>
                    </Card>
                </View>
                <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
                    <Card style={{flex: 0}}>
                        <CardItem style={{ paddingTop: 0 }}>
                            {/*<Body>*/}
                            <Form style={{flex: 1}}>
                                <Item style={{height: 70}}>
                                    <Icon type="MaterialIcons" name='rate-review' />
                                    <Label>Add Comment</Label>
                                </Item>
                                {/*<Item style={{height: 70, borderColor: "transparent", paddingBottom: 0, marginBottom: 0}} underline={false}>*/}
                                {/*<Icon type="FontAwesome" name='info' />*/}
                                {/*<Text>Comment</Text>*/}
                                {/*</Item>*/}
                                <Item style={{marginBottom: 20, flex: 1}}>
									<Textarea
                                        style={{height: 100, paddingTop: 0, marginTop: 0, flex: 1}}
                                        rowSpan={5}
                                        bordered
                                        onChangeText={(comment) => this.setState({comment})}
                                        placeholder="Write your comment"
                                        placeholderTextColor="#ccc5c5"
                                        value={this.state.comment}
                                    />
                                </Item>
                                <Button
                                    onPress={() => this.addComment()}
                                    style={{flexDirection: "row"}}
                                    block success
                                >
                                    <Text>add</Text>
                                    {this.state.isCommenting && (
                                        <ActivityIndicator size="small" color="#000000" />
                                    )}
                                </Button>
                            </Form>
                            {/*</Body>*/}
                        </CardItem>
                    </Card>
                </View>
                <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10}}>
                    {this.state.isLoadingComments ? (
                        <ActivityIndicator style={{}} size="small" color="#000000" />
                    ) : (
                        <FlatList
                            ListEmptyComponent={
                                <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>No comments were found</Text>
                            }
                            data={this.state.comments}
                            renderItem={({item}) => (
                                <Card style={{flex: 0}}>
                                    <TouchableOpacity
                                        onPress={()=> this.props.navigation.navigate('User', {id: item.user.id})}
                                    >
                                        <CardItem style={{ paddingBottom: 5 }}>
                                            <Left>
                                                <Thumbnail source={{uri: STORAGE_URL+item.user.img}} />
                                                <Body>
                                                <Text>{item.user.name}</Text>
                                                <Text note>{item.created_at}</Text>
                                                </Body>
                                            </Left>
                                        </CardItem>
                                    </TouchableOpacity>
                                    <CardItem style={{ paddingTop: 0 }}>
										<Body>
	                                        <Text note>{item.comment}</Text>
										</Body>
									</CardItem>
                                </Card>
                            )}
                            keyExtractor = { (item, index) => index.toString() }
                        />
                    )}
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
