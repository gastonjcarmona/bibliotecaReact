import { createStore, compose, combineReducers} from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer} from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

//custom reducers
import buscarUsuarioReducer from './reducers/buscarUsurioReducer';

// configurar firestore
const firebaseConfig = {
    apiKey: "AIzaSyDTbAtjzb_d1khnos-6WzxbJE3Clz3oOlc",
    authDomain: "bibliostore-b2068.firebaseapp.com",
    databaseURL: "https://bibliostore-b2068.firebaseio.com",
    projectId: "bibliostore-b2068",
    storageBucket: "bibliostore-b2068.appspot.com",
    messagingSenderId: "426693236963",
    appId: "1:426693236963:web:c8b6350584589fda"
}

//inicializar firebase
firebase.initializeApp(firebaseConfig);

//configuracion react-redux
const rrfConfig = {
    userProfile: 'users',
    userFirestoreForProfile: true
}

//crear el enhacer con compose  de redux y firestore

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

//reducers

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    usuario: buscarUsuarioReducer
})

//state inicial
const initialState = {};

const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) );

export default store;