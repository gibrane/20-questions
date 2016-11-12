$(document).ready(function () {});
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBtUSHUtx1KZcq7GOjGsDuQOBl8LM6aeow"
    , authDomain: "questions-codeday.firebaseapp.com"
    , databaseURL: "https://questions-codeday.firebaseio.com"
    , storageBucket: "questions-codeday.appspot.com"
    , messagingSenderId: "576910719703"
};

function init() {
    console.log("hi");
    //firebaseInit();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            signedInUser = user;
            $('#sign-in').hide();
            firebase.database().ref('users/' + user.uid).once('value').then(function (snapshot) {
                if (!snapshot.val()) {
                    writeUserData(signedInUser.uid, signedInUser.displayName, signedInUser.email, signedInUser.photoURL);
                }
                getUserOrgs();
            });
        }
    });
}

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        signedInUser = user;
        console.log(signedInUser);
        console.log("Login Succeeded!");
        console.log(user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log("Login Failed!");
        console.log(errorCode, errorMessage, email, credential);
    });
}