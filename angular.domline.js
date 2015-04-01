/*!
 * jQuery DOM Line plugin v0.1.3
 * Copyright (c) 2011 Gilmore Davidson
 * https://gilmoreorless.github.com/jquery-dom-line/
 *
 * @license Open source under the MIT licence: http://gilmoreorless.mit-license.org/2011/
 */
;(function (angular, undefined) {
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
    var cacheId = [from.x, from.y, to.x, to.y].join(',');
    if (calcCache[cacheId]) {
      return angular.extend({}, calcCache[cacheId]);
    }
    // Calculate dimensions
    var xDiff = Math.abs(to.x - from.x),
      yDiff = Math.abs(to.y - from.y),
      hypot = (!xDiff || !yDiff) ? xDiff || yDiff : Math.sqrt(xDiff * xDiff + yDiff * yDiff),
      minX  = Math.min(from.x, to.x),
      minY  = Math.min(from.y, to.y),
      halfX = minX + xDiff / 2,
      halfY = minY + yDiff / 2,
      theta,
      left  = halfX - hypot / 2,
      top   = halfY,
      pos = calcCache[cacheId] = {
        width: hypot
      };

    left = Math.round(left);
    top  = Math.round(top);
    pos.width = Math.round(pos.width) + 'px';

    // Work out angle
    if (!xDiff) {
      theta = from.y < to.y ? 90 : 270;
    } else if (!yDiff) {
      theta = from.x < to.x ? 0 : 180;
    } else {
      // Angle calculation taken from Raphaël
      theta = (180 + Math.atan2(from.y - to.y, from.x - to.x) * 180 / Math.PI + 360) % 360;
    }
    pos.transform = 'rotate(' + theta + 'deg)';
    // These have to come after the transform property to override the left/top
    //  values set by the transform matrix in IE
    pos.left = left + 'px';
    pos.top = top + 'px';

    // Add calculated properties for later manipulation
    pos.extra = {
      center: {
        x: halfX,
        y: halfY
      },
      rotation: {
        deg: theta,
        rad: theta % 360 * Math.PI / 180
      }
    };

    // New object so later manipulation outside this function doesn't affect the cache
    return angular.extend({}, pos);
  }

  var defaults = {
    elem: '',
    className: 'jquery-line',
    lineWidth: 1,
    lineColor: 'transparent',
    returnValues: false
  };
  // really Simple way to export this function.
  angular.module('domLine',[])
  .factory('drawLine',function(){
    return function (from, to, options) {
      from = checkPoint(from);
      to = checkPoint(to);
      if (!from || !to) {
        return false;
      }

      // Create div element
      var opts = angular.extend({}, defaults, options || {}),
        css = {
          position: 'absolute',
          backgroundColor: opts.lineColor,
          width: 1,
          height: opts.lineWidth
        },
        pos,
        calcDims,
        extra
        ;
      return calcPosition(from, to, calcDims);
    };
  })
})(angular);
