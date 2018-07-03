//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $, TableComponent) {

        function unfairDistrictsCanvas(dom, dataInp, 
            dataExpAnswer, user_result, dataExpCheckResult){

            const cellSize = 40,
                grid = dataInp[1],
                [h, w] = [grid.length, grid[0].length],
                size = h*w,
                zx = 10 + (w <= 5 ? cellSize * ((6 - w) / 2) : 0),
                zy = 10,
                fullSizeX = 10 * 2 + cellSize * (w <= 5 ? 6 : w),
                fullSizeY = zy * 2 + cellSize * h + 20;

            const color = {
                dark: "#294270",
                erase: "#DFE8F7",
                orange: "#FABA00",
                blue: "#8FC7ED",
            };

            const attr = {
                rect: {
                    'stroke': color.dark,
                    'stroke-width': 1
                },
                rect2: {
                    'stroke': color.dark,
                    'stroke-width': 3
                },
                text: {
                    'stroke': color.dark,
                    'font-size': 16, 
                    'font-family': "Verdana"
                },
            };

            // draw cell & text
            const paper = Raphael(dom, fullSizeX, fullSizeY, 0, 0);
            var cell_dic = paper.set();
            for (var i = 0; i < h; i+=1) {
                for (var j = 0; j < w; j+=1) {
                    // cell
                    cell_dic[i*w+j+1]
                        = paper.rect(zx + j * cellSize,
                            zy + i * cellSize,
                            cellSize,
                            cellSize).attr(attr.rect).attr("fill",
                                color.erase);
                    // text
                    paper.text(zx + j * cellSize + cellSize / 2,
                        zy + i * cellSize + cellSize / 2,
                        grid[i].slice(j, j+1)
                    ).attr(attr.text);
                }
            }
            
            if (!dataExpAnswer || dataExpAnswer.length === 0 ||
                dataExpCheckResult === false) {
                return 
            }

            function createLinePath(x1, y1, x2, y2) {
                return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
            }

            function adj_cells(cell) {
                var result = [];
                if (cell % w != 1 && cell - 1 > 0) {
                    result.push(cell - 1);
                }
                if (cell % w && cell + 1 <= size) {
                    result.push(cell + 1);
                }
                if (Math.floor((cell-1) / w)) {
                    result.push(cell - w);
                }
                if (Math.floor((cell-1) / w) < h-1) {
                    result.push(cell + w);
                }
                return result;
            }

            var cell_obj = {};

            for (var i=0; i < size; i +=1) {
                cell_obj[i+1] = {
                    'vote': 
                        grid[Math.floor(i / w)][i % w], 
                    'adj': adj_cells(i+1)}
            }

            // districts checking
            var an_lines = paper.set();
            var cell_win = paper.set();
            var cell_lose = paper.set();
            var [win, lose, draw] = [0, 0, 0]; 

            // translate user_result 
            var ds_dic = {};
            const urj = user_result.join('');
            for (var i=1; i <= urj.length; i += 1) {
                const a = urj[i-1];
                if (ds_dic[a]) {
                    ds_dic[a].push(i);
                } else {
                    ds_dic[a] = [i];
                }
            } 

            var user_result_nums = [];
            for (var k in ds_dic) {
                user_result_nums.push(ds_dic[k]);
            }

            user_result_nums.forEach(district=>{
                var [vote_A, vote_B] = [0, 0]; 

                district.forEach(n=>{
                    vote_A += cell_obj[n].vote[0]; 
                    vote_B += cell_obj[n].vote[1]; 
                    const o = cell_dic[n].attr(); 
                    if (district.indexOf(n-w) < 0 || n < w) {
                        an_lines.push(paper.path(createLinePath(
                            o.x, 
                            o.y, 
                            o.x + o.width, 
                            o.y 
                        )).attr(attr.rect));
                    }
                    if (district.indexOf(n+w) < 0) {
                        an_lines.push(paper.path(createLinePath(
                            o.x, 
                            o.y + o.height, 
                            o.x + o.width, 
                            o.y + o.height 
                        )).attr(attr.rect));
                    }
                    if (district.indexOf(n+1) < 0 || n % w === 0) {
                        an_lines.push(paper.path(createLinePath(
                            o.x + o.width, 
                            o.y, 
                            o.x + o.width, 
                            o.y + o.height 
                        )).attr(attr.rect));
                    }
                    if (district.indexOf(n-1) < 0 || n % w === 1) {
                        an_lines.push(paper.path(createLinePath(
                            o.x, 
                            o.y, 
                            o.x, 
                            o.y + o.height 
                        )).attr(attr.rect));
                    }
                });

                if (vote_A > vote_B) {
                    district.forEach(n=>{
                        cell_win.push(cell_dic[n]);
                    });
                    win += 1;
                } else if (vote_A < vote_B) {
                    district.forEach(n=>{
                        cell_lose.push(cell_dic[n]);
                    });
                    lose += 1;
                } else {
                    draw += 1;
                }
            });

            setTimeout(function () {
                an_lines.animate(attr.rect2, 600 );
                cell_win.animate({'fill': color.orange}, 600);
                cell_lose.animate({'fill': color.blue}, 600);

            }, 400);
            
            // win lose draw
            win_lose_draw = paper.text(fullSizeX / 2, fullSizeY - 10,
                '{Wins: '+win+', Losses: '+lose+', Draws: '+draw+'}'
            ).attr(attr.text);
        }

        var $tryit;
        var io = new extIO({
            multipleArguments: true,
            functions: {
                js: 'unfairDistricts',
                python: 'unfair_districts'
            },
            animation: function($expl, data){
                var answer = data.ext?data.ext.answer:null,
                    result = data.ext?data.ext.result:null;
                unfairDistrictsCanvas(
                    $expl[0],
                    data.in,
                    answer,
                    data.out,
                    result
                );
            }
        });
        io.start();
    }
);
