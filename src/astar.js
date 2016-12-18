//jshint esnext:true
window.onload = astar;

function astar() {
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
        var grid_x = x;
        var grid_y = y;
        var color = 'white';

        var weight = Math.floor(Math.random() * 8) + 1;

        function update() {
            if (visited === true) {
                color = 'blue';
            }
            if (goal === true) {
                color = 'red';
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

        var publicAPI = {
            update: update,
            setVisited: setVisited,
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


    /* Main Loop */
    grid[10][10].setVisited();
    grid[10][10].update();

    console.log(grid);

};

console.log('end');

