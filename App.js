import React from 'react';
import { Root } from "native-base";
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { currentUser } from './src/reducers'
import { createStackNavigator, createSwitchNavigator, createTabNavigator } from 'react-navigation';
import { Footer, FooterTab, Button, Icon } from 'native-base';

import { strings } from './src/i18n';
import AuthLoadingScreen from './src/screens/loading';
import SignIn from './src/screens/signin';
import SignUp1 from './src/screens/signup1';
import SignUp2 from './src/screens/signup2';
import SignUp3 from './src/screens/signup3';
import SignUp4 from './src/screens/signup4';
import SignUp5 from './src/screens/signup5';
import Forget from './src/screens/forget';
import Complete from './src/screens/complete';
import Home from './src/screens/home';
import Chat from './src/screens/chat';
import Settings from './src/screens/settings';
import Favorite from './src/screens/favorite';
import Header from './src/components/header';
const HomeStack = createStackNavigator({
    Home: Home
},{
    headerMode: 'none',
});

const SettingsStack = createStackNavigator({
    Settings: Settings,
},{
    headerMode: 'none',
});

const ChatStack = createStackNavigator({
    Chat: Chat,
},{
    headerMode: 'none',
});

const FavoriteStack = createStackNavigator({
    Favorite: Favorite
},{
    headerMode: 'none',
});

const AppStack = createTabNavigator(
    {
        Home: HomeStack,
        Favorite: FavoriteStack,
        Chat: ChatStack,
        Settings: SettingsStack
    },
    {
        initialRouteName: 'Home',
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        tabBarComponent: props => {
            return (
                <Footer
                >
                    <FooterTab style={{ backgroundColor: '#FFFFFF' }}>
                        <Button active={props.navigationState.index === 0} onPress={() => props.navigation.navigate('Home')}>
                            <Icon size={25} name="home" color="#000000" />
                        </Button>
                        <Button active={props.navigationState.index === 1} onPress={() => props.navigation.navigate('Favorite')}>
                            <Icon size={25} name="heart" color="#000000" />
                        </Button>
                        <Button active={props.navigationState.index === 2} onPress={() => props.navigation.navigate('Chat')}>
                            <Icon size={25} active name="chatbubbles" color="#000000" />
                        </Button>
                        <Button active={props.navigationState.index === 3} onPress={() => props.navigation.navigate('Settings')}>
                            <Icon size={25} name="cog" color="#000000" />
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
