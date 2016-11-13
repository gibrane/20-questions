$(document).ready(function () {
    componentHandler.upgradeAllRegistered();
    $('#create-room-button').on('click', createRoom);
    $('#join-room-button').on('click', askForRoom);
    init();
});
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
            //$('#sign-in').hide();
            $('main-buttons-div').removeClass("hidden");
            firebase.database().ref('users/' + user.uid).once('value').then(function (snapshot) {
                $('#spinner').removeClass("is-active");
                if (!snapshot.val()) {
                    writeUserData(signedInUser.uid, signedInUser.displayName, signedInUser.email, signedInUser.photoURL);
                }
                checkUsername(signedInUser.uid);
            });
        }
        else {
            $('#spinner').removeClass("is-active");
            $('#main-signin-div').removeClass("hidden");
        }
    });
}

function saveUsername() {
    var username = $('#username-input').val();
    if (username.length < 40 && username.length > 0) {
        firebase.database().ref('usernames/' + firebase.auth().currentUser.uid).update({
            username: username
        }).then(function () {
            console.log("saved");
            $('#main-save-username-div').addClass("hidden");
            $('#main-buttons-div').removeClass("hidden");
        });
    }
}

function askForRoom() {
    $('#main-buttons-div').addClass("hidden");
    $('#enter-room-name-div').removeClass("hidden");
}

function reqUsername() {
    $('#main-save-username-div').removeClass("hidden");
    $('#main-signin-div').addClass("hidden");
}

function checkUsername(userId) {
    //$('#username').show();
    firebase.database().ref('usernames/' + userId).once('value').then(function (snapshot) {
        if (!snapshot.val()) { //no username
            console.log("need to define username");
            $('#main-signin-div').removeClass("hidden");
            reqUsername();
        }
        else {
            $('#main-signin-div').addClass("hidden");
            $('#main-buttons-div').removeClass("hidden");
            console.log("username ok");
        }
    });
}

function writeUserData(userId, name, email, imageUrl) {
    console.log("write user data called");
    firebase.database().ref('users/' + userId).update({
        name: name
        , email: email
        , profile_picture: imageUrl
        , organizations: []
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

function checkRoom() {
    var roomName = $('#room-name-input').val().toLowerCase();
    if (roomName !== "") {
        firebase.database().ref('/rooms/' + roomName).once('value').then(function (snapshot) {
            if (snapshot.val()) {
                $('#enter-room-div').removeClass("is-invalid");
                var joinUrl = "https://codeday-20-questions.herokuapp.com/questions/" + roomName;
                window.location.href = joinUrl;
            }
            else {
                $('#enter-room-div').addClass("is-invalid");
            }
        });
    }
}

function finishCreateRoom(val) {
    console.log(val);
    var userObj = {};
    firebase.database().ref('/rooms/' + val).once('value').then(function (snapshot) {
        if (!snapshot.val()) {
            userObj[firebase.auth().currentUser.uid] = "answer";
            var db = firebase.database().ref('/rooms/' + val).set({
                members: userObj
            })
            var joinUrl = "https://codeday-20-questions.herokuapp.com/questions/" + val;
            window.location.href = joinUrl;
            console.log(joinUrl);
        }
        else {
            finishCreateRoom(val);
        }
    });
}

function createRoom() {
    $('#main-buttons-div').addClass("hidden");
    $('#spinner').addClass("is-active");
    if (firebase.auth().currentUser.uid) {
        $.ajax("/api/roomname", {
            success: finishCreateRoom
        });
    }
}