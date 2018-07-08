import React, { Component } from 'react';
import { Footer, FooterTab, Button } from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {StyleSheet} from "react-native";

export default class MainFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {

        return (
            <Footer
                style={{ backgroundColor: '#FFFFFF' }}
            >
                <FooterTab style={{ backgroundColor: '#FFFFFF' }}>
                    <Button onPress={() => this.props.navigation.navigate('Home')} vertical style={[this.props.activeTab === "Home" ? styles.active : styles.inactive]} >
                        <Icon size={25} name="home" color="#000000" />
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate('Favorite')} vertical style={[this.props.activeTab === "Favorite" ? styles.active : styles.inactive]}>
                        <Icon size={25} name="heart" color="#000000" />
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate('Chat')} vertical style={[this.props.activeTab === "Chat" ? styles.active : styles.inactive]}>
                        <Icon size={25} active name="chat" color="#000000" />
                    </Button>
                    <Button onPress={() => this.props.navigation.navigate('Settings')} vertical style={[this.props.activeTab === "Settings" ? styles.active : styles.inactive]}>
                        <Icon size={25} name="cog" color="#000000" />
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}
const styles = StyleSheet.create({
    active: {
        backgroundColor: "#D0D0D0"
    },
    inactive: {

    }
});