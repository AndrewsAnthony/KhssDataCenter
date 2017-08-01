$(document).ready(function(){

	var inputElement = document.getElementById("photoCallery");
	inputElement.addEventListener("change", handleFiles, false);
	function handleFiles() {
		var fileList = this.files;
		var preview = document.querySelector('.help-block .row')
		preview.innerHTML = '';
		for (var i = 0, numFiles = fileList.length; i < numFiles; i++) {
			var file = fileList[i];
			var imageType = /^image\//;
			if (!imageType.test(file.type)) {
				continue;
			}
			var img = document.createElement("img");
			img.file = file;
			preview.appendChild(img); 

			var reader = new FileReader();
			reader.onload = (function(aImg) { return function(e) {
				aImg.src = e.target.result;

				aImg.onload = function() {      
					var width = this.width;
					var hight = this.height;
					if(width>hight) {
						this.classList.add("image66");
					} else {
						this.classList.add("image33");
					}
				}  
			}; 
		})(img);
		reader.readAsDataURL(file);
	}
}

})


