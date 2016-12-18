//jshint esnext:true
window.onload = main;

function main() {
    var canvas = document.getElementById('astar');
    var ctx = canvas.getContext('2d');

    if (!canvas.getContext) {
        alert("Canvas not supported");
        return -1;
    }

    const WIDTH = 20;
    const N = 16;

    /* Lets create a NxN grid */
    var grid = (function(n) {
        var myArr = [];
        for (var i = 0; i < n; i++) {
            myArr.push([]);
        }
        return myArr;
    })(N);

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
        var pathCost = 0;

        var weight = Math.floor(Math.random() * 8) + 1;

        function update() {
            if (goal === true) {
                color = 'red';
            } else if (start === true) {
                color = 'green';
            } else if (visited === true) {
                color = '#532abc';
            } else if (fringe === true) {
                color = 'black';
            }

            ctx.fillStyle = color;
            ctx.fillRect(grid_x * WIDTH, grid_y * WIDTH, WIDTH, WIDTH);
            ctx.fillStyle = 'black';
            ctx.strokeRect(grid_x * WIDTH, grid_y * WIDTH, WIDTH, WIDTH);
            ctx.textAlign = 'center';
            ctx.fillText(weight + '', (grid_x * WIDTH) + WIDTH/2, (grid_y * WIDTH) + WIDTH * 2/3, WIDTH);
        }

        function updateParent(par) {
            parentNode = par;
            pathCost += par.getWeight();
        }

        function getParent() {
            return parentNode;
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
            let x = [-1, 0, 1];
            let y = [-1, 0, 1];
            
            let successors = [];
            for (let i = x[0]; i < x.length; i++) {
                for (let j = y[0]; j < y.length; j++) {
                    let nb_x = grid_x + Number(i);
                    let nb_y = grid_y + Number(j);
                    if (grid[nb_x] == undefined || grid[nb_x][nb_y] == undefined) {
                        continue;
                    }
                    let neighbor = grid[nb_x][nb_y];
                    if (neighbor.isVisited() === true || neighbor.isFringe() === true) {
                        continue;
                    }
                    successors.push(neighbor);
                }
            }
            return successors;
        }

        function heuristic() {
            let manhattanDist = Math.sqrt(Math.pow(goalNode.x + grid_x, 2) + Math.pow(goalNode.y + grid_y, 2));
            return pathCost + manhattanDist;
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
            heuristic: heuristic,
        };

        return publicAPI;
    }

    /* Lets initialise the grid with N x N rectangles */
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            grid[i][j] = Node(i, j);
            grid[i][j].update();
        }
    }


    /* Set start and goal nodes */
    var start = grid[10][10];
    start.setStartNode();
    start.update();

    var goalNode = grid[4][3];
    goalNode.setGoalNode();
    goalNode.update();
    console.log(goalNode.isGoal());

    /* A* search implementation */
    function astarSearch(start) {
        var closed = [];
        var open = PriorityQueue();
        var epoch = 0;
        open.add(start);

        while (open.nodes.length != 0){
            epoch += 1;

            let node = open.nodes.shift();
            if (node.isGoal() === true) {
                function showSolution () {
                    ctx.beginPath();
                    ctx.moveTo(node.x * WIDTH + WIDTH/2, node.y * WIDTH + WIDTH/2);
                    let par = node.getParent();
                    while(par) {
                        ctx.lineTo(par.x * WIDTH + WIDTH/2, par.y * WIDTH + WIDTH/2);
                        par = par.getParent();
                    }
                    ctx.stroke();
                };

                setTimeout(showSolution, 2000);
                console.log("FOUND the solution");
                return node;
            }

            if (closed.indexOf(node) <= -1) {
                closed.push(node);
                node.setVisited();
                setTimeout(node.update, (epoch * 50) % 1000);
                let successors = node.getSuccessorList();
                for (let i = 0; i < successors.length; i++) {
                    let fringeNode = successors[i];
                    fringeNode.setFringe();
                    fringeNode.updateParent(node);
                    open.add(fringeNode);
                    setTimeout(fringeNode.update, (epoch * 50 + (i+1) * 30) % 1000);
                }
            }

        }
        return false;
    }

    console.log(astarSearch(start));
};

var PriorityQueue = function() {
    var that = {};
    that.nodes = [];

    that.add = function add (node) {
        that.nodes.push(node);
        that.nodes.sort(function (f, s) {
            return f.heuristic() - s.heuristic();
        });
    };

    return that;
};

console.log('end');

