import React, { Component } from 'react';
import { Container, Content, Drawer, Button, Icon, Fab } from 'native-base';
import SideBar from './sidebar'
import Header from './header'
import {TouchableOpacity} from "react-native";

export default class AppTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "asfd",
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
                        <Content style={{ backgroundColor: "#FDF5F5", width: "100%" }}>
                                {this.props.children}
                        </Content>
                </Drawer>
                <Fab
                    active={true}
                    style={{ backgroundColor: '#000000' }}
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('AddProject')}>
                    <Icon name="ios-add-circle" style={{color: "#FFFFFF", fontSize: 35}} />
                </Fab>
            </Container>
        );
    }
}