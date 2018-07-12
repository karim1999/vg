import React, { Component } from 'react';
import {Picker, Form, Segment, Button, Text, Content} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import ProjectCard from './../components/projectCard';
import AppTemplate from './../components/appTemplate';
import {Transition} from "react-navigation-fluid-transitions";
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
                        <Transition appear="horizontal" disappear="horizontal">
                            <View>
                                {this.props.favorites.map((project) => (
                                    <TouchableOpacity
                                        key={project.id}
                                        onPress={() => this.props.navigation.navigate("Project", {...project, user_name: project.user.name, user_img: project.user.img})}
                                    >
                                        <ProjectCard key={project.id} {...project} user_name={project.user.name} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Transition>
                    ) : (
                        <Transition appear="horizontal" disappear="horizontal">
                            <View>
                                {this.props.myProjects.map((project) => (
                                    <TouchableOpacity
                                        key={project.id}
                                        onPress={() => this.props.navigation.navigate("Project", {...project, user_name: project.user.name, user_img: project.user.img})}
                                    >
                                        <ProjectCard key={project.id} {...project} user_name={project.user.name} />
                                    </TouchableOpacity>

                                ))}
                            </View>
                        </Transition>
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