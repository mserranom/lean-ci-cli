module.exports = dashboard;

function dashboard() {

    var blessed = require('blessed')
        , contrib = require('blessed-contrib')
        , screen = blessed.screen();


    var grid = new contrib.grid({rows: 6, cols: 2, screen: screen});

    var queueTable = grid.set(0, 0, 2, 1, contrib.table, {
        keys: true,
        fg: 'white',
        selectedFg: 'white',
        selectedBg: 'blue',
        interactive: true,
        label: 'Build Queue',
        width: '30%',
        height: '30%',
        border: {type: "line", fg: "cyan"},
        columnSpacing: 5, //in chars
        columnWidth: [25, 18] /*in chars*/
    });

    var activeTable = grid.set(2, 0, 1, 1, contrib.table, {
        keys: true,
        fg: 'white',
        selectedFg: 'white',
        selectedBg: 'blue',
        interactive: true,
        label: 'Active Builds',
        width: '30%',
        height: '30%',
        border: {type: "line", fg: "cyan"},
        columnSpacing: 5, //in chars
        columnWidth: [25, 18] /*in chars*/
    });

    var finishedTable = grid.set(3, 0, 3, 1, contrib.table, {
        keys: true,
        fg: 'white',
        selectedFg: 'white',
        selectedBg: 'blue',
        interactive: true,
        label: 'Finished Builds',
        width: '30%',
        height: '30%',
        border: {type: "line", fg: "cyan"},
        columnSpacing: 5, //in chars
        columnWidth: [25, 18] /*in chars*/
    });


    //allow control the table with the keyboard
    //queueTable.focus();

    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    screen.render();

    var req = require('../util/request');

    function updateQueueList() {
        req.request('/build/queue', function (body) {
            updateQueueData(JSON.parse(body));
        });
    }

    function updateQueueData(queue) {
        queueTable.setData({
                headers: ['repo', 'id'],
                data: queue.map(function (item) {
                    return [item.repo, item.id]
                })
            }
        );
        screen.render();
    }


    function updateActiveList() {
        req.request('/build/active', function (body) {
            updateActiveData(JSON.parse(body));
        });
    }

    function updateActiveData(queue) {
        activeTable.setData({
                headers: ['repo', 'id'],
                data: queue.map(function (item) {
                    return [item.repo, item.id]
                })
            }
        );
        screen.render();
    }

    function updateFinishedList() {
        req.request('/build/finished', function (body) {
            updateFinishedData(JSON.parse(body));
        })
    }

    function updateFinishedData(queue) {
        finishedTable.setData({
                headers: ['repo', 'id'],
                data: queue.map(function (item) {
                    return [item.request.repo, item.request.id]
                })
            }
        );
        screen.render();
    }


    updateQueueList();
    updateActiveList();
    setInterval(updateQueueList, 3000);
    setInterval(updateActiveList, 3000);
    //setInterval(updateFinishedList, 3000);

}







