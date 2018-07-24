import React, { Component } from 'react';
import {Picker, Form, Segment, Button, Text, Content} from 'native-base';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import {setUser} from "../reducers";
import {connect} from "react-redux";

class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "key1",
            tab: 1
        };
    }
    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }
    render() {

        return (
            <AppTemplate title="Favorite" navigation={this.props.navigation} activeTab="Favorite">
                <View style={{padding: 20}}>
                    <Segment>
                        <Button active={this.state.tab === 2} first onPress={() => this.setState({tab: 2})}><Text style={{color: "#000000"}}>Favorites</Text></Button>
                        <Button active={this.state.tab === 1} last  onPress={() => this.setState({tab: 1})}><Text style={{color: "#000000"}}>My Projects</Text></Button>
                    </Segment>
                    {this.state.tab === 2? (
                            <View>
                                <FlatList
                                    ListEmptyComponent={
                                        <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>No elements was found.</Text>
                                    }
                                    data={this.props.favorites}
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
                            </View>
                    ) : (
                            <View>
                                <FlatList
                                    ListEmptyComponent={
                                        <Text style={{alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center"}}>No elements was found.</Text>
                                    }
                                    data={this.props.myProjects}
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
                            </View>
                    )}
                </View>
            </AppTemplate>
        );
    }
}
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
)(Favorite);