document.getElementById('submit-btn').addEventListener('click', function() {
    var fileInput = document.getElementById('csv-file');
    var file = fileInput.files[0];

    if (!file) {
        alert('Please upload a CSV file.');
        return;
    }

    var formData = new FormData();
    formData.append('csv-file', file);

    fetch('/grade', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        var resultDiv = document.getElementById('grades-result');
        if (data.error) {
            resultDiv.innerHTML = '<p class="text-danger">' + data.error + '</p>';
        } else {
            resultDiv.innerHTML = '<p class="text-success">File processed successfully. <a href="/download">Download the result CSV</a>.</p>';
            drawChart(data.grades);
            drawLegend();
        }
    });
});

function drawChart(data) {
    document.getElementById('chart').innerHTML = '';

    var svg = d3.select("#chart").append("svg")
        .attr("width", 800)  // Adjusted the width to be slightly smaller
        .attr("height", 200);

    var margin = {left: 50, right: 50, top: 20, bottom: 50};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Marks)])
        .range([0, width]);

    var colors = {
        'A': 'red', 'A-': 'orange', 'B': 'yellow', 'B-': 'green',
        'C': 'blue', 'C-': 'indigo', 'D': 'violet', 'E': 'grey'
    };

    var g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.Marks))
        .attr("cy", height / 2)
        .attr("r", 3)  // Reduced the size of the points further
        .attr("fill", d => colors[d.Grade]);

    g.append("g")
        .attr("transform", `translate(0,${height / 2})`)
        .call(d3.axisBottom(x).ticks(10));  // Adjusted the number of ticks for better spacing
}

function drawLegend() {
    var legend = d3.select("#legend");

    var grades = ['A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'E'];
    var colors = {
        'A': 'red', 'A-': 'orange', 'B': 'yellow', 'B-': 'green',
        'C': 'blue', 'C-': 'indigo', 'D': 'violet', 'E': 'grey'
    };

    legend.selectAll("*").remove();  // Clear any existing legend items

    grades.forEach(function(grade) {
        var legendItem = legend.append("div")
            .attr("class", "legend-item");

        legendItem.append("span")
            .style("background-color", colors[grade]);

        legendItem.append("span")
            .text(grade);
    });
}
