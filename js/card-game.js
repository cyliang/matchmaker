var cardGame = {
	prepare: function() {
				 this._seq = [1, 2, 3, 4, 5, 6, 7, 8];
				 this._seq = shuffle(this._seq.concat(this._seq));

				 this._panel = $('#card-panel');
				 this._cards = [];
				 this._remain = 16;
				 _this = this;

				 for (i = 0; i < 4; i++) {
					 var row = $('<div>').addClass('row gamerow').appendTo(this._panel);

					 for (j = 0; j < 4; j++) {
						 var id = i * 4 + j;

						 this._cards.push(
							 $('<div>').addClass('col-md-1 col-md-push-4 col-xs-2 col-xs-push-2').html(
								 '<div class="card">' +
									 '<div class="card-front"></div>' +
									 '<div class="card-back card' + this._seq[id] + '"></div>' +
								 '</div>'
							 ).appendTo(row).data('card-id', id).click(function() {
								 _this.click($(this).data('card-id'));
							 })
						 );
					 }
				 }
			 },

	start: function() {
			   $('#counter').tinyTimer({
				   from: Date.now(),
			   	   format: "%S"
			   });

			   this._playerName = $('#player-name').val();
		   },

	click: function(id) {
			   var _this = this;
			   var clickedCard = _this._cards[id];

			   if (_this._animating || _this._flippedCard != null && clickedCard == _this._flippedCard)
				   return;

			   _this._animating = true;
			   _this.flip(clickedCard, function() {

				   if (_this._flippedCard != null) {
					   if (_this._seq[id] == _this._seq[_this._flippedCard.data('card-id')]) {
						   _this._remain -= 2;
						   _this._flippedCard.animate({
							   top: '-=10px',
							   opacity: 0
						   }, 500, "linear", function() {
							   $(this).off('click').children().css('cursor', 'auto');
						   });
						   clickedCard.animate({
							   top: '-=10px',
							   opacity: 0
						   }, 500, "linear", function() {
							   $(this).off('click').children().css('cursor', 'auto');
							   _this._flippedCard = null;
							   _this._animating = false;
							   if (_this._remain == 0) {
								   _this.complete();
							   }
						   });
					   } else {
						   _this.flipBack(_this._flippedCard);
						   _this.flipBack(clickedCard, function() {
							   _this._flippedCard = null;
							   _this._animating = false;
						   });
					   }
				   } else {
					   _this._flippedCard = clickedCard;
					   _this._animating = false;
				   }
			   });
		   },

	complete: function() {
				  $('#counter').data('tinyTimer').stop();
				  this._completeTime = $('#counter').text();
				  console.log(this._completeTime);
				  $('#second-page').slideUp(function() {
					  $('#show-name').text(_this._playerName);
					  $('#result-second').text(_this._completeTime);
					  $('#third-page').slideDown(/*TODO*/);
				  });
			  },

	flip: function(card, complete) {
			  card.find('.card-front').animateRotate(0, 180, 500, "swing");
			  card.find('.card-back').animateRotate(-179.9, 0, 500, "swing", complete);
		  },

	flipBack: function(card, complete) {
				  card.find('.card-front').animateRotate(180, 0, 500, "swing");
				  card.find('.card-back').animateRotate(0, -179.9, 500, "swing", complete);
			  },

	_flippedCard: null,
	_animating: false,
	_remain: 0
}

var shuffle = function(arr) {
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}

$.fn.animateRotate = function(from, angle, duration, easing, complete) {
	return this.each(function() {
		var $elem = $(this);

		$({deg: from}).animate({deg: angle}, {
			duration: duration,
			easing: easing,
			step: function(now) {
				$elem.css({
					transform: 'rotateY(' + now + 'deg)'
				});
			},
			complete: complete || $.noop
		});
	});
};
