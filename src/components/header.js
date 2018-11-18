import React, { Component } from 'react';
import {Header, Title, Left, Body, Right, Button, Icon, Text} from 'native-base';
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
	                {
		                (I18n.locale == "ar") &&
		                (this.props.edit) && (
			                <Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
				                <Icon type="FontAwesome" name="pencil-square-o" style={{color: "#000000", fontSize: 28}}/>
			                </Button>
		                )
	                }
                </Left>
                <Body>
                <Text style={[{ color: "#000000", fontSize: 17 }, (I18n.locale === "ar") && {justifySelf: "flex-end", alignSelf: "flex-end"}]}>{this.props.title}</Text>
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
	                    {
		                    (I18n.locale != "ar") &&
		                    (this.props.edit) && (
			                    <Button transparent onPress={() => this.props.navigation.navigate('Profile')}>
				                    <Icon type="FontAwesome" name="pencil-square-o" style={{color: "#000000", fontSize: 28}}/>
			                    </Button>
		                    )
	                    }
                    </Right>

            </Header>

        );
    }
}
