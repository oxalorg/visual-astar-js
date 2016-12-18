'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//jshint esnext:true

function visualAStar() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
    var wt_range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 999;

    var canvas = document.getElementById('astar');
    var ctx = canvas.getContext('2d');

    if (!canvas.getContext) {
        alert("Canvas not supported");
        return -1;
    }

    var WIDTH = 20;
    var MAX_WT = wt_range;
    var N = size;

    ctx.canvas.width = WIDTH * N;
    ctx.canvas.height = WIDTH * N;

    /* Lets create a NxN grid */
    var grid = function (n) {
        var myArr = [];
        for (var i = 0; i < n; i++) {
            myArr.push([]);
        }
        return myArr;
    }(N);

    /* Node in our graph */
    function Node(x, y) {
        var visited = false;
        var goal = false;
        var start = false;
        var fringe = false;
        var grid_x = x;
        var grid_y = y;
        var color = 'white';
        var parentNode;

        var weight = Math.floor(Math.random() * MAX_WT) + 1;
        // var weight = 1;
        var pathCost = weight;

        function update() {
            if (goal === true) {
                color = 'red';
            } else if (start === true) {
                color = 'green';
            } else if (visited === true) {
                color = '#532abc';
            } else if (fringe === true) {
                color = '#3d89cb';
            }

            ctx.fillStyle = color;
            ctx.fillRect(grid_x * WIDTH, grid_y * WIDTH, WIDTH, WIDTH);
            ctx.fillStyle = 'black';
            ctx.strokeRect(grid_x * WIDTH, grid_y * WIDTH, WIDTH, WIDTH);
            ctx.textAlign = 'center';
            ctx.fillText(weight + '', grid_x * WIDTH + WIDTH / 2, grid_y * WIDTH + WIDTH * 2 / 3, WIDTH);
        }

        function updateParent(par) {
            parentNode = par;
            pathCost += par.getPathCost();
        }

        function getParent() {
            return parentNode;
        }

        function getPathCost() {
            return pathCost;
        }

        function getWeight() {
            return weight;
        }

        function setVisited() {
            visited = true;
        }

        function setGoalNode() {
            goal = true;
        }

        function setStartNode() {
            start = true;
        }

        function setFringe() {
            fringe = true;
        }

        function getSuccessorList() {
            var x = [-1, 0, 1];
            var y = [-1, 0, 1];

            var successors = [];
            for (var i = 0; i < x.length; i++) {
                for (var j = 0; j < y.length; j++) {
                    if (x[i] == y[j]) continue;
                    var nb_x = grid_x + Number(x[i]);
                    var nb_y = grid_y + Number(x[j]);
                    if (grid[nb_x] == undefined || grid[nb_x][nb_y] == undefined) {
                        continue;
                    }
                    var neighbor = grid[nb_x][nb_y];
                    if (neighbor.isVisited() === true || neighbor.isFringe() === true) {
                        continue;
                    }
                    successors.push(neighbor);
                }
            }
            return successors;
        }

        function heuristic() {
            var manhattanDist = Math.sqrt(Math.pow(goalNode.x + grid_x, 2) + Math.pow(goalNode.y + grid_y, 2));
            return pathCost + manhattanDist;
            // return pathCost;
        }

        function isGoal() {
            return goal;
        }

        function isFringe() {
            return fringe;
        }

        function isVisited() {
            return visited;
        }

        var publicAPI = {
            x: grid_x,
            y: grid_y,
            update: update,
            updateParent: updateParent,
            setVisited: setVisited,
            setGoalNode: setGoalNode,
            setStartNode: setStartNode,
            setFringe: setFringe,
            getSuccessorList: getSuccessorList,
            getParent: getParent,
            isGoal: isGoal,
            isVisited: isVisited,
            isFringe: isFringe,
            getWeight: getWeight,
            getPathCost: getPathCost,
            heuristic: heuristic
        };

        return publicAPI;
    }

    /* Lets initialise the grid with N x N rectangles */
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            grid[i][j] = Node(i, j);
            grid[i][j].update();
        }
    }

    /* Set start and goal nodes */
    var s_x = Math.floor(Math.random() * N);
    var s_y = Math.floor(Math.random() * N);
    var start = grid[s_x][s_y];
    start.setStartNode();
    start.update();

    var g_x = Math.floor(Math.random() * N);
    var g_y = Math.floor(Math.random() * N);
    var goalNode = grid[g_x][g_y];
    goalNode.setGoalNode();
    goalNode.update();
    console.log(goalNode.isGoal());

    /* A* search implementation */
    function astarSearch(start) {
        var closed = [];
        var open = PriorityQueue();
        var epoch = 0;
        open.add(start);

        var _loop = function _loop() {
            epoch += 1;

            var node = open.nodes.shift();
            if (node.isGoal() === true) {
                var showSolution = function showSolution() {
                    ctx.beginPath();
                    ctx.strokeStyle = 'yellow';
                    ctx.moveTo(node.x * WIDTH + WIDTH / 2, node.y * WIDTH + WIDTH / 2);
                    var par = node.getParent();
                    while (par) {
                        ctx.lineTo(par.x * WIDTH + WIDTH / 2, par.y * WIDTH + WIDTH / 2);
                        par = par.getParent();
                    }
                    ctx.stroke();
                };

                ;

                // setTimeout(showSolution, 500);
                showSolution();
                console.log("FOUND the solution");
                return {
                    v: node
                };
            }

            if (closed.indexOf(node) <= -1) {
                closed.push(node);
                node.setVisited();
                // setTimeout(node.update, (epoch * 50) % 2000);
                node.update();
                var successors = node.getSuccessorList();
                for (var _i = 0; _i < successors.length; _i++) {
                    var fringeNode = successors[_i];
                    fringeNode.setFringe();
                    fringeNode.updateParent(node);
                    open.add(fringeNode);
                    // setTimeout(fringeNode.update, (epoch * 50 + (i+1) * 30) % 2000);
                    fringeNode.update();
                }
            }
        };

        while (open.nodes.length != 0) {
            var _ret = _loop();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
        return false;
    }

    console.log(astarSearch(start));
};

var PriorityQueue = function PriorityQueue() {
    var that = {};
    that.nodes = [];

    that.add = function add(node) {
        that.nodes.push(node);
        that.nodes.sort(function (f, s) {
            return f.heuristic() - s.heuristic();
        });
    };

    return that;
};

console.log('end');