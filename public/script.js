function addButtonToForm (elms){
	'use strict';
	if (!elms) elms = document.querySelectorAll('.addButtonToForm')

	var buttonAddBlockInput = document.createElement('button');
	buttonAddBlockInput.classList.add('btn', 'btn-default', 'addInput');
	buttonAddBlockInput.innerHTML = 'Добавить элемент';

	var buttonRemoveBlockInput = document.createElement('button');
	buttonRemoveBlockInput.classList.add('btn', 'btn-default', 'removeInput');
	buttonRemoveBlockInput.innerHTML = 'Убрать элемент'

	function handleAddBlockInput(e){
		console.log(e)
		e.preventDefault();
		var button = e.currentTarget;
		var parrent = button.parentNode;
		var divs = parrent.querySelectorAll('div');
		var cloneBlock = parrent.querySelector('div').cloneNode(true);
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