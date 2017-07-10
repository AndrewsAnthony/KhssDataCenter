if (!createElemtntsForm) var createElemtntsForm = {};
createElemtntsForm.addButtonToForm = function(elms){
	'use strict';
	if (!elms) elms = document.querySelectorAll('.addButtonToForm')

	var buttonAddBlockInput = document.createElement('button');
	buttonAddBlockInput.classList.add('btn', 'btn-default', 'addInput');
	buttonAddBlockInput.innerHTML = 'Добавить элемент';

	var buttonRemoveBlockInput = document.createElement('button');
	buttonRemoveBlockInput.classList.add('btn', 'btn-default', 'removeInput');
	buttonRemoveBlockInput.innerHTML = 'Убрать элемент'

	function handleAddBlockInput(e){
		e.preventDefault();
		var button = e.currentTarget;
		var parent = button.parentNode;
		var divs = parent.querySelectorAll('div');
		var cloneBlock = parent.querySelector('div').cloneNode(true);
		var cloneInputs = cloneBlock.querySelectorAll('input');
		for(var i = 0; i < cloneInputs.length; i++){
			cloneInputs[i].value = '';
			var AttributeName = cloneInputs[i].getAttribute('name');
			cloneInputs[i].setAttribute('name', AttributeName.replace(/\[(\d+)\]/g,'[' + divs.length + ']'));
		}
		button.insertAdjacentElement('beforeBegin', cloneBlock);
		return false;
	}

	function handleRemoveBlockInput(e){
		console.log(e)
		e.preventDefault();
		var countDivs = e.currentTarget.parentNode.querySelectorAll('div');
		if (countDivs.length !== 1) countDivs[countDivs.length - 1].remove();
		return false;
	}
	for(var i = 0; i < elms.length; i++){
		var clone = buttonAddBlockInput.cloneNode(true)
		clone.addEventListener('click', handleAddBlockInput);
		elms[i].insertAdjacentElement('beforeend', clone)

		clone = buttonRemoveBlockInput.cloneNode(true)
		clone.addEventListener('click', handleRemoveBlockInput);
		elms[i].insertAdjacentElement('beforeend', clone)
	}
}

createElemtntsForm.addInputsBlock = function(opts){
	var   options = {}  //default options
		, i     	//iteration variables
		, n
		, len
		, input
		, attr
		, parent;

		for(i in opts){
			if (opts.hasOwnProperty(i)) {
				options[i] = opts[i];
			}
		}
		console.log("options", options);
		var label = document.createElement('label');
		label.classList.add('control-label')
		label.innerHTML = options.label
		
		var block = document.createElement('div')
		if(options.blockClass) {
			block.classList.add.apply(block.classList, options.blockClass)
		}
		
		if(options.inputs){
			for(i = 0, len = options.inputs.length; i < len; i++){
				input = document.createElement('input');
				input.classList.add.apply(input.classList, options.inputs[i].classList);
				for (n in options.inputs[i].attribute ){
					if (options.inputs[i].attribute.hasOwnProperty(n)) {
						input.setAttribute(n, options.inputs[i].attribute[n]);
					}
				}
				block.appendChild(input)
			}
		}

		if (options.element){
			parent = options.element
		} else {
			parent = document.createElement('div');
			parent.classList.add('form-group')
			document.forms[0].appendChild(parent)
		}
		parent.appendChild(label)
		parent.appendChild(block)

		return this;
	}