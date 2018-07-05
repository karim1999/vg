import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { strings } from './src/i18n';
import SignIn from './src/screens/signin';
import SignUp1 from './src/screens/signup1';
import SignUp2 from './src/screens/signup2';
import SignUp3 from './src/screens/signup3';
import SignUp4 from './src/screens/signup4';
import SignUp5 from './src/screens/signup5';
import Forget from './src/screens/forget';
import Complete from './src/screens/complete';


const RootStack = createStackNavigator({
    SignIn: SignIn,
    SignUp1: SignUp1,
    SignUp2: SignUp2,
    SignUp3: SignUp3,
    SignUp4: SignUp4,
    SignUp5: SignUp5,
    Forget: Forget,
    Complete: Complete,
}, {
    initialRouteName: 'SignIn',
});

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: 'it is working',
        };
    }
    render() {
        return <RootStack />;
    }
}