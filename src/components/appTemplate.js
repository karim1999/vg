import React, { Component } from 'react';
import { Container, Content, Drawer, Button } from 'native-base';
import SideBar from './sidebar'
import Header from './header'
import Footer from './footer'
import Icon from 'react-native-vector-icons/Entypo';

export default class AppTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "asfd"
        };
    }
    closeDrawer() {
        this.drawer._root.close()
    }
    openDrawer() {
        this.drawer._root.open()
    }
    render() {

        return (
            <Container>
                <Drawer
                    ref={(ref) => { this.drawer = ref; }}
                    content={<SideBar navigation={this.props.navigation} />}
                    onClose={() => this.closeDrawer()}
                >
                    <Header title={this.props.title} navigation={this.props.navigation} >
                        <Button transparent onPress={() => this.openDrawer()}>
                            <Icon name="menu" size={35} color="#000000"/>
                        </Button>
                    </Header>
                        <Content style={{ backgroundColor: "#FDF5F5", padding: 20 }}>
                                {this.props.children}
                        </Content>
                </Drawer>
            </Container>
        );
    }
}