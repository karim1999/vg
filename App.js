import React from 'react';
import {Root, Toast} from "native-base";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { currentUser } from './src/reducers';
import { createStackNavigator, createSwitchNavigator, createTabNavigator } from 'react-navigation';
import { Footer, FooterTab, Button, Icon } from 'native-base';

import i18n, { strings } from './src/i18n';
import AuthLoadingScreen from './src/screens/loading';
import SignIn from './src/screens/signin';
import Terms from './src/screens/terms';
import SignUp1 from './src/screens/signup1';
import SignUp2 from './src/screens/signup2';
import SignUp3 from './src/screens/signup3';
import SignUp4 from './src/screens/signup4';
import SignUp5 from './src/screens/signup5';
import Forget from './src/screens/forget';
import Complete from './src/screens/complete';
import Home from './src/screens/home';
import Project from './src/screens/project';
import AddProject from './src/screens/addProject';
import Chat from './src/screens/chat';
import SingleChat from './src/screens/singleChat';
import Settings from './src/screens/settings';
import Language from './src/screens/language';
import Profile from './src/screens/profile';
import User from './src/screens/user';
import Partners from './src/screens/partners';
import Security from './src/screens/security';
import Favorite from './src/screens/favorite';
import {StyleSheet, Platform, AsyncStorage} from "react-native";
import I18n from "react-native-i18n";

const HomeStack = createStackNavigator({
    Home: Home,
    Project: Project,
    AddProject: AddProject,
    User: User,
	Partners
},{
    headerMode: 'none',
});

const SettingsStack = createStackNavigator({
    Settings: Settings,
    Profile: Profile,
    Security: Security,
    Language,
    User: User
},{
    headerMode: 'none',
});

const ChatStack = createStackNavigator({
    Chat: Chat,
    SingleChat: SingleChat,
},{
    headerMode: 'none',
});
const FixStack = createStackNavigator({
  Language
},{
    headerMode: 'none',
});

const FavoriteStack = createStackNavigator({
    Favorite: Favorite,
},{
    headerMode: 'none',
});

const AppStack = createTabNavigator(
    {
        Tab6: FixStack,
        Tab1: HomeStack,
        Tab2: FavoriteStack,
        Tab3: ChatStack,
        Tab4: SettingsStack
    },
    {
        initialRouteName: 'Tab1',
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
        tabBarComponent: props => {
            return (
                <Footer
                >
                    <FooterTab style={{ backgroundColor: '#FFFFFF' }}>
                        <Button style={[props.navigationState.index === 1 ? styles.activeTab: ""]} onPress={() => props.navigation.navigate('Home')}>
                          {
                            (Platform.OS === 'ios') ?
                            <Icon size={25} type="Entypo" name="home" style={{color:'#000'}}  />:
                            <Icon size={25} name="home" color="#00000" />
                          }
                        </Button>
                        <Button style={[props.navigationState.index === 2 ? styles.activeTab: ""]} onPress={() => props.navigation.navigate('Favorite')}>
                        {
                          (Platform.OS === 'ios') ?
                          <Icon size={25} type="Entypo" name="heart" style={{color:'#000'}}  />:
                          <Icon size={25} name="heart" color="#00000" />
                        }
                        </Button>
                        <Button style={[props.navigationState.index === 3 ? styles.activeTab: ""]} onPress={() => props.navigation.navigate('Chat')}>
                        {
                          (Platform.OS === 'ios') ?
                          <Icon size={25} type="Entypo" name="chat" style={{color:'#000'}}  />:
                          <Icon size={25} name="chatbubbles" color="#00000" />
                        }
                        </Button>
                        <Button style={[props.navigationState.index === 4 ? styles.activeTab: ""]} onPress={() => props.navigation.navigate('Settings')}>
                        {
                          (Platform.OS === 'ios') ?
                          <Icon size={25} type="Entypo" name="cog" style={{color:'#000'}}  />:
                          <Icon size={25} name="cog" color="#00000" />
                        }
                        </Button>
                    </FooterTab>
                </Footer>
            )
        }
        }
);
const AuthStack = createStackNavigator(
    {
        SignIn: SignIn,
        Terms: Terms,
        SignUp1: SignUp1,
        SignUp2: SignUp2,
        SignUp3: SignUp3,
        SignUp4: SignUp4,
        SignUp5: SignUp5,
        Forget: Forget,
        Complete: Complete
    },
    {
        headerMode: 'none',
        initialRouteName: 'SignIn',
    }
);
const RootStack= createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

const store = createStore(currentUser);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;

        this.state = {
        };
    }


    async componentDidMount(){
        await AsyncStorage.getItem('lang').then(lang => {
            if(lang){
                I18n.locale = lang;
            }else{
                I18n.locale = "en";
            }
        })
    }
    render() {
        return (
            <Root>
                <Provider store={store}>
                    <RootStack/>
                </Provider>
            </Root>
        );
    }
}
const styles = StyleSheet.create({
    activeTab: {
        backgroundColor: "#5a5a5a"
    }
});
