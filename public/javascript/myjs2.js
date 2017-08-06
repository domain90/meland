$(function() {

	// AJAX Reply
	$(document).on("click", "#commentSubmit", function(e){

		e.preventDefault();
		e.stopPropagation();

		var articleId 		 = $("article").data("id");
		// var commentContainer = $(".comment-container");
		// var $commentRow 	 = $(this).parents(".row.comments-row");
		// var divParent 		 = $(this).closest(".comment-payload");
		console.log(articleId);
		// var commentId = divParent.data("commentId");

		// $.ajax({
		// 	 url: "/gags/" + articleId,
		// 	 // dataType: "json",
		// 	 type: "POST",
		// 	 contentType: "application/json; charset=utf-8",
		// 	 data: { text: $("#comment-text").val() }
		// 	 }).done(function(result){
		// 	 	console.log(result.text);
		// 	 	addComment(result);
		// 	 })
		// 	 .fail(function(err) {
		// 	 	console.log(err);
		// 	 })
		

		// var addComment = function (comment) {
		// 	var payload = "<div>" + comment.text + "</div>";
		// 	commentRow.append(payload);			     
		// }

		// // console.log($("#comment-text").val())

	})

})



