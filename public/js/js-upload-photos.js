var addressList
$(document).ready(function(){

	$('.js-upload-photos').one('click', function(e){
		
		var $this = $(this).parent().find('.owl-carousel')
		$this.owlCarousel({
			items:1,
			lazyLoad:true,
			loop:true,
			margin:10
		})

		$(document.documentElement).keyup(function (ev) { 
			var owl = $this;
			console.log(ev)
			if (ev.keyCode == 37) {
				console.log(ev.keyCode)
				owl.trigger('prev.owl')
			} else if (ev.keyCode == 39) {
				console.log(ev.keyCode)
				owl.trigger('next.owl')
			}
		})

		$(this).hide()
		return false
	})










	// toggle button


	var serachController = document.querySelector('.serachController')
	document.querySelector('.fa-search').parentNode.addEventListener('click', function(){
		serachController.classList.toggle('toggle')
	})






	// search pluggin initialize


	addressList = new List('searchContainer', { 
		valueNames: ['searchLink']
	});


	// var listObj = new List('container', options);

	// $('#search-field').on('keyup', function() {
	// 	var searchString = $(this).val();
	// 	listObj.search(searchString);
	// });


})