$(function() {

	/////////////////
	/////VOTING//////
	/////////////////
	$(".votes").on('click', '.btn-vote', function(){
		$(this).addClass('voted').siblings().removeClass('voted');
	})
	
	var articleId 	= $("article").data("id");

	function votejax(model, article, route, voting, target, color, votediv) {
			$.ajax({
			 url: model + article + route,
			 type: "POST",
			 contentType: "application/json; charset=utf-8",
			  // dataType: "json",
			 data: JSON.stringify({ votes: voting })
			 }).done(function(result){
			 	console.log(result);
			 	update(result);
			 })
			 .fail(function(err) {
			 	console.log(err);
			 })

		function update(vote) {
			target.text(vote);
			votediv.css({"color": color, "font-weight": 700});
		}
	}

	$(".votes").on('click', '.btn-upvote', function(e){
		
		var gagVotes    = $(this).parents(".card").find("#gag-votes");
		var votes       = $(this).parents(".card").find("#votes");
		var updateVote  = parseInt($(this).parents(".card").find("#votes").text()) + 1;

		// $currentVotes.find("#gag-votes").css("color", "blue");

		console.log(votes)
		votejax("/gags/" ,articleId,"/upvote", updateVote, votes, "blue", gagVotes);
	})

	$(".votes").on('click', '.btn-downvote', function(e){
		
		var gagVotes    = $(this).parents(".card").find("#gag-votes");
		var votes       = $(this).parents(".card").find("#votes");
		var updateVote  = parseInt($(this).parents(".card").find("#votes").text()) - 1;

		// $currentVotes.find("#gag-votes").css("color", "blue");

		// console.log(votes)
		votejax("/gags/", articleId,"/downvote", updateVote, votes, "red", gagVotes);
	})

	$(".votes").on('click', '.comment-upvote', function(e){

		var commentId    = $(this).parents(".comment-payload").data("commentId");
		
		var commentVotes = $(this).parents(".comment-input-area").find(".comment-votes");
		var votes        = $(this).parents(".comment-input-area").find("#comment-votes");
		var updateVote   = parseInt($(this).parents(".comment-input-area").find("#comment-votes").text()) + 1;

		// $currentVotes.find("#gag-votes").css("color", "blue");
		// console.log(commentId);
		// console.log(commentVotes);
		// console.log(votes);
		// console.log(updateVote);
		votejax("/comments/", commentId,"/upvote", updateVote, votes, "blue", commentVotes);
	})

	$(".votes").on('click', '.comment-downvote', function(e){

		var commentId    = $(this).parents(".comment-payload").data("commentId");
		
		var commentVotes = $(this).parents(".comment-input-area").find(".comment-votes");
		var votes        = $(this).parents(".comment-input-area").find("#comment-votes");
		var updateVote   = parseInt($(this).parents(".comment-input-area").find("#comment-votes").text()) - 1;

		// $currentVotes.find("#gag-votes").css("color", "blue");
	
		votejax("/comments/", commentId,"/upvote", updateVote, votes, "red", commentVotes);
	})
	//////////////////////
	/////COMMENT-BOX//////
	//////////////////////
	var $payload = $(".payload").clone().addClass('reply');

	$(".comment-reply-link").on("click", function(event) {

		event.preventDefault();
		event.stopPropagation();

		var $commentPayload   = $(this).parents(".comment-payload.col-md-12");
		var $commentRow       = $(this).parents(".row.comments-row");
		var $commentAuthor    = $(this).parents(".comment-input-area").find("#comment-author").text();
		var commentOn         = false;

		function addTextarea(){
			$payload.find("#comment-text").val("");
			$payload.appendTo($commentPayload);
		}

		function addRepliedTo() {
			$payload.find("#comment-text").val('@' + $commentAuthor + " ");
		}

		addTextarea();

		addRepliedTo();
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
		

		console.log(textVal);
		$.ajax({
			 url: "/gags/" + articleId,
			 type: "POST",
			 contentType: "application/json; charset=utf-8",
			  // dataType: "json",
			 data: JSON.stringify({ comment: {text: textVal } })
			 }).done(function(result){
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
						                  '<p id="comment-author"><strong>' + comment.author.username + '</strong></p>' +
						                  '<span class="gag-votes">' + comment.votes + ' Votes</span>' +
						                '</div>' + 
				                	'<p class="comment-main">' + comment.text + '</p>' + 
					                '<div class="comment-cta">' + 
					                  '<a href="" class="comment-reply-link">Reply</a>' +
					                  '<div class="votes">'+
					                  	'<div class="comment-upvote"><span class="glyphicon glyphicon-arrow-up"></div>' +
					                  	'<div class="comment-downvote"><span class="glyphicon glyphicon-arrow-down"></div>' +
					                  '</div>' +
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
					                  '<p id="comment-author"><strong>' + comment.author.username + '</strong></p>' +
					                  '<span class="gag-votes">' + comment.votes + ' Votes</span>' +
					                '</div>' + 
			                	'<p class="comment-main">' + comment.text + '</p>' + 
				                '<div class="comment-cta">' + 
				                  '<a href="" class="comment-reply-link">Reply</a>' +
				                  '<div class="votes">'+
					                  '<div href="" class="comment-upvote"><span class="glyphicon glyphicon-arrow-up"></div>' +
					                  '<div href="" class="comment-downvote"><span class="glyphicon glyphicon-arrow-down"></div>' +
					               '</div>' +
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
	document.getElementById('upload-status').textContent = 'Archivos tipo JPG, PNG, GIF, MP4. Imagen MAX 8MB, Video 50MB'

	function abortRead() {
		reader.abort();
	}

	  function errorHandler(evt) {
	    switch(evt.target.error.code) {
	      case evt.target.error.NOT_FOUND_ERR:
	        alert('El archivo no fue encontrado');
	        break;
	      case evt.target.error.NOT_READABLE_ERR:
	        alert('El archivo no es compatible');
	        break;
	      case evt.target.error.ABORT_ERR:
	        break; // noop
	      default:
	        alert('Un error ha ocurrido. Trate otro archivo');
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
		    document.getElementById('upload-status').textContent = 'Archivos tipo JPG, PNG, GIF, MP4. MAX 10MB';

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
	////////GIFPLAYER////////
	/////////////////////////
	// function gifenabler() {
	// 	var gifs = document.querySelectorAll('#meme-content');
	// 	console.log(gifs[1].src);
	// 	for (var i = 0, len = gifs.length; i < len; i++) {
	// 	  if(gifs[i].src.indexOf(".gif") > 0){
	// 	  	// this.setAttribute('class', 'gifplayer');
	// 	  	gifs[i].setAttribute('class', 'gifplayer');
	// 	  	gifs[i].setAttribute('data-mode', 'video');
	// 	  }
	// 	}
	// }
	
	// gifenabler();
	// $('.gifplayer').gifplayer();

	/////////////////////////
	////////MP4PLAYER////////
	/////////////////////////
	// function mp4enabler() {
	// 	var mp4elements = document.querySelectorAll('#meme-content');

	// 	for (var i = 0, len = mp4elements.length; i < len; i++) {
	// 	  if(mp4elements[i].src.indexOf('.gif') > 0) {
	// 	  	 // mp4elements[i].outerHTML = mp4elements[i].outerHTML.replace(/img/g, "video controls muted preload='none'")
	// 	  	  mp4elements[i].src.replace(".gif", ".mp4");
	// 	  	  console.log(mp4elements)
	// 	  }
	// 	}
	// }
	
	// mp4enabler();

	// /////////////////////////
	// //////VIDEO-CONTROL//////
	// /////////////////////////

	// window.onload = function() {

	//   // Video
	//   var video = document.getElementById("video");

	//   // Buttons
	//   var playButton = document.getElementById("play-pause");
	//   var muteButton = document.getElementById("mute");
	//   var fullScreenButton = document.getElementById("full-screen");

	//   // Sliders
	//   var seekBar = document.getElementById("seek-bar");
	//   var volumeBar = document.getElementById("volume-bar");

	// }

	// /////////////////////////
	// //////BLAZY//////////////
	// /////////////////////////

	var bLazy = new Blazy({});

	// /////////////////////////
	// ////MORE_LOADER//////////
	// /////////////////////////

	$("article").slice(0, 6).show();
	$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
       $("article:hidden").slice(0, 6).slideDown();
        if ($("div:hidden").length == 0) {
            $("#load").fadeOut('slow');
        }
        $('html,body').animate({
            scrollTop: $(this).offset().top
        });
   	}
   	
	// /////////////////////////
	// ////////YOUTUBE//////////
	// /////////////////////////

	$('iframe').attr('id', 'meme-content');

	// /////////////////////////
	// ////////VIDEOJS//////////
	// /////////////////////////
	// 	function actVideo() {
	//     	videojs(document.getElementById('meme-video'), { "width": 600, "height": auto}, function(){
	//     		this.addClass("video-js vjs-default-skin vjs-big-play-centered b-loaded");
	//     	});
	// 	}

	// 	window.onload = actVideo;
	// });

//END OF JQUERY
})


