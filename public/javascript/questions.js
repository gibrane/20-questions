$('#question-input').keydown(function (event) {
	if (event.keyCode == 13) {
		$("#questions-div").prepend(
			'<li class="mdl-list__item">' + $("#question-input").val() + '<span class="mdl-list__item-primary-content"></span> <i class="material-icons mdl-list__item-icon answer">help</i></li>');
		$("#question-input").val('');
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