import React, { Component } from 'react';
import AppTemplate from './../components/appTemplate';
import {ScrollView, Text, View} from "react-native";
import {Body, Card, CardItem} from "native-base";

export default class SingleChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {

        return (
            <AppTemplate title={this.props.navigation.state.params.title} backButton={true} navigation={this.props.navigation} activeTab="Chat">
                <View style={{backgroundColor: "grey", width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{padding: 10, fontSize: 15}}>Total investments in this project: <Text style={{color: "#FFFFFF"}}>9000$</Text></Text>
                </View>
                <ScrollView style={{margin: 20}}>
                    <Card style={{width: "70%", alignSelf: "flex-start"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-end"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient monte
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-start"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-end"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient monte
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-start"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-end"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient monte
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-start"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{width: "70%", alignSelf: "flex-end"}}>
                        <CardItem>
                            <Body>
                            <Text>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient monte
                            </Text>
                            </Body>
                        </CardItem>
                    </Card>

                </ScrollView>
                <View>

                </View>
            </AppTemplate>
        );
    }
}