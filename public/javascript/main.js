$('#question-input').keydown(function (event) {
	if (event.keyCode == 13) {
		$("#questions-div").prepend(
			'<li class="mdl-list__item">' + $("#question-input").val() + '<span class="mdl-list__item-primary-content"></span> </li>');
		$("#question-input").val('');
	}
});