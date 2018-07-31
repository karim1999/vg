import React, { Component } from 'react';
import {Header, Title, Left, Body, Right, Button, Icon} from 'native-base';

export default class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <Header noShadow
                    style={{ backgroundColor: '#FFFFFF' }}
                    androidStatusBarColor="#000000"
            >
                <Left>
                    {this.props.children}
                </Left>
                <Body>
                <Title style={{ color: "#000000" }}>{this.props.title}</Title>
                </Body>
                    <Right>
                    {this.props.right && (

                        <Button transparent onPress={() => this.props.toggleMenu()}>
                            <Icon type="Entypo" name="dots-three-vertical" style={{color: "#000000", fontSize: 28}}/>
                        </Button>
                        )}
                    </Right>

            </Header>

        );
    }
}
