"use strict";

module.exports = dashboard;

const request = require('../util/request');


const COLORS = ['green', 'magenta', 'cyan', 'red', 'blue'];

function dashboard() {
    const blessed = require('blessed');
    const contrib = require('blessed-contrib');

    const screen = blessed.screen();
    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    const grid = new contrib.grid({rows: 4, cols: 4, screen: screen});




    const reposTree = grid.set(0, 0, 1, 1, contrib.tree, {fg: COLORS[0], label : 'Repositories'});

    const updateRepositoriesTree = (repos) => {
        const data = {extended: true, children: {}};
        repos.forEach(repo => data.children[repo.name] = {});
        reposTree.setData(data);
    };

    updateRepositoriesTree([]);

    function requestRepositories() {
        request.get('/repositories', repos => {
            updateRepositoriesTree(JSON.parse(repos));
            setTimeout(() => requestRepositories(), 10000);
        })
    }

    requestRepositories();





    const pipelinesTree = grid.set(1, 0, 1, 1, contrib.tree, {fg: COLORS[0], label : 'Pipelines', interactive: false});

    const updatePipelinesTree = (pipelines) => {
        const data = {extended: true, children: {}};
        pipelines.forEach(pipeline => data.children['#' + pipeline._id] = {});
        pipelinesTree.setData(data);
    };

    updatePipelinesTree([]);

    function requestPipelines() {
        request.get('/pipelines', pipelines => {
            updatePipelinesTree(JSON.parse(pipelines));
            setTimeout(() => requestPipelines(), 4000);
        })
    }

    requestPipelines();






    const buildTable = grid.set(0, 1, 2, 2, contrib.table,  {
          keys: true
        , interactive: false
        , label: 'Builds'
        , fg: 'white'
        , selectedFg: 'white'
        , selectedBg: 'blue'

        , width: '30%'
        , height: '30%'
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 10 //in chars
        , columnWidth: [16, 12, 12] /*in chars*/ });

    const updateBuildsTable = (builds) => {
        const data = {headers: ['repo', 'status', 'id'], data : []};
        builds.forEach(build => data.data.push([build.repo, build.status, build._id]));
        buildTable.setData(data);
    };

    updateBuildsTable([]);

    function requestBuilds() {
        request.get('/builds', builds => {
            updateBuildsTable(JSON.parse(builds));
            setTimeout(() => requestBuilds(), 4000);
        })
    }

    requestBuilds();






    screen.render();
    setInterval(() => screen.render(), 1000);

}
