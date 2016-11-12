$(document).ready(function () {
	$('#create-room-button').on('click', createRoom);
	init();
});
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBtUSHUtx1KZcq7GOjGsDuQOBl8LM6aeow",
	authDomain: "questions-codeday.firebaseapp.com",
	databaseURL: "https://questions-codeday.firebaseio.com",
	storageBucket: "questions-codeday.appspot.com",
	messagingSenderId: "576910719703"
};

function init() {
	console.log("hi");
	//firebaseInit();
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {;
			signedInUser = user;
			$('#sign-in').hide();
			firebase.database().ref('users/' + user.uid).once('value').then(function (snapshot) {
				if (!snapshot.val()) {
					writeUserData(signedInUser.uid, signedInUser.displayName, signedInUser.email, signedInUser.photoURL);
				}
				checkUsername(signedInUser.uid);
			});
		}
	});
}

function saveUsername() {
	var username = $('#username-input').val();
	if (username.length < 40 && username.length > 0) {
		firebase.database().ref('usernames/' + firebase.auth().currentUser.uid).update({
			username: $('#username').val()
		}).then(function () {
			console.log("saved");
			$('#main-save-username-div').addClass("hidden");
		});
	}
}
//1. finish request username
//2. use save-username button and save username to firebase using firebase.database().ref('users/' + userId).update({ object here}) 
function reqUsername() {
	$('#main-save-username-div').removeClass("hidden");
	$('#main-signin-div').addClass("hidden");
}

function checkUsername(userId) {
	//$('#username').show();
	firebase.database().ref('usernames/' + userId).once('value').then(function (snapshot) {
		if (!snapshot.val()) { //no username
			console.log("need to define username");
			reqUsername();
		} else {
			console.log("username ok");
		}
	});
}

function writeUserData(userId, name, email, imageUrl) {
	console.log("write user data called");
	firebase.database().ref('users/' + userId).update({
		name: name,
		email: email,
		profile_picture: imageUrl,
		organizations: []
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

function createRoom() {
	if (firebase.auth().currentUser.uid) {
		var db = firebase.database().ref('/rooms'),
			newRoom = db.push()
		newRoom.set({
			members: [firebase.auth().currentUser.uid]
		})
		var joinUrl = "https://codeday-20-questions.herokuapp.com/room/" + newRoom.key;
		console.log(joinUrl);
	}
}