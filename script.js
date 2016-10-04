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

        function setBase(task, type) {
            var canvas = cnvsBase.cloneNode(true);
            taskCanvas.push({canvas: canvas, task: task, type: type});
            canvasWidth = window.innerWidth - 25;
            canvasHeight = (window.innerHeight - 25) / taskCanvas.length;
            document.body.appendChild(canvas);
            return canvas;
        }

        function canvasResizing(canvas) {
            window.addEventListener('resize', debounce(function(e) {
                canvasHeight = (window.innerHeight - 25) / taskCanvas.length;
                canvasWidth = window.innerWidth - 25;
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
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

        function draw() {
            taskCanvas.forEach(function(cnvs) {
                cnvs.canvas.height = canvasHeight;
                cnvs.canvas.width = canvasWidth;
                var ctx = cnvs.canvas.getContext('2d');

                switch (cnvs.type) {
                    case 'histo':
                        histoLogic(ctx, cnvs.task);
                        break;
                    case 'histoChar':
                        histoCharLogic(ctx, cnvs.task);
                        break;
                    default:
                        console.log('LOL');
                        break;
                }

            });
        }

        drw.histogram = function(task) {
            var canvas = setBase(task, 'histo');
            canvasResizing(canvas);
            draw();
        };

        drw.histogramChars = function(task) {
            var canvas = setBase(task, 'histoChar');
            canvasResizing(canvas);
            draw();
        };

        drw.stckBarChart = function(task) {
            var canvas = cnvsBase.cloneNode(true);

        };

        drw.lineChart = function(task) {
            var canvas = cnvsBase.cloneNode(true);

        };

        drw.scatterPlot = function(task) {
            var canvas = cnvsBase.cloneNode(true);

        };

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
            }
        }

    Object.prototype.draw = function() {
        startDraw(this, drawer);
    };

}());
