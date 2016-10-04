'use strict';
(function() {
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    }

    var Drawer = function() {
        var drw = {};
        var taskCanvas = [];
        var cnvsBase = document.createElement('canvas');
        var canvasWidth = 0;
        var canvasHeight = 0;
        var librLogicFunc = {
            histo: histoLogic,
            histoChar: histoCharLogic,
            scatterPlot: scatterPlotLogic
        };

        function setBase(task, type) {
            var canvas = cnvsBase.cloneNode(true);
            taskCanvas.push({canvas: canvas, task: task, type: type});
            canvasWidth = window.innerWidth - 25;
            canvasHeight = (window.innerHeight - 25) / taskCanvas.length;
            document.body.appendChild(canvas);
        }

        function canvasResizing() {
            window.addEventListener('resize', debounce(function() {
                canvasHeight = (window.innerHeight - 25) / taskCanvas.length;
                canvasWidth = window.innerWidth - 25;
                draw();
            }, 50));
        }

        function histoLogic(ctx, task) {
            var x = 0;
            var max = Math.max.apply(null, task);
            var widthOfGraph = canvasWidth / task.length;

            task.forEach(function(elem) {
                var height = canvasHeight / 100 * (elem * 100 / max);
                ctx.fillStyle = 'rgb(' + Math.ceil(Math.random() * 200) + ', 0,' + Math.ceil(Math.random() * 200) + ')';
                ctx.fillRect(x, canvasHeight, widthOfGraph, -height);
                x += widthOfGraph;
            });
        }

        function histoCharLogic(ctx, task) {
            var numOfChars = task.map(function(char) {
                return char.charCodeAt(0);
            });
            var x = 0;
            var max = Math.max.apply(null, numOfChars);
            var widthOfGraph = canvasWidth / numOfChars.length;

            numOfChars.forEach(function(elem) {
                var height = canvasHeight / 100 * (elem * 100 / max);
                ctx.fillStyle = 'rgb(' + Math.ceil(Math.random() * 200) + ', 0,' + Math.ceil(Math.random() * 200) + ')';
                ctx.fillRect(x, canvasHeight, widthOfGraph, -height);
                x += widthOfGraph;
            });
        }

        function scatterPlotLogic(ctx, task) {
            var maxX = 0;
            var maxY = 0;
            task.forEach(function(el) {
                if (maxX < el.x)
                    maxX = el.x;
                if (maxY < el.y)
                    maxY = el.y;
            });

            maxX = (maxX * 0.3) + maxX;
            maxY = (maxY * 0.3) + maxY;

            var sizeSquareX = canvasWidth / maxX;
            var sizeSquareY = canvasHeight / maxY;
            var countX = canvasWidth / sizeSquareX;
            var countY = canvasHeight / sizeSquareY;
            ctx.strokeStyle = '#DCDCDC';
            for (var i = 0, y = 0; i <  countY; i++) {
                for(var j = 0,x = 0; j < countX; j++ ) {
                    ctx.strokeRect(x, y, sizeSquareX, sizeSquareY);
                    x += sizeSquareX;
                }
                y += sizeSquareY;
            }

            task.forEach(function(el) {
                var x = canvasWidth / 100 * (el.x * 100 / maxX);
                var y = canvasHeight / 100 * (el.y * 100 / maxY);
                // ctx.strokeStyle = 'rgb(' + Math.ceil(Math.random() * 200) + ', 0,' + Math.ceil(Math.random() * 200) + ')';
                ctx.fillStyle = 'rgb(' + Math.ceil(Math.random() * 200) + ', 0,' + Math.ceil(Math.random() * 200) + ')';
                ctx.beginPath();
                ctx.arc(x, y, el.r, 0, Math.PI*2, true);
                ctx.stroke();
                ctx.fill();
            });

        }

        function draw() {
            taskCanvas.forEach(function(cnvs) {
                cnvs.canvas.height = canvasHeight;
                cnvs.canvas.width = canvasWidth;
                var ctx = cnvs.canvas.getContext('2d');
                let haveIt = Object.keys(librLogicFunc).some(function(key) {
                    return key == cnvs.type;
                });
                if (!haveIt) {
                    throw 'Нет функции в draw ->' + cnvs.type;
                }
                librLogicFunc[cnvs.type](ctx, cnvs.task);
            });
        }

        drw.histogram = function(task) {
            setBase(task, 'histo');
            draw();
        };

        drw.histogramChars = function(task) {
            setBase(task, 'histoChar');
            draw();
        };

        // drw.stckBarChart = function(task) {
        //     var canvas = cnvsBase.cloneNode(true);
        //
        // };

        // drw.scatterPlot = function(task) {
        //
        // };

        drw.scatterPlot = function(task) {
            setBase(task, 'scatterPlot');
            draw();
        };

        canvasResizing();
        return drw;
    };
    var drawer = Drawer();

    function startDraw(obj, drawer) {
        if (obj.length) {
            if (typeof obj[0] == 'string')
                return drawer.histogramChars(obj);
            if (typeof obj[0] == 'number')
                return drawer.histogram(obj);
            if (obj[0].length)
                return drawer.histogram(obj);
            if (typeof obj[0] == 'object')
                return drawer.scatterPlot(obj);
        }
    }

    Object.prototype.draw = function() {
        startDraw(this, drawer);
    };

}());
