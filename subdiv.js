(function($){
    $.fn.subdiv = function(options){
        var opts = $.extend({}, $.fn.subdiv.defaults, options);

        if (! opts.container) opts.container = this;
        opts.container = $(opts.container);
        opts.viewport = $(opts.viewport);

        var subdiv = {
            width: 0,
            height: 0,

            update_dimensions: function(){
                opts.container.css('height', 0);

                this.width = opts.viewport.width();
                this.height = opts.viewport.height();

                opts.container.css('height', 'auto');
            },

            divs: function(){
                return opts.container.find(opts.selector);
            },

            determine_cells: function(n){
                if (! n || isNaN(n)) return [];

                // 3 is the only one that seems wrong...
                if (n == 3) return [[1,1],[1]];

                var columns = Math.floor(Math.sqrt(n));
                var rows = Math.floor(n / columns);
                var remainder = n % rows;

                var check = (columns * rows) + remainder;
                if (check !== n) {
                    throw new Error('determine_cells: ' + columns + ', ' + rows + ', ' + remainder + ', ' + check);
                }

                var cells = [];

                // flesh out whole rows
                for (var i=0; i < columns; i++) {
                    cells[i] = [];
                    for (var j=0; j < rows; j++) {
                        cells[i][j] = 1;
                    }
                }

                // distribute remainder starting at top
                for (var i = 0; i < remainder; i++) {
                    cells[i].push(1);
                }

                return cells;
            },

            distribute_divs: function(){
                var divs = this.divs();
                var cells = this.determine_cells(divs.length);

                var index = 0;
                for (var i=0; i < cells.length; i++){
                    var width = Math.ceil(this.width / cells[i].length);
                    var height = Math.ceil(this.height / cells.length);

                    for (var j=0; j < cells[i].length; j++){
                        $(divs.get(index++)).css({
                            'position': 'absolute',
                            'top': height * i,
                            'left': width * j,
                            'width': width,
                            'height': height,
                        });
                    }
                };
            },

            resize: function(){
                subdiv.update_dimensions();
                subdiv.distribute_divs();
            },

            init: function(){
                opts.container.css('position', 'relative');
                this.resize();
                opts.viewport.on('resize', this.resize);
            },
        };

        subdiv.init();

        return subdiv;
    };

    $.fn.subdiv.defaults = {
        container: false,
        viewport: window,
        selector: 'div',
    };
}(jQuery));