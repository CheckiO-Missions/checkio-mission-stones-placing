requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function stones_placing_visualization(tgt_node, data) {
            if (!data || !data.ext) {
                return
            }
            /**
             * attr
             */
            const attr = {
                'stone': [
                    // white
                    {
                        'fill': 'white',
                        'stroke-width': '0.3px',
                        'stroke': '#333333',
                    },
                    // black
                    {
                        'fill': '#666666',
                        'stroke-width': '0.0px',
                    },
                ],
                'grid': {
                    'stroke-width': '0.3px',
                    'fill': '#82D1F5',
                },
                'answer_cell': {
                    'stroke-width': '0px',
                    'fill': '#F4A561',
                },
            }
            /**
             * (function) make result-grid
             * @param row
             * @param col
             * @returns {*[]}
             */
            function stones_placing(row, col) {
                let conv_flg = false
                /**
                 * convert row and col
                 */
                if (row.length < col.length) {
                    conv_flg = true
                    const temp_row = row.slice()
                    row = col.slice()
                    col = temp_row.slice()
                }
                /**
                 * make all rows and all cols
                 */
                const result_rows = [row.slice()]
                const result_cols = [col.slice(1).reverse()]
                let old_row = row.slice()
                let old_col = col.slice()
                while (old_row.length > 1 && old_col.length > 1) {
                    const new_row = []
                    const new_col = []
                    let new_stone = old_col[1]
                    for (let i = 0; i < (old_row.length - 1); i += 1) {
                        new_stone = (new_stone + old_row[i] + old_row[i + 1]) > 1 ? 1 : 0
                        new_row.push(new_stone)
                    }
                    new_stone = old_row[1]
                    for (let i = 0; i < (old_col.length - 1); i += 1) {
                        new_stone = (new_stone + old_col[i] + old_col[i + 1]) > 1 ? 1 : 0
                        new_col.push(new_stone)
                    }
                    old_row = new_row.slice()
                    old_col = new_col.slice()
                    result_rows.push(new_row)
                    result_cols.push(new_col.slice(1).reverse())
                }
                /**
                 * combine result_rows and result_cols
                 */
                let result_table = []
                for (let r = 0; r < result_rows.length; r += 1) {
                    let temp_row = []
                    for (let c = 0; c < result_cols.length; c += 1) {
                        temp_row = temp_row.concat(result_cols[c].slice(result_cols[0].length - (r), result_cols[0].length - (r-1)))
                    }
                    result_table.push(temp_row.concat(result_rows[r]))
                }
                /**
                 * convert row and col again
                 */
                if (conv_flg) {
                    const temp_tables = result_table.slice()
                    result_table = []
                    for (let r = 0; r < row.length; r += 1) {
                        let temp_row = []
                        for (let c = 0; c < col.length; c += 1) {
                            temp_row.push(temp_tables[c][r])
                        }
                        result_table.push(temp_row)
                    }
                }
                return result_table
            }
            /**
             * values
             */
            const input = data.in
            const output = stones_placing(...input)
            const row_num = output.length
            const col_num = output[0].length
            const os = 10
            const unit = 200 / Math.max(row_num, col_num)
            const grid_seize_px_w = unit * col_num + os * 2
            const grid_seize_px_h = unit * row_num + os * 2
            // guard from too big data
            if (row_num > 100 || col_num > 100) {
                return
            }
            /**
             * paper
             */
            const paper = Raphael(tgt_node, grid_seize_px_w, grid_seize_px_h)
            /**
             * drow color rectangles
             */
            // horizontal
            for (let i = 0; i < row_num / 2; i += 1) {
                paper.rect(
                    os + unit * (i * 2),
                    os + unit * (i * 2),
                    unit * (col_num - i * 2),
                    unit
                ).attr(attr.grid)
            }
            // virtical
            for (let i = 0; i < col_num / 2; i += 1) {
                paper.rect(
                    os + unit * (i * 2),
                    os + unit * (i * 2),
                    unit,
                    unit * (row_num - i * 2),
                ).attr(attr.grid)
            }
            // answer cell
            paper.rect(
                os + unit * (col_num - 1),
                os + unit * (row_num - 1),
                unit,
                unit,
            ).attr(attr.answer_cell)
            /**
             * draw stones
             */
            for (let y = 0; y < row_num; y += 1) {
                for (let x = 0; x < col_num; x += 1) {
                    paper.circle(os + (x + .5) * unit, os + (y + .5) * unit, unit / 2 * .75).attr(
                        attr.stone[output[y][x]]
                    )
                }
            }
        }
        var io = new extIO({
            animation: function ($expl, data) {
                stones_placing_visualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
