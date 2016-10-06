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
        var drw = {},
            taskCanvas = [],
            infelicityX = 25,
            infelicityY = 25,
            cnvsBase = document.createElement('canvas'),
            canvasWidth = 0,
            canvasHeight = 0,

            librLogicFunc = {
                histo: histoLogic,
                histoChar: histoCharLogic,
                scatterPlot: scatterPlotLogic,
                lineChart: lineChartLogic,
            };


        function setBase(task, type) {
            var canvas = cnvsBase.cloneNode(true);
            taskCanvas.push({canvas: canvas, task: task, type: type});
            canvasHeight = (window.innerHeight - infelicityY) / taskCanvas.length;
            canvasWidth = window.innerWidth - infelicityX;
            document.body.appendChild(canvas);
        }

        function canvasResizing() {
            window.addEventListener('resize', debounce(function() {
                canvasHeight = (window.innerHeight - infelicityY) / taskCanvas.length;
                canvasWidth = window.innerWidth - infelicityX;
                draw();
            }, 50));
        }

        function drawSquares(maxX, maxY, ctx) {

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
        }




        function histoLogic(ctx, task) {
            var x = infelicityX / 3;
            var max = Math.max.apply(null, task);
            var upperMax = max + (max * 0.5);
            var widthOfGraph = canvasWidth / task.length;
            var fontSize =(canvasHeight -  (canvasHeight / 100 * (max * 100 / upperMax))) / 2 ;


            task.forEach(function(elem) {
                var height = canvasHeight / 100 * (elem * 100 / upperMax);
                ctx.lineWidth = 2;
                ctx.strokeRect(x, canvasHeight - (infelicityY / 2), widthOfGraph - (infelicityX/2), -height);
                // ctx.font = fontSize +'px Sans';
                ctx.font = fontSize +'px Sans';
                ctx.fillStyle = '#F07818';
                ctx.fillText(elem, x, canvasHeight -height - infelicityY/2 - 2);
                ctx.fillStyle = '#78C0A8';
                ctx.fillRect(x, canvasHeight - (infelicityY / 2), widthOfGraph - (infelicityX/2), -height);
                x += widthOfGraph;
            });
        }

        function histoCharLogic(ctx, task) {
            var arrOfChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz'.split('');

            var numOfChars = task.map(function(char) {
                for (var i = 0; i < arrOfChars.length; i++) {
                    if (char === arrOfChars[i]) {
                        return {num: i, char: arrOfChars[i]};
                    }
                }
            });

            var x = infelicityX / 3;
            var max = 0;
            numOfChars.forEach(function(elem) {
                if (max < elem.num)
                    max = elem.num;
            });
            var upperMax = max + (max * 0.5);
            var fontSize =(canvasHeight -  (canvasHeight / 100 * (max * 100 / upperMax))) / 2 ;
            var widthOfGraph = canvasWidth / numOfChars.length;

            numOfChars.forEach(function(elem) {
                var height = canvasHeight / 100 * (elem.num * 100 / upperMax);
                ctx.lineWidth = 2;
                ctx.strokeRect(x, canvasHeight - (infelicityY / 2), widthOfGraph - (infelicityX/2), -height);
                ctx.font = fontSize +'px Sans';
                ctx.fillStyle = '#F07818';
                ctx.fillText(elem.char, x, canvasHeight -height - infelicityY/2 - 2);
                ctx.fillStyle = '#78C0A8';
                ctx.fillRect(x, canvasHeight - (infelicityY / 2), widthOfGraph - (infelicityX/2), -height);
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

            maxX = (maxX * 0.5) + maxX;
            maxY = (maxY * 0.5) + maxY;
            drawSquares(maxX, maxY, ctx);
            task.forEach(function(el) {
                var x = canvasWidth / 100 * (el.x * 100 / maxX);
                var y = canvasHeight / 100 * (el.y * 100 / maxY);
                ctx.fillStyle = '#78C0A8';
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#545454';
                ctx.arc(x, y, el.r, 0, Math.PI*2, true);
                ctx.stroke();
                ctx.fill();
            });

        }

        function findMaxLineChart(task) {
            var maxX = 0;
            var maxY = 0;
            Object.keys(task).forEach(key => {
                if (maxX < parseInt(key))
                    maxX = parseInt(key);

                var maxLocal = Math.max.apply(null, task[key]);

                if (maxY < maxLocal)
                    maxY = maxLocal;
            });
            return {maxY: maxY, maxX: maxX};


        }

        function lineChartLogic(ctx, task) {
            var bestColors = ['#5E412F', '#FCEBB6', '#78C0A8', '#F07818',
            '#F0A830', '#354458', '#3A9AD9', '#29ABA4', '#E9E0D6', '#EB7260'],
                colors = [],
                maxs = findMaxLineChart(task);
            //Выберем цвета для графиков
            for (var el in task) {
                if (task.hasOwnProperty(el))
                    for (var i = 0; i < task[el].length; i++) {
                        var pick = Math.ceil(Math.random() * bestColors.length - 1);
                        colors.push(bestColors[pick]);
                    }
                break;
            }
            maxs.maxX += (maxs.maxX * 0.1);
            maxs.maxY += (maxs.maxY * 0.1);
            var previusPos = [];
            drawSquares(maxs.maxX, maxs.maxY, ctx);


            ctx.lineWidth = 4;
            Object.keys(task).forEach(function(key,i) {
                var prevY = [];
                var x = canvasWidth / 100 * (parseInt(key) * 100 / maxs.maxX);
                task[key].forEach(function(el,j) {
                    ctx.beginPath();
                    ctx.strokeStyle = colors[j];
                    var y = canvasHeight / 100 * (el * 100 / maxs.maxY);
                    prevY.push(y);
                    if (i === 0) {
                        ctx.moveTo(x,y);
                        ctx.arc(x, y, infelicityX/10, 0, Math.PI*2, true);
                        ctx.stroke();
                        return;
                    }
                    ctx.moveTo(previusPos[i-1].x, previusPos[i-1].y[j]);
                    ctx.lineTo(x, y);
                    ctx.arc(x, y, infelicityX/10, 0, Math.PI*2, true);
                    ctx.stroke();
                });
                previusPos.push({x:x, y: prevY});
                // var y = canvasHeight / 100 * (el.y * 100 / maxs.maxY);
                // ctx.fill();
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

        drw.scatterPlot = function(task) {
            setBase(task, 'scatterPlot');
            draw();
        };

        // drw.stckBarChart = function(task) {
        //     var canvas = cnvsBase.cloneNode(true);
        //
        // };

        drw.lineChart = function(task) {
            setBase(task, 'lineChart');
            draw();
        };


        canvasResizing();
        return drw;
    };
    var drawer = Drawer();

    function startDraw(obj) {
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
        if (typeof obj == 'object') {
            return drawer.lineChart(obj);
        }
    }

    Object.prototype.draw = function() {
        startDraw(this);
    };
}());
