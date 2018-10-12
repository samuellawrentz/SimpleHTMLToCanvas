function check() {
    var canvas = document.createElement('canvas');
    var parent = document.querySelector('#pluginContainer').parentElement;
    canvas.height = parent.offsetHeight + 5;
    canvas.width = parent.offsetWidth+ 5;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var parent = document.querySelector('#pluginContainer');
    var parentRect = parent.getBoundingClientRect();
    
    Array.prototype.forEach.call(parent.querySelectorAll('*'), function(element){
        var childRect = element.getBoundingClientRect();
        var BBOx = getRectProps(parentRect, childRect);
        var styles = window.getComputedStyle(element, null);
        ctx.fillStyle = styles.backgroundColor;
        if(styles.backgroundColor !== 'transparent'){
            ctx.fillRect(BBOx.left, BBOx.top, BBOx.width, BBOx.height);
        }
        if(styles.borderTopWidth === '1px'){
            ctx.strokeStyle = styles.borderTopColor;
            ctx.strokeRect(BBOx.left, BBOx.top, BBOx.width, BBOx.height);
        }
            
        var text = element.innerHTML.match(/(^[\w\s%,.$]+)|([\w\s%,.$]+$)/g);
            if(text){
                drawText(text[0], element, BBOx,  ctx, styles);
            }
        
    })
 
}

function drawText(text, element,BBox,  ctx, styles){
    var centerX = BBox.left + BBox.width/2;
    var centerY = BBox.top + BBox.height/2;
    var lines = getLines(text.split(' '), BBox.width, parseInt(styles.fontSize.replace('px', '')));
    for(var j= 0; j< lines.length; j++){
        var y = centerY + (j - lines.length / 2 + 0.8) * 16;
        ctx.fillStyle = styles.color;
        ctx.font= styles.fontSize +' Serif';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(lines[j].text, centerX, lines.length===1? centerY : y);
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
    context.font= fontSize +'px Serif';
    return context.measureText(text).width;
  }
function getRectProps(parentRect, childRect){
    var bbox = {
        top: childRect.top - parentRect.top,
        left: childRect.left - parentRect.left,
        width: childRect.width,
        height: childRect.height
    }
    return bbox;
}
function render() {
    $('#pluginContainer').benchmarkStat({title: 'Nationwide', content: '4.9%'});
}

render();