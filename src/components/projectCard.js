import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Button, Text, Left, Body, Card, CardItem, Right  } from 'native-base';

export default class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card style={{flex: 0}}>
                <CardItem>
                    <Left>
                        <Image source={require('./../images/logo.png')} style={{ width: 100, height: 25 }} />
                    </Left>
                    <Right>
                        <Icon name="heart-outlined" color="#000000" size={25} />
                    </Right>
                </CardItem>
                <CardItem style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <Body>
                    <Image source={require('./../images/img1.jpg')} style={{height: 200, width: '100%'}}/>
                    <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <Text style={{ fontSize: 20, marginTop: 10 }}>
                            Websites for freelancers
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.........
                        </Text>
                    </View>
                    </Body>
                </CardItem>
                <CardItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Left>
                        <Button transparent textStyle={{color: '#87838B'}}>
                            <Icon name="github" />
                            <Text>1,926 stars</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent textStyle={{color: '#87838B'}}>
                            <Icon name="github" />
                            <Text>1,926 stars</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({

});