import React from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity, Picker as Picker2, Platform, ScrollView, Text} from 'react-native';
import {Body, CheckBox, ListItem, Picker} from 'native-base';
import countries from './../countries.json';
import AuthTemplate from './../components/authTemplate';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toast} from "native-base";

export default class Terms extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params,
            accept: false
        };
    }
    check(){
        if(!this.state.accept){
            Toast.show({
                text: "You should accept the terms & conditions before signing up.",
                buttonText: "Ok",
                type: "danger"
            })
        }else{
            this.props.navigation.navigate("SignUp1", this.state.data);
        }
    }
    render() {
        return (
            <AuthTemplate next="SignUp1" title="Terms && Conditions" navigation={this.props.navigation} error={this.state.error}>
                <ListItem onPress={() => this.setState({accept: !this.state.accept})}>
                    <CheckBox checked={this.state.accept}/>
                    <Text style={{color: "#FFFFFF", fontSize: 20, marginLeft: 10}}>Accept</Text>
                </ListItem>
                <ScrollView>
                    <Text style={{color: "#f2f2f2", fontSize: 17, padding: 20, lineHeight: 25}}>
                        Virtual Group
                        {"\n"}
                        "Terms and conditions” agreement
                        {"\n"}
                        {"\n"}
                        -	The elements of virtual group idea are the following:-
                        {"\n"}
                        {"\n"}
                        {"\t"}•	Virtual Group website www.vgksa.com
                        {"\n"}
                        {"\t"}•	Virtual group application on google play and apple store
                        {"\n"}
                        {"\t"}•	Virtual WhatsApp group via mobile phones that follows Virtual Group
                        {"\n"}
                        {"\n"}
                        -	These elements ,as a whole or solo, represent the origin and the idea of  the (Virtual Group) created by Eng. Salem Masrahi. So, anyone have decided to join the (Virtual Group) must agree on terms and conditions in this agreement by signing on it (electronically) via variant available methods for members. As the (Virtual Group) is not commercial entity or official organization, the (Virtual Group) does not obligate to known practice, standers, terms, and conditions of any traditional commercial business so the terms and conditions in this agreement is accredited to this business and all have agreed on considering this agreement as the reference of organizing the work off the (Virtual Group) and regulating relation between its members.
                        {"\n"}
                        {"\n"}
                        -	All members should know that the priority is to reach to the targeted number off members which is 250 member. If the group reaches that number of members or a close number of that , the discussion will be held between the members to reach the best suggestions and solutions to change the work from virtual to another options which would be more feasible. These suggestions and solutions are agreed on by group members specially members who tried and implemented variant projects and deals in the previous period
                        {"\n"}
                        {"\n"}
                        -	All members should understand, agree, and accredit principals and ways of work of the (Virtual Group) as it is virtualization that means no member is obligated to agree on what other members offer from opportunities, ideas, projects, deals, suggestions, or thoughts also no one is obligated to attend business meetings.
                        {"\n"}
                        {"\n"}
                        -	All members have the right to offer any opportunities, ideas, projects, deals, suggestions, or thoughts anytime after joining the group as long as they are restricted to delicacy and credibility also what the member offers should be realistic and applicable. In addition it is preferable that the member should be ready at the time of offering his project by providing studies, abstracts, budgets, benefits, risks, profits and other usual related things.
                        {"\n"}
                        {"\n"}
                        -	All offered opportunities, ideas, projects, deals, suggestions, or thoughts by any member in the (Virtual Group) in any form written messages, voice messages, phone calls, or via any electronic contact methods via the 3 (Virtual Group) elements mentioned in the fore of this agreement are considered available for all members to use. And the member who has offer this offer has no right to object or request any compensation if any other member or members used these offers and made some profits materially or morally from using them.
                        {"\n"}
                        {"\n"}
                        -	Every member has the right to work alone or in groups also every member has the right to cooperate and meet any other member of the group he wants via any available methods and medias electronically or personally.
                        {"\n"}
                        {"\n"}
                        -	If a member or a group of members agree on implementing a project or making a deal any where in the world and all the project or deal financial and economical aspects were studied well and agreed on, all members will decide the best and most legal way to collect and transport required money for the project or deal. That means in each case coping will be agreed on by the contributing members.
                        {"\n"}
                        {"\n"}
                        -	)Virtual Group) WhatsApp is decided to be used in fast discussion and expressing ideas and thoughts also it is used in  any members queries. But, any projects or investments opp. will be placed on our applications  via (Android and Apple stores).
                        {"\n"}
                        {"\n"}
                        -	All members acknowledged that (Virtual Group) WhatsApp is dedicated only for discussing business, not used in congratulation, keeping in touch, advertising posts, videos & images sharing, or any other uses that is not related to business world.
                        {"\n"}
                        {"\n"}
                        -	The minimum requirement to accept a member join request to the (Virtual Group) is proving financial ability of 500 thousand SR or equivalent currencies. The admin has the right to make sure of this financial ability of all the members any time admin wants to grantee the level of all members and that all members have similar financial abilities.
                        {"\n"}
                        {"\n"}
                        -	Admin has the right to dismiss any member of the (Virtual Group) in case admin made sure that the member made breaches including member did not prove his financial abilities, member was soliciting, distorting, fraud, or member stands still without any contribution or interaction for long time.
                        {"\n"}
                        {"\n"}
                        -	Admin selection is done by recommendation of the group members or through the majority of voices in case of existence of different thoughts or objections.
                        {"\n"}
                        {"\n"}
                        -	Members of the (Virtual Group) promise morally and ethically not to disclose or contribute any information or data expressed on the group outside the scope of the (Virtual Group) members
                        {"\n"}
                        {"\n"}
                        -	The idea presenter, and the idea adopter, admin and any (Virtual Group) member are not responsible for any mistakes or negative results caused by any member intentionally or unintentionally.
                        {"\n"}
                        {"\n"}
                        -	Any member wants to leave the (Virtual Group) by himself anytime, has the right to leave anytime without any explanation or legal liability
                        {"\n"}
                        {"\n"}
                        -	Any member of the (Virtual Group) is solely responsible for any legal liability from related government departments in case of proving that he offered a stolen idea of projects or suspicious deals. The admin, idea presenter, or any group member are not responsible for his act.
                        {"\n"}
                        {"\n"}
                        -	Each member holds the responsibility of providing non real or fraud personal data or impersonate  a character of another person in case of any investigation done by the related government departments, the other group members including admin and idea presenter are not responsible for any of that or any results.
                        {"\n"}
                        {"\n"}
                        -	All members of (Virtual Group) should acknowledge this Terms & Conditions agreement has no expiring date and it is valid until it is canceled in written form. Also the agreement will be updated periodically whenever needed.
                    </Text>
                </ScrollView>

                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={styles.leftArrow}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon name="arrow-circle-left" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rightArrow}
                        onPress={() => this.check()}
                    >
                        <Icon name="arrow-circle-right" size={50} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </AuthTemplate>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        width: "70%",
        fontSize: 20,
        color: "#FFFFFF",
    },
    select: {
        height: 50,
        width: "100%",

        color: "#FFFFFF",
    },
    select2: {
        height: 50,
        width: "70%",
        transform: [
            { scaleY: 1.3 },
            { scaleX: 1.3 },
        ],
        marginLeft: "17%",
        color: "#FFFFFF",
    },
    navigation: {
        width: "75%",
        flexDirection: 'row',
        marginTop: 30
    },
    rightArrow:{
        width: "50%",
        alignItems: 'flex-end',
        marginTop: 20,
    },
    leftArrow:{
        width: "50%",
        alignItems: 'flex-start',
        marginTop: 20,
    }

});
