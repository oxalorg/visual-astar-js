# visual-astar-js

Graphical view of astar-js using javascript.

Works on simple grids of nodes and performs a graph search
with a heuristic.

## Live Demo

[https://oxal.org/projects/visual-astar-js/](https://oxal.org/projects/visual-astar-js/)

## Use it yourself


```html
...

<script src="lib/astar.js"></script>
<script type="text/javascript">
window.onload = function () {
    var weight_range = 999;
    var grid_size = 32;
    visualAStar(grid_size, weight_range);
};
</script>

...

<canvas id="astar"></canvas>

...
```

## Contribute

Please contribute in any way possible. This is my first
javascript project, any reviews/edits are welcome!

I wanted to make the coloring of nodes happen sequentially,
using some kind of animation because the search algorithm
is very fast to be able to see. But the `setTimeout` method isn't
reliable and I can't find any other alternatives. Any help is
appreciated.

