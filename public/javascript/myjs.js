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
		
	

	})
	/////////////////////////
	/////UPLOAD-PROGRESS/////
	/////////////////////////
	var reader;
	var progress = document.querySelector('.percent');

	function abortRead() {
		reader.abort();
	}

	  function errorHandler(evt) {
	    switch(evt.target.error.code) {
	      case evt.target.error.NOT_FOUND_ERR:
	        alert('File Not Found!');
	        break;
	      case evt.target.error.NOT_READABLE_ERR:
	        alert('File is not readable');
	        break;
	      case evt.target.error.ABORT_ERR:
	        break; // noop
	      default:
	        alert('An error occurred reading this file.');
	    };
	  }

	  function updateProgress(evt) {
	    // evt is an ProgressEvent.
	    if (evt.lengthComputable) {
	      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
	      // Increase the progress bar length.
	      if (percentLoaded < 100) {
	        progress.style.width = percentLoaded + '%';
	        progress.textContent = percentLoaded + '%';
	      }
	    }
	  }

	  function handleFileSelect(evt) {
	   	    // Reset progress indicator on new file selection.
		    progress.style.width = '0%';
		    progress.textContent = '0%';
		    document.getElementById('upload-status').textContent = '';

		    reader = new FileReader();
		    reader.onerror = errorHandler;
		    reader.onprogress = updateProgress;
		    reader.onabort = function(e) {
		      alert('Cancelado');
		    };
		    reader.onloadstart = function(e) {
		      document.getElementById('upload-status').textContent = 'Subiendo...';
		    };
		    reader.onload = function(e) {
		      // Ensure that the progress bar displays 100% at the end.
		      progress.style.width = '100%';
		      progress.textContent = '100%';
		      document.getElementById('upload-status').textContent = 'Terminado';
		    };
	 
		    // Read in the image file as a binary string.
		    reader.readAsBinaryString(evt.target.files[0]);
	  }

	  document.getElementById('file-upload-meme').addEventListener('change', handleFileSelect, false);

	/////////////////////////
	////////GIFPLAYER/////////
	/////////////////////////
	var gifs = document.querySelectorAll('#meme-content');
	function gifs_src(target) {
		return $(this).attr('src');
	}
	var gifs_srcs = $(gifs).map(gifs_src);
	function addclass(target) {
		if(this.indexOf('.gif')){
			$(this).addClass('gifplayer');
		}
	}
	var gifplayerTargets = $(gifs_srcs).map(addclass);
	console.log(gifplayerTargets);
	

//END OF JQUERY
})


