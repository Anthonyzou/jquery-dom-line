(function ($, undefined) {
	function checkPoint(point) {
		if (point.x === undefined && point.y === undefined) {
			return false;
		}
		point.x = parseFloat(point.x) || 0;
		point.y = parseFloat(point.y) || 0;
		return point;
	}
	
	var calcCache = {};
	function calcPosition(from, to, calc) {
		var cacheId = [from.x, from.y, to.x, to.y, calc.w, calc.h].join(',');
		if (calcCache[cacheId]) {
			return calcCache[cacheId];
		}
		// Calculate dimensions
		var xDiff = Math.abs(to.x - from.x),
			yDiff = Math.abs(to.y - from.y),
			hypot = (!xDiff || !yDiff) ? xDiff || yDiff : Math.sqrt(xDiff * xDiff + yDiff * yDiff),
			minX = Math.min(from.x, to.x),
			minY = Math.min(from.y, to.y),
			halfX = minX + xDiff / 2,
			halfY = minY + yDiff / 2,
			theta,
			pos = calcCache[cacheId] = {
				left: halfX - hypot / 2,
				top: halfY,
				width: hypot
			};
		
		// Account for width/height offset
		if (calc.w > 1) {
			pos.left -= calc.w / 2;
		}
		if (calc.h > 1) {
			pos.top -= calc.h / 2;
		}
		
		// Work out angle
		if (!xDiff) {
			theta = from.y < to.y ? 90 : 270;
		} else if (!yDiff) {
			theta = from.x < to.x ? 0 : 180;
		} else {
			// Angle calculation taken from Raphaël
			theta = (180 + Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI + 360) % 360;
		}
		pos.transform = 'rotate(' + theta + 'deg)';
		
		return pos;
	}
	
	$.line = function (from, to, options) {
		from = checkPoint(from);
		to = checkPoint(to);
		if (!from || !to) {
			return false;
		}
		
		// Create div element
		var opts = $.extend({}, $.line.defaults, options || {}),
			$elem = opts.elem ? $(opts.elem) : $('<div/>', {
				'class': opts.className
			}),
			css = {
				position: 'absolute',
				backgroundColor: opts.lineColor,
				width: 1,
				height: opts.lineWidth
			},
			pos;
		$elem.css(css);
		$elem[0].parentNode || $elem.appendTo('body');
		
		// Work out position, accounting for element dimensions
		pos = calcPosition(from, to, {
			w: $elem.outerWidth(),
			h: $elem.outerHeight()
		});
		$elem.css(pos);
		
		return $elem;
	};
	
	$.line.defaults = {
		elem: '',
		className: 'jquery-line',
		lineWidth: 1,
		lineColor: '#000'
	}
})(jQuery);
