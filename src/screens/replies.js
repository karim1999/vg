import React from "react";
import {View, ImageBackground, AsyncStorage, TouchableOpacity, ActivityIndicator, FlatList} from "react-native";
import {Container, Content, Text, List, ListItem, Left, Body, Right, Thumbnail, H2, Toast, Button, Icon} from "native-base";
import {connect} from "react-redux";
import {setUser} from "../reducers";
import {SERVER_URL, STORAGE_URL} from "../config";
import AppTemplate from './../components/appTemplate';
import ImagePicker from 'react-native-image-picker';
import axios from "axios";
import { strings } from '../i18n';
import I18n from "../i18n";
import _ from "lodash";
import firebaseApp from "./../firebaseDb";
let firebaseDb= firebaseApp.database();

class Replies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.navigation.state.params,
            replies: [],
            isLoading: false
        };
    }
    componentDidMount(){
        this.setState({
            isLoading: true
        });
        firebaseDb.ref('/replies/'+this.state.id).on('value', data => {
            this.setState({
                replies: _.map(data.val(), (value, key)=> {
                    return {...value, key};
                }),
                isLoading: false
            })
        });
    }
    deleteReply(key){
        firebaseDb.ref('/replies/'+this.state.id+'/'+key).remove();
    }
    render() {
        return (
            <AppTemplate backButton title={strings("chat.automatic")} navigation={this.props.navigation} activeTab="Notifications">
                <Button
                    onPress={() => this.props.navigation.navigate('AddReply', {...this.props.navigation.state.params})}
                    style={{width: "100%", alignItems: "center"}} light={true}><Text style={[{flex: 1}, (I18n.locale === "ar") && {textAlign: "right"}]}> { strings("chat.add") } </Text>
                    <Icon name="ios-add-circle" style={{color: "#000000", fontSize: 25}}/>
                </Button>
                <View>
                    <List>
                        {this.state.isLoading? (
                            <View>
                                <ActivityIndicator size="large" color="#000000" />
                            </View>
                        ) : (
                            <FlatList
                                ListEmptyComponent={
                                    <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>{strings("home.notFound")}</Text>
                                }
                                data={this.state.replies}
                                renderItem={({item}) => (
                                    <ListItem avatar
                                              key={item.id}
                                              onPress={() => this.props.navigation.navigate("AddReply", {...item, id: this.state.id})}
                                    >
                                        <Left>
                                            <Icon type="FontAwesome" name="reply"/>
                                            {/*<Thumbnail source={{ uri: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png' }} />*/}
                                        </Left>
                                        <Body>
                                        <Text>{item.message}</Text>
                                        <Text note>{item.reply}</Text>
                                        </Body>
                                        <Right>
                                            <Icon onPress={()=> this.deleteReply(item.key)} type="FontAwesome" name="times-circle" color="red"/>
                                        </Right>
                                    </ListItem>
                                )}
                                keyExtractor = { (item, index) => index.toString() }
                            />
                        )}
                    </List>
                </View>
            </AppTemplate>
        );
    }
}
const mapStateToProps = ({ user }) => ({
    user
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Replies);
