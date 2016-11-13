var currentLoginUserObj;
var currentLoginUsername;
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		currentLoginUserObj = user;
		getCurrentUsername();
	}
});

function getCurrentUsername() {
	firebase.database().ref('usernames/' + currentLoginUserObj.uid).once('value').then(function (snapshot) {
		currentLoginUsername = snapshot.val().username;
	});
}

//Get window height for scrolling of chat box
var windowHeight = $(window).height();
$('#chat-ul').css("max-height", windowHeight - 175);
$('#questions-tab').css("max-height", windowHeight - 80);

$('#question-input').keydown(function (event) {
	if (event.keyCode == 13) {
		$("#questions-ul").append(
			'<li class="mdl-list__item">' + $("#question-input").val() + '<span class="mdl-list__item-primary-content"></span> <i class="material-icons mdl-list__item-icon answer">help</i></li>');
		$("#question-input").val('');
		var div = $('#questions-tab');
		div.scrollTop(div.prop("scrollHeight"));
	}
});


function addPlayer(player) {
	firebase.database().ref('usernames/' + player).once('value').then(function (snapshot) {
		var username = snapshot.val().username;
		if (playersList[player] == "ask") {
			$("#players-ul").append(
				'<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">person</i>' + username +
				'</span> </li>');
		} else if (playersList[player] == "answer") {
			$("#players-ul").prepend(
				'<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">star rate</i>' + username +
				'</span> </li>');
		}
	})
}

var playersList;

firebase.database().ref('rooms/' + roomName + "/members").once('value').then(function (snapshot) {
	playersList = snapshot.val();
}).then(function () {
	for (var player in playersList) {
		addPlayer(player);
	}
});

$('#chat-input').keydown(function (event) {
	if (event.keyCode == 13) {
		$("#chat-ul").append('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content">' + currentLoginUsername + ": " + $("#chat-input").val() + '</span> </li>')
		$("#chat-input").val('');
		var div = $('#chat-ul');
		div.scrollTop(div.prop("scrollHeight"));
	}
});