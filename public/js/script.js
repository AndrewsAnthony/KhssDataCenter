function handleSelectSelect(evt){
	console.log(evt)
	var objString = JSON.stringify(evt.params.data.parseInfo);
	document.querySelector('input[name="hiddenInfo"]').value = objString;
	$.get('/check/' + evt.params.data.parseInfo[1], successCheckAddress)
}

function handleOpenSelect(evt){
	$(evt.currentTarget).empty().trigger('change')
}

function successCheckAddress(data){
	console.log(data)
	if (data == "Empty"){
		document.querySelector('fieldset').removeAttribute('disabled')
		document.querySelector('.requstInfo').innerHTML = 'Введите информацию в форму'
	} else if (data == "Included") {
		document.querySelector('fieldset').setAttribute('disabled','disabled')
		document.querySelector('.requstInfo').innerHTML = 'Данынй адрес имеется в базе данных'
	}
	// 
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

// if (!createElemtntsForm) var createElemtntsForm = {};
// createElemtntsForm.addButtonToForm = function(elms){
// 	'use strict';
// 	if (!elms) elms = document.querySelectorAll('.addButtonToForm')

// 		var buttonAddBlockInput = document.createElement('button');
// 	buttonAddBlockInput.classList.add('btn', 'btn-default', 'addInput');
// 	buttonAddBlockInput.innerHTML = 'Добавить элемент';

// 	var buttonRemoveBlockInput = document.createElement('button');
// 	buttonRemoveBlockInput.classList.add('btn', 'btn-default', 'removeInput');
// 	buttonRemoveBlockInput.innerHTML = 'Убрать элемент'

// 	function handleAddBlockInput(e){
// 		e.preventDefault();
// 		var button = e.currentTarget;
// 		var parent = button.parentNode;
// 		var divs = parent.querySelectorAll('div');
// 		var cloneBlock = parent.querySelector('div').cloneNode(true);
// 		var cloneInputs = cloneBlock.querySelectorAll('input');
// 		for(var i = 0; i < cloneInputs.length; i++){
// 			cloneInputs[i].value = '';
// 			var AttributeName = cloneInputs[i].getAttribute('name');
// 			cloneInputs[i].setAttribute('name', AttributeName.replace(/\[(\d+)\]/g,'[' + divs.length + ']'));
// 		}
// 		button.insertAdjacentElement('beforeBegin', cloneBlock);
// 		return false;
// 	}

// 	function handleRemoveBlockInput(e){
// 		console.log(e)
// 		e.preventDefault();
// 		var countDivs = e.currentTarget.parentNode.querySelectorAll('div');
// 		if (countDivs.length !== 1) countDivs[countDivs.length - 1].remove();
// 		return false;
// 	}
// 	for(var i = 0; i < elms.length; i++){
// 		var clone = buttonAddBlockInput.cloneNode(true)
// 		clone.addEventListener('click', handleAddBlockInput);
// 		elms[i].insertAdjacentElement('beforeend', clone)

// 		clone = buttonRemoveBlockInput.cloneNode(true)
// 		clone.addEventListener('click', handleRemoveBlockInput);
// 		elms[i].insertAdjacentElement('beforeend', clone)
// 	}
// }

// createElemtntsForm.addInputsBlock = function(opts){
// 	var   options = {}  //default options
// 		, i     	//iteration variables
// 		, n
// 		, len
// 		, input
// 		, attr
// 		, parent;

// 		for(i in opts){
// 			if (opts.hasOwnProperty(i)) {
// 				options[i] = opts[i];
// 			}
// 		}
// 		console.log("options", options);
// 		var label = document.createElement('label');
// 		label.classList.add('control-label')
// 		label.innerHTML = options.label

// 		var block = document.createElement('div')
// 		if(options.blockClass) {
// 			block.classList.add.apply(block.classList, options.blockClass)
// 		}

// 		if(options.inputs){
// 			for(i = 0, len = options.inputs.length; i < len; i++){
// 				input = document.createElement('input');
// 				input.classList.add.apply(input.classList, options.inputs[i].classList);
// 				for (n in options.inputs[i].attribute ){
// 					if (options.inputs[i].attribute.hasOwnProperty(n)) {
// 						input.setAttribute(n, options.inputs[i].attribute[n]);
// 					}
// 				}
// 				block.appendChild(input)
// 			}
// 		}

// 		if (options.element){
// 			parent = options.element
// 		} else {
// 			parent = document.createElement('div');
// 			parent.classList.add('form-group')
// 			document.forms[0].appendChild(parent)
// 		}
// 		parent.appendChild(label)
// 		parent.appendChild(block)

// 		return this;
// 	}