























var starting_point = 0; 
var end_point; 

var drive_cycle;

const time_slider = document.getElementById("time-slider");
const time_select = document.getElementById("time-select");
const batt_slider = document.getElementById("batt-slider");
const batt_select = document.getElementById("batt-select");
var graph_div = document.getElementById("graph1");
const range_elem = document.getElementById("range-val");



const width = 625;
const height = 600;
const marginTop = 50;
const marginRight = 50;
const marginBottom = 60;
const marginLeft = 100;

var svg;
var line; 
var line2;
var line3; 

var seg1; 
var seg2;
var seg3;
var seg2_1, seg2_2, seg2_3; 
var seg3_1, seg3_2, seg3_3; 
var dataSlice1;
var dataSlice2;
var dataSlice3; 

var distance; 
var velocity; 
var time; 
var p_consump; 

var batt_cap;

gen_graph_from_data();

//gen_graphs();
// Update the displayed value when the slider changes

time_slider.addEventListener("input", function() {
    time_select.textContent = this.value;
    starting_point= this.value;
    regen_graph();
    update_range();
//    gen_graphs();
});
batt_slider.addEventListener("input", function() {
    batt_select.textContent = this.value;
    batt_cap = this.value;
    end_point = check_pwr_consump();
    regen_graph();
    update_range();
//     gen_graphs();
});

function gen_graph_from_data() {
    d3.csv("PACCARTruckDatav2.csv").then(function (data) {



    data.forEach(d => {
        d.Time = +d.Time;
        d.Velocity = +d.Velocity;
        d.Distance = +d.Distance;
        d.PowerConsump = +d.PowerConsump; 
    });

    drive_cycle = data; 

    distance = data.map(function(d) {
        return +d.Distance; // Adjust 'columnName' to the name of the column you want to extract
    });
    velocity = data.map(function(d) {
        return +d.Velocity; // Adjust 'columnName' to the name of the column you want to extract
    });
    time = data.map(function(d) {
        return +d.Time; // Adjust 'columnName' to the name of the column you want to extract
    });
    p_consump = data.map(function(d) {
        return +d.PowerConsump; // Adjust 'columnName' to the name of the column you want to extract
    });
    end_point = p_consump.length - 1;

    check_pwr_consump();

    const x = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.Time; }), d3.max(data, function(d) { return d.Time; }) + 500])
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d.Distance; }), d3.max(data, function(d) { return d.Distance; }) + 10000])
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    const yAxis = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (marginTop - 15)  + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "#0033cc")
        .style("font-family", "monaco, monospace")
        .style("font-size", "24px")
        .text("BEV Distance Vs. Time");


    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height - 15) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "#0033cc")
        .style("font-family", "monaco, monospace")
        .style("font-size", "20px")
        .text("Time (seconds)");
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", "#0033cc")
        .style("font-family", "monaco, monospace")
        .style("font-size", "20px")
        .text("Distance (m)");

    svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${marginLeft},0)`)
    .attr("stroke", "grey") // Change tick color
    .attr("opacity", 0.5) // Change tick opacity
    .call(d3.axisLeft(y)
        .tickSize(-width + marginLeft + marginRight)
        .tickFormat("")
    );
    svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + (height - marginBottom) + ")")
    .attr("stroke", "grey") // Change tick color
    .attr("opacity", 0.1) // Change tick opacity
    .call(d3.axisBottom(x)
        .tickSize(-height + marginTop + marginBottom)
        .tickFormat("")
    );



    line = d3.line()
    .x(d => x(d.Time))
    .y(d => y(d.Distance));

    // Add the line path to the SVG element

    //if (end_point < d3.max(data, function(d) { return d.Time; })) {
    dataSlice1 = data.slice(0, starting_point);
    dataSlice2 = data.slice(starting_point, end_point);
    dataSlice3 = data.slice(end_point, data.length);

    seg1 = svg.append("path")
    .datum(dataSlice1)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line);
    seg2 = svg.append("path")
    .datum(dataSlice2)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line);
    seg3 = svg.append("path")
    .datum(dataSlice3)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line);



    // // Add the chart title

    // Append the SVG element.
    graph1.append(svg.node());
    });

}
function regen_graph() {
    seg1.remove();
    seg2.remove();
    seg3.remove();

    if (starting_point > 0 && end_point <= p_consump.length - 1) {
        dataSlice1 = drive_cycle.slice(0, starting_point);
        dataSlice2 = drive_cycle.slice(starting_point, end_point);
        dataSlice3 = drive_cycle.slice(end_point, drive_cycle.length);
        seg1 = svg.append("path")
        .datum(dataSlice1)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 3)
        .attr("d", line);
        seg2 = svg.append("path")
        .datum(dataSlice2)
        .attr("fill", "none")
        .attr("stroke", "#4574f7")
        .attr("stroke-width", 3)
        .attr("d", line);
        seg3 = svg.append("path")
        .datum(dataSlice3)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 3)
        .attr("d", line);
    } else if (starting_point > 0 && end_point >= p_consump.length - 1) {
        dataSlice1 = drive_cycle.slice(0, starting_point);
        dataSlice2 = drive_cycle.slice(starting_point, drive_cycle.length);
        seg1 = svg.append("path")
        .datum(dataSlice1)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 3)
        .attr("d", line);
        seg2 = svg.append("path")
        .datum(dataSlice2)
        .attr("fill", "none")
        .attr("stroke", "#4574f7")
        .attr("stroke-width", 3)
        .attr("d", line);
    } else {
        dataSlice1 = drive_cycle.slice(0, starting_point);
        dataSlice2 = drive_cycle.slice(starting_point, drive_cycle.length);
        seg1 = svg.append("path")
        .datum(dataSlice1)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 3)
        .attr("d", line);
        seg2 = svg.append("path")
        .datum(dataSlice2)
        .attr("fill", "none")
        .attr("stroke", "#4574f7")
        .attr("stroke-width", 3)
        .attr("d", line);
    }

    graph1.append(svg.node());
}

function check_pwr_consump() {
    if (starting_point > end_point) {
        return p_consump.length - 1;
    }
    for (let i = starting_point; i < p_consump.length; i++) {
        if ((p_consump[i] - p_consump[starting_point]) > batt_cap) {
            return i; 
        } 
    }
    return (p_consump.legnth - 1);
}

function update_range() {
    let range = distance[end_point] - distance[starting_point];
    if (isNaN(range)) {
        range = 91772.14178 - distance[starting_point];
    } else if (range < 0) {
        range = 0; 
    }

    range = range / 1000; 
    let range_string = range.toFixed(2)
    range_elem.textContent = range_string + " km"; 
}

function gen_graphs() {

    line2 = d3.line()
    .x(d => x(d.Time))
    .y(d => y(d.PowerConsump));
    seg2_1 = svg.append("path")
    .datum(dataSlice1)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line2);
    seg2_2 = svg.append("path")
    .datum(dataSlice2)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line2);
    seg2_3 = svg.append("path")
    .datum(dataSlice3)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line2);
    graph2.append(svg.node());
    line3 = d3.line()
    .x(d => x(d.Time))
    .y(d => y(d.Velocity));

    line2 = d3.line()
    .x(d => x(d.Time))
    .y(d => y(d.PowerConsump));
    seg3_1 = svg.append("path")
    .datum(dataSlice1)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line3);
    seg3_2 = svg.append("path")
    .datum(dataSlice2)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line3);
    seg3_3 = svg.append("path")
    .datum(dataSlice3)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", 3)
    .attr("d", line3);
    graph2.append(svg.node());
}
