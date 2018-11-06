function check() {
    var canvas = document.createElement('canvas');
    var parent = document.querySelector('#pluginContainer').parentElement;
    canvas.height = parent.offsetHeight + 5;
    canvas.width = parent.offsetWidth + 5;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var parent = document.querySelector('#pluginContainer');
    var parentRect = parent.getBoundingClientRect();
    Array.prototype.forEach.call(parent.querySelectorAll('img'), function (element) {
        toDataURL(element.src, function (data) {
            element.src = data;
        });
    });
    setTimeout(function(){
        
    Array.prototype.forEach.call(parent.querySelectorAll('*'), function (element) {
        var childRect = element.getBoundingClientRect();
        var BBOx = getRectProps(parentRect, childRect);
        var styles = window.getComputedStyle(element, null);
        ctx.fillStyle = styles.backgroundColor;
        if (styles.backgroundColor !== 'transparent') {
            ctx.fillRect(BBOx.left, BBOx.top, BBOx.width, BBOx.height);
        }
        if (styles.borderTopWidth === '1px') {
            ctx.strokeStyle = styles.borderTopColor;
            ctx.strokeRect(BBOx.left, BBOx.top, BBOx.width, BBOx.height);
        }
        if( styles.borderBottomLeftRadius === '28px'){
            roundRect(ctx, BBOx.left, BBOx.top, BBOx.width, BBOx.height, {bl: 28, br: 28}, false, true);
        }
        if (element.localName === 'img') {

            ctx.drawImage(element, BBOx.left, BBOx.top);


        }

        var text = element.innerHTML.match(/(^[\w\s%,.$]+)|([\w\s%,.$]+$)/g);
        if (text) {
            drawText(text[0], element, BBOx, ctx, styles);
        }

    })
    console.log(canvas.toDataURL());
    }, 3000)

}


function toDataURL(src, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL();
        callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
}

function drawText(text, element, BBox, ctx, styles) {
    var centerX = BBox.left + BBox.width / 2;
    var centerY = BBox.top + BBox.height / 2;
    var lines = getLines(text.split(' '), BBox.width, parseInt(styles.fontSize.replace('px', '')));
    for (var j = 0; j < lines.length; j++) {
        var y = centerY + (j - lines.length / 2 + 0.8) * 16;
        ctx.fillStyle = styles.color;
        ctx.font = styles.fontSize + ' Serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lines[j].text, centerX, lines.length === 1 ? centerY : y);
    }

}

function getLines(words, width, fontSize) {
    var line;
    var lineWidth0 = Infinity;
    var lines = [];
    for (var i = 0, n = words.length; i < n; ++i) {
        var lineText1 = (line ? line.text + " " : "") + words[i];
        var lineWidth1 = measureWidth(lineText1, fontSize);
        if ((lineWidth0 + lineWidth1) / 2 < width) {
            line.width = lineWidth0 = lineWidth1;
            line.text = lineText1;
        } else {
            lineWidth0 = measureWidth(words[i], fontSize);
            line = { width: lineWidth0, text: words[i] };
            lines.push(line);
        }
    }
    return lines;
}

function measureWidth(text, fontSize) {
    const context = document.createElement("canvas").getContext("2d");
    context.font = fontSize + 'px Serif';
    return context.measureText(text).width;
}
function getRectProps(parentRect, childRect) {
    var bbox = {
        top: childRect.top - parentRect.top,
        left: childRect.left - parentRect.left,
        width: childRect.width,
        height: childRect.height
    }
    return bbox;
}
// Different radii for each corner, others default to 0
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}