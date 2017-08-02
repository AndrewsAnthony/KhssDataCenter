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










	// reset input button

	document.querySelector('#resetSearch').addEventListener('click', function(e){
		document.querySelector('.serachController').value = '';
		addressList.search('');
	})




	// search pluggin initialize


	var addressList = new List('searchContainer', { 
		valueNames: ['searchLink'],
		listClass: 'listContainer'
	});

	$('.serachController').on('keyup', function() {
		var searchString = $(this).val();
		addressList.search(searchString);
	});





	// stick navbar to top when scrolling
	$('#scrollMoveDown').click(function(e){
		$("html, body").stop().animate({ scrollTop: $(document).height()-$(window).height() });
	})

	$('#scrollMoveUp').click(function(e){
		$("html, body").stop().animate({ scrollTop: 0 });
	})


})
