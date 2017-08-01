$(document).ready(function(){
// BOOTBOX PLUGIN

bootbox.setLocale('ru')
function handleBeforeSubmitForm(e){
	e.preventDefault();
	function callback(result){
		if (result) e.target.submit()
	}

var message = 'Вы уверены введенных данных?'
return bootbox.confirm(message, callback)
}

document.querySelector('.form').addEventListener('submit', handleBeforeSubmitForm)



function handleSelectSelect(evt){
	var objString = JSON.stringify(evt.params.data.parseInfo);
	document.querySelector('input[name="hiddenInfo"]').value = objString;
	$.get('/check/' + evt.params.data.parseInfo[1], successCheckAddress)
}

function handleOpenSelect(evt){
	$(evt.currentTarget).empty().trigger('change')
}

function successCheckAddress(data){
	if (data == "Empty"){
		document.querySelector('fieldset').removeAttribute('disabled')
		var inf = document.querySelector('.requstInfo')
		inf.classList.remove('shake')
		inf.innerHTML = 'Форма разблокирована';
		setTimeout(function(){ inf.classList.add('shake') }, 500)

	} else if (data == "Included") {
		document.querySelector('fieldset').setAttribute('disabled','disabled')
		var inf = document.querySelector('.requstInfo')
		inf.classList.remove('shake')
		inf.innerHTML = 'Форма заблокирована';
		bootbox.alert('По данному адресу уже внесены данны. Просьба перейдите в список обследованных адресов', function(){})
	}
}

$.fn.select2.defaults.set("theme", "bootstrap")

$("#js-fetch-list-of-buildings-ajax").select2({
	ajax: {
		url: "/street",
		type: 'POST',
		dataType: 'json',
		delay: 300,
		beforeSend: function(xhr, obj){
			if(obj.data == "") {
				xhr.done()
			}
		},
		data: function (params) {
			var match = params.term.match(/([а-я]+)\s+(\d+)/i)
			if(match === null || match[2] === null) {
				return "";
			}
			return {
				adress1: match[1],
				adress2: match[2]
			};
		},
		processResults: function (data, params) {
			data = data.map(function(obj, ind){
				var str = '';
				if (obj[9] !== "") {
					str = " (" + obj[9] +")"
				}
				return {
					id: ind,
					text: obj['6'] + ' ' + obj['7'] + ', ' +  obj['11'] + str,
					parseInfo: obj
				}
			})
			return {
				results: data
			}			
		},
		cache: true
	},
	// allowClear: true,
	minimumInputLength: 3,
	language: "ru",
}).on("select2:select", handleSelectSelect).on("select2:open", handleOpenSelect); 

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
