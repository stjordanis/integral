var hoverEvent = function (element, fadingDelay, lowOp) {

	$(element).hover(
		function() {
			$(this).fadeTo(fadingDelay, lowOp);
		}
		,
		function() {
			$(this).fadeTo(fadingDelay, 1);
		});
}

var compButtonEvent = function() {

	$('#computationMessage').text("computing...");

	$('.dropdown-items').hide(100);

	var integratingFunction = $('#function-input').val();
	var lowerDomain         = $('#lower-domain').val();
	var upperDomain         = $('#upper-domain').val();
	var computationTime     = parseInt($('#comp-time').text());
	var temp                = $('#variable').text();
	var currentVariable     = $.trim(temp)[1];

	inputData = [integratingFunction, lowerDomain, upperDomain, currentVariable, computationTime];

	var calc = $.post(
            'http://integral.epherest.com/calc',
            { "inputData" : inputData },
            onAjaxSuccess2,
            "text"
    );

	function readJsonData(jsonData) {
	    
	    x = document.createElement('div');
	    x.innerHTML = jsonData;
	    data = JSON.parse(x.innerHTML, function(key, value) {
	        return value;
	    });

	    return data;
	}

	function onAjaxSuccess2(data) {

		result = readJsonData(data);

		var eps = result[1].toPrecision(8);
		var epsStr = "(abs. eps = " + eps + ")";

		var value = result[0].toPrecision(12);

		if (result[3] == 2) {

			$('#infotable').css("border", "solid 2px black");
			$('#computationMessage').css("color", "black");
			$('#computationValue').css("color", "black");

			$('#computationMessage').text(result[4]);
			$('#computationEps').text("");

			switch(result[2]) {

				case "C":
					$('#computationValue').text(value);
					break;
				case "+":
					$('#computationValue').text("+infinity");
					break;
				case "-":
					$('#computationValue').text("-infinity");
					break;
				default:
					$('#computationValue').text(value);
					$('#computationEps').text(epsStr);
			}

		} else if (result[3] == -15 || result[3] == -16) {
		
			$('#infotable').css("border", "solid 2px rgba(0,0,0,0.65)");
			$('#computationMessage').css("color", "rgba(0,0,0,0.65)");
			$('#computationValue').css("color", "black");

			$('#computationMessage').text(result[4]);
			$('#computationValue').text(value);
			$('#computationEps').text(epsStr);
		
		} else {

			$('#infotable').css("border", "solid 2px #FF0133");
			$('#computationValue').css("color", "#FF0133");

			$('#computationMessage').html("&nbsp");
			$('#computationValue').text(result[4]);
			$('#computationEps').text("");
		}
	}
}

var adaptiveness = function() {

	var thisHeight = $(this).height();

	if (thisHeight > 650) {
		var marginValue = parseInt((thisHeight - 650) / 3);
		$('body').css("margin-top", String(marginValue) + "px");
	}
	else
		$('body').css("margin-top", "0");
}

var main = function() {

	adaptiveness();

	$(window).resize(adaptiveness);

	$(document).keydown(function(key) {

		var isFocused = $('input:focus').length;

		if (key.which === 37 && isFocused === 0) {
			
			$('.dropdown-items').hide(100);
			$('input[autofocus]').removeAttr('autofocus');

			var $currentSlide = $('.active-slide');
	        var $prevSlide = $currentSlide.prev().length === 0 ? $('.slide').last() : $currentSlide.prev();
	        
	        $currentSlide.fadeOut(144).removeClass('active-slide');
	        $prevSlide.fadeIn(144).addClass('active-slide');
	        
	        var $currentMenuItem = $('.active-menu-item');
	        var $prevMenuItem = $currentMenuItem.prev().length === 0 ? $('.menu-item').last() : $currentMenuItem.prev();
	        
	        $currentMenuItem.removeClass('active-menu-item');
	        $prevMenuItem.addClass('active-menu-item');
		}

		else if (key.which === 39 && isFocused === 0) {
			
			$('.dropdown-items').hide(100);
			$('input[autofocus]').removeAttr('autofocus');
			
			var $currentSlide = $('.active-slide');
	        var $nextSlide = $currentSlide.next().length === 0 ? $('.slide').first() : $currentSlide.next();
	        
	        $currentSlide.fadeOut(144).removeClass('active-slide');
	        $nextSlide.fadeIn(144).addClass('active-slide');
	        
	        var $currentMenuItem = $('.active-menu-item');
	        var $nextMenuItem = $currentMenuItem.next().length === 0 ? $('.menu-item').first() : $currentMenuItem.next();
	        
	        $currentMenuItem.removeClass('active-menu-item');
	        $nextMenuItem.addClass('active-menu-item');
		}

		else if (key.which === 13 && $('.menu-item').first().hasClass('active-menu-item'))
			compButtonEvent();
		
		else if (key.which === 67 && isFocused === 0 && $('.menu-item').first().hasClass('active-menu-item')) {

			$('#function-input').val('');
			$('#lower-domain').val('');
			$('#upper-domain').val('');
		}
	});

	$('.menu-item').click(function() {

		if($(this).hasClass('active-menu-item') === false) {

			$('.dropdown-items').hide(100);

			$('.active-menu-item').removeClass('active-menu-item');
			$(this).addClass('active-menu-item');

			var currentMenutItemIndex = $('.menu-item').index(this);
			
			$('.active-slide').fadeOut(144).removeClass('active-slide');
			$('.slide').eq(currentMenutItemIndex).fadeIn(144).addClass('active-slide');
		}
	});	

	$('.dropdown-item').click(function() {

		if($(this).hasClass('active-dropdown-item') === false) {

			$(this).parent().hide(100);
			var thisText = $(this).text();
			var $activeDropDownItem = $(this).parent().prev().children('a');
			$activeDropDownItem.text(thisText);
		}
	});

	$('.active-dropdown-item').click(function() {
		$(this).next().toggle(100);
	});

	$('#comp-button').click(compButtonEvent);

	$('#integral-sign').click(function() {

		$('#function-input').val('');
		$('#lower-domain').val('');
		$('#upper-domain').val('');
	});	

	hoverEvent('.menu-item'    , 144, 0.65);
	hoverEvent('.dropdown-item', 100, 0.65);
	hoverEvent('#comp-button'  , 144, 0.65);
	hoverEvent('#integral-sign', 144, 0.65);
};

$(main);