import * as firebase from 'firebase';
let config = {
    apiKey: "AIzaSyDsiGZoreZsMMttc5BaJzCzTIBGEi6D6Mg",
    authDomain: "vgksa-f20ae.firebaseapp.com",
    databaseURL: "https://vgksa-f20ae.firebaseio.com",
    projectId: "vgksa-f20ae",
    storageBucket: "vgksa-f20ae.appspot.com",
    messagingSenderId: "675347929204"
};
const firebaseApp = firebase.initializeApp(config);
export default firebaseApp;