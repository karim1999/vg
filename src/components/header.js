import React, { Component } from 'react';
import {Header, Title, Left, Body, Right, Button, Icon} from 'native-base';
import I18n from "../i18n";

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
                    {
                        (I18n.locale === "ar") ?
                            this.props.right && (

                                <Button transparent onPress={() => this.props.toggleMenu()}>
                                    <Icon type="Entypo" name="dots-three-vertical" style={{color: "#000000", fontSize: 28}}/>
                                </Button>
                            )
                            :
                            this.props.children

                    }
                </Left>
                <Body>
                <Title style={[{ color: "#000000" }, (I18n.locale === "ar") && {justifySelf: "flex-end", alignSelf: "flex-end"}]}>{this.props.title}</Title>
                </Body>
                    <Right>
                        {
                            (I18n.locale === "ar") ?
                                this.props.children
                                :
                                this.props.right && (

                                    <Button transparent onPress={() => this.props.toggleMenu()}>
                                        <Icon type="Entypo" name="dots-three-vertical" style={{color: "#000000", fontSize: 28}}/>
                                    </Button>
                                )
                        }
                    </Right>

            </Header>

        );
    }
}
