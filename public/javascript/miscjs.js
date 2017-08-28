<script type="text/javascript">
	
// var fileInput, uploadProgress, message, currentUserId;

// 	function init() {
// 	    var fileInput = document.getElementById('file-upload');
// 	    var uploadProgress = document.getElementById('upload-progress');
// 	    var message = document.getElementById('message');
// 	    var idParam = window.location.href.split("/");
// 	    var currentUserId = idParam[idParam.length - 1];

// 	    fileInput.addEventListener('change', function () {
// 	        var xhr = new XMLHttpRequest(),
// 	            fd = new FormData();

// 	        fd.append('profile', fileInput.files[0]);

// 	        xhr.upload.onloadstart = function (e) {
// 	            uploadProgress.classList.add('visible');
// 	            uploadProgress.value = 0;
// 	            uploadProgress.max = e.total;
// 	            message.textContent = 'Subiendo...';
// 	            fileInput.disabled = true;
// 	        };

// 	        xhr.upload.onprogress = function (e) {
// 	            uploadProgress.value = e.loaded;
// 	            uploadProgress.max = e.total;
// 	        };

// 	        xhr.upload.onloadend = function (e) {
// 	            uploadProgress.classList.remove('visible');
// 	            message.textContent = 'Terminado!';
// 	            fileInput.disabled = false;
// 	        };

// 	        xhr.onload = function () {
// 	            message.textContent = 'Server says: "' + xhr.responseText + '"';
// 	        };

// 	        xhr.open('PUT', '/profile/' + currentUserId ,true);
// 	        xhr.send(fd);
// 	    });
// 	}

// init();
// $(document).ready(function(){
// 	function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
            
//         reader.onload = function (e) {
//             $('#currentAvatar').attr('src', e.target.result);
//         }
            
//         reader.readAsDataURL(input.files[0]);
//         }

//     }
    
//     $("#file-upload").change(function(){
//         readURL(this);

//     }); 

// });
	
  

// $(function(){
// 	document.getElementById("file-upload").addEventListener('change', function (event) {
		
// 		   var fileInput = document.getElementById('file-upload');
// 		   var uploadProgress = document.getElementById('upload-progress');
// 		   var message = document.getElementById('message');
// 		   var idParam = window.location.href.split("/");
// 	       var currentUserId = idParam[idParam.length - 1];
// 		   var postUrl = '/profile/' + currentUserId ;

// 		    fileInput.addEventListener('change', function () {
// 		        let xhr = new XMLHttpRequest(),
// 		            fd = new FormData();

// 		        fd.append('profile', fileInput.files[0]);

// 		        xhr.upload.onloadstart = function (e) {
// 		            uploadProgress.classList.add('visible');
// 		            uploadProgress.value = 0;
// 		            uploadProgress.max = e.total;
// 		            message.textContent = 'uploading...';
// 		            fileInput.disabled = true;
// 		        };

// 		        xhr.upload.onprogress = function (e) {
// 		            uploadProgress.value = e.loaded;
// 		            uploadProgress.max = e.total;
// 		        };

// 		        xhr.upload.onloadend = function (e) {
// 		            uploadProgress.classList.remove('visible');
// 		            message.textContent = 'complete!';
// 		            fileInput.disabled = false;
// 		        };

// 		        xhr.onload = function () {
// 		            message.textContent = 'Server says: "' + xhr.responseText + '"';
// 		        };

// 		        xhr.open('POST', postUrl, true);
// 		        return xhr;
// 		    });
		
// 	})
// })


		// event.preventDefault();

// 		var fileInput = document.getElementById('file-upload');
// 		var idParam = window.location.href.split("/");
// 	    var currentUserId = idParam[idParam.length - 1];
// 		var postUrl = '/profile/' + currentUserId ;
// 		var formData = new FormData();
// 		var xhr = new window.XMLHttpRequest();

// 		formData.append('profile', fileInput.files[0]);

// 		xhr.open('post', 'postUrl', false);

// 		xhr.upload.onprogress = function(e) {
// 			if(e.lengthComputable) {
// 			console.log('Bytes Loaded: ' + e.loaded);
// 				console.log('Total Size:' + e.total);
// 				console.log('Percentage Uploaded:' + e.loaded / e.total);

// 				var percent = Math.round(e.loaded / e.total * 100);

// 				$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
// 				$('#progressBar').attr('aria-valuenow', percent);
// 			}
// 		}
// 		xhr.send(formData);
// 	})
// })


		// xhr.upload.onprogress = function(e) {
		//  if (e.lengthComputable) {
		// 		console.log('Bytes Loaded: ' + e.loaded);
		// 		console.log('Total Size:' + e.total);
		// 		console.log('Percentage Uploaded:' + e.loaded / e.total);

		// 		var percent = Math.round(e.loaded / e.total * 100);

		// 		$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
		// 		$('#progressBar').attr('aria-valuenow', percent);
		// 	}
		// };

		// xhr.upload.addEventListener('progress', function(e) {

		// 	if (e.lengthComputable) {
		// 		console.log('Bytes Loaded: ' + e.loaded);
		// 		console.log('Total Size:' + e.total);
		// 		console.log('Percentage Uploaded:' + e.loaded / e.total);

		// 		var percent = Math.round(e.loaded / e.total * 100);

		// 		$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
		// 		$('#progressBar').attr('aria-valuenow', percent);
		// 	}
		// })

// 		$.ajax({
// 			xhr: function() {
				
// 		xhr.upload.addEventListener('progress', function(e) {

// 				if (e.lengthComputable) {
// 					console.log('Bytes Loaded: ' + e.loaded);
// 					console.log('Total Size:' + e.total);
// 					console.log('Percentage Uploaded:' + e.loaded / e.total);

// 					var percent = Math.round(e.loaded / e.total * 100);

// 					$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
// 					$('#progressBar').attr('aria-valuenow', percent);
// 				}
// 			})

			

// 				return xhr;


// 			},
// 			type: 'POST',
// 			// url:  postUrl,
// 			data: formData,
// 			processData: false,
// 			contentType: false,
// 			success: function(){
// 				alert("Success")
// 			}
// 		})	
		
// 	})

// })

</script>