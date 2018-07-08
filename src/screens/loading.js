import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StyleSheet,
    View,
} from 'react-native';
import axios from 'axios';
import { SERVER_URL } from "../config";
import {connect} from "react-redux";
import {setUser} from "../reducers";

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('token');
        if(userToken){
            return axios.post(SERVER_URL+'api/auth/me?token='+userToken).then(response => {
                this.props.setUser(response.data);
                this.props.navigation.navigate('App');
            }).catch(error => {
                // return AsyncStorage.removeItem('token').then(()=>{
                    this.props.navigation.navigate('Auth');
                // });
            })
        }else{
            this.props.navigation.navigate('Auth');
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})
const mapStateToProps = ({ user }) => ({
    user,
});

const mapDispatchToProps = {
    setUser
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthLoadingScreen);