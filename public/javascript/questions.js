var currentLoginUserObj;
var currentLoginUsername;
var currentLoginUsernameFull;
$(document).ready(function () {})
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentLoginUserObj = user;
        currentLoginUsernameFull = user.uid;
        getCurrentUsername();
    }
    else {
        signIn();
    }
});

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

function getCurrentUsername() {
    firebase.database().ref('usernames/' + currentLoginUserObj.uid).once('value').then(function (snapshot) {
        currentLoginUsername = snapshot.val().username;
        currentLoginUsernameFull = currentLoginUserObj.uid;
        addUserToMemberList();
    });
}
//Get window height for scrolling of chat box
var windowHeight = $(window).height();
$('#chat-ul').css("height", windowHeight - 175);
$('#questions-tab').css("max-height", windowHeight - 80);
/*console.log($('#chat-ul').length);
if ($('#chat-ul').children().length === 0) {
    writeChatData("Welcome to 20 Questions. People will be able to join this room with the code: " + roomName + '.', "System");
}*/
//alert("Welcome to 20 Questions. People will be able to join this room with the code: " + roomName + '.');
function addUserToMemberList() {
    var userRef = firebase.database().ref("/rooms/" + roomName + "/members/" + currentLoginUsername);
    userRef.once('value', function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() == "answer") {
                $("#ask-tab").addClass("hidden");
            }
            else if (!snapshot.val() || snapshot.val() == "ask") {
                userRef.set("ask");
                $("#answer-tab").addClass("hidden");
                listenForQuestionsToAnswer();
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
function showNextQuestion() {
    console.log("called")
    if (questionsToAnswer.length > 0) {
        $('.answer-question').text(questionsToAnswer[0].question);
        $('.answer-question').attr("id", questionsToAnswer[0].id);
    }
    else {
        $('#answer-choices').addClass('hidden');
        $('.answer-question').text("No questions right now");
    }
}

function sendQuestionResponse(val) {
    var response = "";
    var gameFinished = false;
    switch (val) {
    case 0:
        response = "done";
        break;
    case 1:
        response = "clear";
        break;
    case 2:
        response = "done";
        gameFinished = true;
        break;
    }
    console.log(response);
    var qId = $('.answer-question').attr("id");
    firebase.database().ref('/questions/' + roomName + "/" + questionsToAnswer[0].id).update({
        status: response
    }).then(function () {
        questionsToAnswer.splice(0, 1);
        console.log("new questionsToAnswer", questionsToAnswer);
        if (gameFinished) {
            writeChatData("Congrats, you guessed it!", "System");
            writeChatData(" <a href='../../'> Create a new game</a>", "System");
        }
        else {
            showNextQuestion();
        }
    })
}
var questionsToAnswer = [];

function listenForQuestionsToAnswer() {
    firebase.database().ref('questions/' + roomName).orderByChild('status').equalTo("help").on('child_added', function (snapshot) {
        console.log(snapshot.key);
        var myObj = snapshot.val();
        myObj.id = snapshot.key;
        questionsToAnswer.push(myObj);
        console.log(questionsToAnswer);
        console.log("query result", snapshot.val());
        $('#answer-choices').removeClass('hidden');
        showNextQuestion();
    })
}
firebase.database().ref('questions/' + roomName).on('child_changed', function (snapshot) {
    console.log("li#" + snapshot.key + " > i");
    $("li#" + snapshot.key + " > i").text(snapshot.val().status);
    if (snapshot.val().status == "done") {
        $("li#" + snapshot.key + " > i").addClass("right");
    }
    else if (snapshot.val().status == "clear") {
        $("li#" + snapshot.key + " > i").addClass("wrong");
    }
});
//Adds data to actual html
function playerDataAddFunction(snapshot) {
    if (snapshot.val() == "ask") {
        console.log("You are in ask");
        $("#players-ul").append('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">person</i>' + snapshot.key + '</span> </li>');
    }
    else if (snapshot.val() == "answer") {
        console.log("You are in answer");
        $("#players-ul").prepend('<li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">star rate</i>' + snapshot.key + '</span> </li>');
        listenForQuestionsToAnswer();
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
        message: message
        , sender: sender
        , timestamp: firebase.database.ServerValue.TIMESTAMP
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
    if (snapshot.val().status == "done") {
        $("li#" + snapshot.key + " > i").addClass("right");
    }
    else if (snapshot.val().status == "clear") {
        $("li#" + snapshot.key + " > i").addClass("wrong");
    }
    //$("#answer-question").empty().append(snapshot.question);
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
        question: question
        , sender: sender
        , status: status
        , timestamp: firebase.database.ServerValue.TIMESTAMP
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