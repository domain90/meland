$(function() {

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

	/////////////////////////
	////////FB-SHARE/////////
	/////////////////////////
	$('#share_button').click(function(e){

		e.preventDefault();

		var gagLink    = $(this).attr('href');
		var gagTitle   = $('.head-title').find('h3').text();
		var gagPicture = $('.content-img').find('img').attr('src');

		FB.ui({
		   method: 'share_open_graph',
		        action_type: 'og.shares',
		        action_properties: JSON.stringify({
		            object : {
		               'og:url': "https://meland.herokuapp.com" + gagLink,
		               'og:title': gagTitle,
		               'og:description': 'Haz reir a tus amigos!',
		               'og:image': gagPicture
		  }}), function(response){
		        	window.close();
		        }});
		
	/////////////////////////
	/////UPLOAD-PROGRESS/////
	/////////////////////////	
	// $('#file-upload').addEventListener('change', function (event) {
	// 	event.preventDefault();

	// 	var postUrl = window.location.href;

	// 	var formData = new FormData($('#file-upload')[0])

	// 	$.ajax({
	// 		xhr: function() {
	// 			var xhr = new window.XMLHttpRequest();

	// 			xhr.upload.addEventListener('progress', function(e) {

	// 				if (e.lengthComputable) {
	// 					console.log('Bytes Loaded' + e.loaded);
	// 					console.log('Total Size:' + e.total);
	// 					console.log('Percentage Uploaded:' + e.loaded / e.total);

	// 					var percent = Math.round(e.loaded / e.total * 100);
	// 				}

	// 			});

	// 			return xhr;


	// 		},
	// 		type: 'POST',
	// 		url:  postUrl,
	// 		data: formData,
	// 		processData: false,
	// 		contentType: false,
	// 		success: function(){

	// 		}
	// 	})	
		
	// })

	var fileInput, uploadProgress, message;

	function init() {
	    var fileInput = document.getElementById('file-upload');
	    var uploadProgress = document.getElementById('upload-progress');
	    var message = document.getElementById('message');

	    fileInput.addEventListener('change', function () {
	        var xhr = new XMLHttpRequest(),
	            fd = new FormData();

	        fd.append('file', fileInput.files[0]);

	        xhr.upload.onloadstart = function (e) {
	            uploadProgress.classList.add('visible');
	            uploadProgress.value = 0;
	            uploadProgress.max = e.total;
	            message.textContent = 'Subiendo...';
	            fileInput.disabled = true;
	        };

	        xhr.upload.onprogress = function (e) {
	            uploadProgress.value = e.loaded;
	            uploadProgress.max = e.total;
	        };

	        xhr.upload.onloadend = function (e) {
	            uploadProgress.classList.remove('visible');
	            message.textContent = 'Terminado!';
	            fileInput.disabled = false;
	        };

	        xhr.onload = function () {
	            message.textContent = 'Server says: "' + xhr.responseText + '"';
	        };

	        xhr.open('POST', 'profile.js' ,true);
	        xhr.send(fd);
	    });
	}

	init();
	// var formData = new FormData();
	// var file = document.getElementById('#file-upload').files[0];
	// formData.append('myFile', file);
	// var xhr = new XMLHttpRequest();

	// // your url upload
	// xhr.open('post', '/urluploadhere', true);

	// xhr.upload.onprogress = function(e) {
	//   if (e.lengthComputable) {
	//     var percentage = (e.loaded / e.total) * 100;
	//     console.log(percentage + "%");
	//   }
	// };

	// xhr.onerror = function(e) {
	//   console.log('Error');
	//   console.log(e);
	// };
	// xhr.onload = function() {
	//   console.log(this.statusText);
	// };

	// xhr.send(formData);

	})
})

