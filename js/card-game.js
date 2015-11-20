var cardGame = {
	prepare: function() {
				 this._seq = [1, 2, 3, 4, 5, 6, 7, 8];
				 this._seq = shuffle(this._seq.concat(this._seq));

				 this._panel = $('#card-panel');
				 this._cards = [];
				 this._remain = 16;
				 var _this = this;

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

				  var _this = this;
				  $('#second-page').slideUp(function() {
					  $('#show-name').text(_this._playerName);
					  $('#result-second').text(_this._completeTime);

					  for (var level in _this._rating) {
						  if (_this._completeTime <= _this._rating[level].time) {
					  		  $('#are-matchmaker').text(_this._rating[level].comment);
							  break;
						  }
					  }
					  $('#third-page').fadeIn();
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
	_remain: 0,

	_rating: [
		{
			comment: '記憶達人! matchmaker就是你!',
			time: 30
		}, {
			comment: '還行還行! 但是有人比你更行~~',
			time: 40
		}, {
			comment: '差強人意! 多吃銀杏!',
			time: 50
		}, {
			comment: '哈哈哈! 你一定想不到前天晚上吃了什麼吧XDDD',
			time: Infinity
		}
	]
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
