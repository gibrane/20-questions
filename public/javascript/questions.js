var currentLoginUserObj;
var currentLoginUsername;
var currentLoginUsernameFull;
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		currentLoginUserObj = user;
		currentLoginUsernameFull = user.uid;
		getCurrentUsername();

	}
});

function getCurrentUsername() {
	firebase.database().ref('usernames/' + currentLoginUserObj.uid).once('value').then(function (snapshot) {
		currentLoginUsername = snapshot.val().username;
		currentLoginUsernameFull = currentLoginUserObj.uid;
		addUserToMemberList();
	});
}

//Get window height for scrolling of chat box
var windowHeight = $(window).height();
$('#chat-ul').css("max-height", windowHeight - 175);
$('#questions-tab').css("max-height", windowHeight - 80);









function addUserToMemberList() {
	var userRef = firebase.database().ref("/rooms/" + roomName + "/members/" + currentLoginUsername);
	userRef.once('value', function (snapshot) {
			console.log(snapshot.val());
			if (snapshot.val() == "answer") {
				$("#ask-tab").addClass("hidden");
			} else if (!snapshot.val() || snapshot.val() == "ask") {
				userRef.set("ask");
				$("#answer-tab").addClass("hidden");
			}
		})
		//updateMembersList();
}

/*
function updateMembersList() {
	firebase.database().ref('rooms/' + roomName + "/members").once('value').then(function (snapshot) {
		playersList = snapshot.val();
	}).then(function () {
		for (var player in playersList) {
			addPlayer(player);
		}
	});
}
*/




//Adds data to actual html
function playerDataAddFunction(snapshot) {
	if (snapshot.val() == "ask") {
		console.log("You are in ask");
		$("#players-ul").append('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">person</i>' + snapshot.key + '</span> </li>');
	} else if (snapshot.val() == "answer") {
		console.log("You are in answer");
		$("#players-ul").prepend('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">star rate</i>' + snapshot.key + '</span> </li>');
	}
}


var playerDataAdder = firebase.database().ref("/rooms/" + roomName + "/members");
playerDataAdder.on('child_added', function (snapshot) {
	playerDataAddFunction(snapshot);
	//$('#questions-tab').scrollTop($('#questions-tab').prop("scrollHeight"));
});



/*
var playersList;
function addPlayer(player) {
	firebase.database().ref('usernames/' + player).once('value').then(function (snapshot) {
		var username = snapshot.val().username;
		if (playersList[player] == "ask") {
			$("#players-ul").append('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">person</i>' + username + '</span> </li>');
		} else if (playersList[player] == "answer") {
			$("#players-ul").prepend('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">star rate</i>' + username + '</span> </li>');
		}
	})
}
*/









//All Below edits chat data

var chatUL = $('#chat-ul');

//Adds data to actual html
function chatDataAddFunction(snapshot) {
	chatUL.append('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content">' + snapshot.sender + ": " + snapshot.message + '</span> </li>');
}

//Takes data from firebase and call function above
var chatDataAdder = firebase.database().ref('chats/' + roomName);
chatDataAdder.on('child_added', function (snapshot) {
	chatDataAddFunction(snapshot.val());
	chatUL.scrollTop(chatUL.prop("scrollHeight"));
});

//Function called to write chat data to firebase
function writeChatData(message, sender) {
	firebase.database().ref('chats/' + roomName).push({
		message: message,
		sender: sender,
		timestamp: firebase.database.ServerValue.TIMESTAMP
	});
}
//Adds data if current user types
$('#chat-input').keydown(function (event) {
	if (event.keyCode == 13) {
		if ($('#chat-input').val() != "") {
			writeChatData($('#chat-input').val(), currentLoginUsername);
			$('#chat-input').val('');
			chatUL.scrollTop(chatUL.prop("scrollHeight"));
		}
	}
});









//All Below edits question data

var questionUL = $('#questions-ul');

//Adds data to actual html
function questionDataAddFunction(snapshot) {
	questionUL.append('<li class="mdl-list__item" id="' + snapshot.key + '">' + snapshot.val().question + '<span class="mdl-list__item-primary-content"></span> <i class="material-icons mdl-list__item-icon answer">' + snapshot.val().status + '</i></li>')
	$("#answer-question").empty().append(snapshot.question);
}

//Takes data from firebase and call function above
var questionDataAdder = firebase.database().ref('questions/' + roomName);
questionDataAdder.on('child_added', function (snapshot) {
	questionDataAddFunction(snapshot);
	$('#questions-tab').scrollTop($('#questions-tab').prop("scrollHeight"));
});

//Function called to write question data to firebase
function writeQuestionData(question, sender, status) {
	firebase.database().ref('questions/' + roomName).push({
		question: question,
		sender: sender,
		status: status,
		timestamp: firebase.database.ServerValue.TIMESTAMP
	});
}
//Adds data if current user types
$("#question-input").keydown(function (event) {
	if (event.keyCode == 13) {
		if ($("#question-input").val() != "") {
			writeQuestionData($("#question-input").val(), currentLoginUsername, 'help');
			$("#question-input").val('');
			$('#questions-tab').scrollTop($('#questions-tab').prop("scrollHeight"));
		}
	}
});