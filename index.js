import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';
import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['accept'] = 'application/json';
axios.defaults.headers.get['accept'] = 'application/json';

AppRegistry.registerComponent('vg', () => App);
