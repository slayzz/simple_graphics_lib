'use strict';

var Drawer = function() {
    var drw = {};
    var taskCanvas = [];
    var cnvsBase = document.createElement('canvas');
    var canvasWidth = 0;
    var canvasHeight = 0;

    function canvasResizing(canvas) {
        window.addEventListener('resize', function(e) {
            canvasHeight = (window.innerHeight - 25) / taskCanvas.length;
            canvasWidth = window.innerWidth - 25;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            draw();
        });
    }

    function draw() {
        taskCanvas.forEach(function(cnvs) {
            cnvs.canvas.height = canvasHeight;
            cnvs.canvas.width = canvasWidth;
            var ctx = cnvs.canvas.getContext('2d');
            var x = 0;
            var widthOfGraph = canvasWidth / cnvs.task.length;

            var max = Math.max.apply(null, cnvs.task);

            cnvs.task.forEach(function(elem) {
                var height = canvasHeight / 100 * (elem * 100 / max);
                ctx.fillStyle = 'rgb(' + Math.ceil(Math.random() * 200) + ', 0,' +  Math.ceil(Math.random() * 200) + ')';
                ctx.fillRect (x, canvasHeight, widthOfGraph, -height);
                x += widthOfGraph;
            });

        });
    }

    drw.histogram = function(task) {
        var canvas = cnvsBase.cloneNode(true);
        taskCanvas.push({canvas: canvas, task: task});
        canvasWidth = window.innerWidth - 25;
        canvasHeight = (window.innerHeight - 25) / taskCanvas.length;
        document.body.appendChild(canvas);

        canvasResizing(canvas);
        draw();

    };

    drw.histogramChars = function(task) {
        var canvas = cnvsBase.cloneNode(true);

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

function startDraw(obj) {
    if (obj.length) {
        if(typeof obj[0] == 'string')
            return drawer.histogramChars(obj);
        if (typeof obj[0] == 'number')
            return drawer.histogram(obj);
        if (obj[0].length)
            return drawer.histogram(obj);
    }
}

Object.prototype.draw = function() {
    startDraw(this);
};
