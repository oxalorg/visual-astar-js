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
    const N = 32;

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

        var weight = Math.floor(Math.random() * 8) + 1;

        function update() {
            if (goal === true) {
                color = 'red';
            } else if (start === true) {
                color = 'green';
            } else if (visited === true) {
                color = '#532abc';
            } else if (fringe === true) {
                console.log("reached here");
                color = 'black';
            }

            ctx.fillStyle = color;
            ctx.fillRect(grid_x * WIDTH, grid_y * WIDTH, WIDTH, WIDTH);
            ctx.fillStyle = 'black';
            ctx.strokeRect(grid_x * WIDTH, grid_y * WIDTH, WIDTH, WIDTH);
            ctx.textAlign = 'center';
            ctx.fillText(weight + '', (grid_x * WIDTH) + WIDTH/2, (grid_y * WIDTH) + WIDTH * 2/3, WIDTH);
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
                    if (neighbor.visited === true) {
                        continue;
                    }
                    successors.push(neighbor);
                }
            }
            return successors;
        }

        var publicAPI = {
            x: grid_x,
            y: grid_y,
            update: update,
            setVisited: setVisited,
            setGoalNode: setGoalNode,
            setStartNode: setStartNode,
            setFringe: setFringe,
            getSuccessorList: getSuccessorList,
            goal: goal,
            visited: visited,
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
    var start = grid[26][19];
    start.setStartNode();
    start.update();

    var goal = grid[4][3];
    goal.setGoalNode();
    goal.update();

    /* A* search implementation */
    function astarSearch(start) {
        var closed = [];
        var open = PriorityQueue();
        var epoch = 0;
        open.add(start);

        while (open.nodes.length != 0){
            epoch += 1;

            let node = open.nodes.shift();
            if (node.goal === true) {
                console.log("Found the node!");
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
            return s.weight - f.weight;
        });
    };

    return that;
};

console.log('end');

