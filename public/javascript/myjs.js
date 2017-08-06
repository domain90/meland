$(function() {

	// $('.body-half a').click(function() {
	// 	var title = "Hello, the test worked!"
    //  $('.modal-title').html(title);
	// });

	/////////////////
	/////VOTING//////
	/////////////////
	$(".upvote").on("click", function(){
		$(this).toggleClass("upvoted");
		$(this).children().toggleClass("upvoted");
	})

	$(".downvote").on("click", function(){
		$(this).toggleClass("downvoted");
		$(this).children().toggleClass("downvoted");
	})

	///////////////////////
	/////COMMENT-BOX/////
	//////////////////////
	var $payload = $(".payload").clone().addClass('reply');

	$(".comment-reply-link").on("click", function(event) {

		event.preventDefault();
		event.stopPropagation();

		// var dataId = $(this).parents(".comment-payload.col-md-12").data("commentId");
		var $commentPayload = $(this).parents(".comment-payload.col-md-12");
		var $commentRow = $(this).parents(".row.comments-row");
		var commentOn = false;

		function addComment(){
			$payload.appendTo($commentPayload);
			// if(commentOn == false){
			// 	$payload.clone().appendTo($commentRow);
			// 	$commentOn = true;
			// } else {
			// 	$payload.appendTo($commentRow);
			// }
		}
		addComment();
		// console.log(dataId);
	})

	///////////////////////
	/////COMMENT-POST/////
	//////////////////////
	$("#commentSubmit").on("click", function(e){

		e.preventDefault();
		e.stopPropagation();

		var articleId 		 = $("article").data("id");
		var commentContainer = $(".comments-container");
		var commentRow 	 	 = $(this).parents(".row.comments-row");
		var textVal          = $(this).parents('form').find("textarea#comment-text.comment-input").val();
		// var divParent 		 = $(this).closest(".comment-payload");
		// var commentId = divParent.data("commentId");
		console.log(textVal);
		$.ajax({
			 url: "/gags/" + articleId,
			 type: "POST",
			 contentType: "application/json; charset=utf-8",
			  // dataType: "json",
			 data: JSON.stringify({ comment: {text: textVal } })
			 }).done(function(result){
			 	// console.log(JSON.parse(result));
			 	// console.log(result.author.username);
			 	console.log(result);
			 	addComment(result);
			 })
			 .fail(function(err) {
			 	console.log(err);
			 })

		var addComment = function (comment) {
			var payload =  '<div class="row comments-row">' +
								'<div class="comment-payload col-md-12" data-comment-id=' + comment._id + '>' +
				              		'<div class="comment-user-container">' + 
				                		'<img src=' + comment.author.avatar + ' class="user_avatar">' + 
				              		'</div>' +
				              		'<div class="comment-input-area">' + 
						                '<div class="comment-meta">' + 
						                  '<strong>' + comment.author.username + '</strong>' +
						                  '<span class="gag-votes">' + comment.votes + ' Votes</span>' +
						                '</div>' + 
				                	'<p class="comment-main">' + comment.text + '</p>' + 
					                '<div class="comment-cta">' + 
					                  '<a href="" class="comment-reply-link">Reply</a>' +
					                  '<a href=""><span class="glyphicon glyphicon-arrow-up"></a>' +
					                  '<a href=""><span class="glyphicon glyphicon-arrow-down"></a>' +
					                '</div>' +
					              '</div>' + 
					            '</div>' +
					        '</div>';
			commentContainer.append(payload).focus();			     
		}
	})

	/////////////////////////
	////////AJAX-REPLY///////
	/////////////////////////
	$(document).on("click", "#commentSubmit", function(e){

		e.preventDefault();
		e.stopPropagation();

		var articleId 		 = $("article").data("id");
		var commentRow 	 	 = $(this).parents(".row.comments-row");
		var textVal          = $(this).parents('form').find("textarea#comment-text.comment-input").val();
		var commentParent    = $(this).parents(".comment-payload").data("commentId");

		console.log(textVal);
		$.ajax({
			 url: "/gags/" + articleId + "/comment/" + commentParent + "/reply",
			 type: "POST",
			 contentType: "application/json; charset=utf-8",

			 data: JSON.stringify({ comment: {text: textVal } })
			 }).done(function(result){
			 	console.log(result);
			 	addComment(result);
			 	removeReply();
			 })
			 .fail(function(err) {
			 	console.log(err);
			 })
		

		var addComment = function (comment) {
			var payload =  '<div class="comment-payload col-md-12" data-comment-id=' + comment._id + '>' +
			              		'<div class="comment-user-container">' + 
			                		'<img src=' + comment.author.avatar + ' class="user_avatar">' + 
			              		'</div>' +
			              		'<div class="comment-input-area">' + 
					                '<div class="comment-meta">' + 
					                  '<strong>' + comment.author.username + '</strong>' +
					                  '<span class="gag-votes">' + comment.votes + ' Votes</span>' +
					                '</div>' + 
			                	'<p class="comment-main">' + comment.text + '</p>' + 
				                '<div class="comment-cta">' + 
				                  '<a href="" class="comment-reply-link">Reply</a>' +
				                  '<a href=""><span class="glyphicon glyphicon-arrow-up"></a>' +
				                  '<a href=""><span class="glyphicon glyphicon-arrow-down"></a>' +
				                '</div>' +
				              '</div>' + 
				            '</div>';
			commentRow.append(payload).focus();			     
		}
		var removeReply = function() {
			var replybox = $(".reply");
			replybox.remove();
		}
	})
})