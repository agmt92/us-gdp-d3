const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';


const w = 800;
const h = 550;
const margin = 50;
const scale = d3.scaleLinear();



const quarterFunct = (date) => {
    let quarter = '';
    let month = date.slice(5, 7);
    switch(month) {
        case '01':
            quarter = 'Q1';
            break;
        case '04':
            quarter = 'Q2';
            break;
        case '07':
            quarter = 'Q3';
            break;
        case '10':
            quarter = 'Q4';
            break;
    }
    return quarter;
}

const unitFunct = (num) => {
    return num>1000 ? Math.round(num/1000 * 1000) / 1000
 + ' Trillion': num + " Billion";
}

const tooltipFunct = (data) => {
    let quarter = quarterFunct(data[0]);
    let gdp = unitFunct(data[1]);
    let year = data[0].slice(0, 4);
    let result = `${year} ${quarter}
$${gdp}`;
    return result;
}

const gdpFunct = (gdp) => {
    num>1000 ? gdp = gdp.slice(0, -3) + '.' + gdp.slice(-3) + 'Trillion': gdp + "Billion";
}

document.addEventListener('DOMContentLoaded', () => {
    d3.json(url)
        .then(d => {
            let dataset = [];
            dataset = d.data;
            const gdpMax = d3.max(dataset, (d) => d[1]);
            const scaledDate = dataset.map((d) => new Date(d[0]));
            const yearMax = new Date(d3.max(scaledDate));
            yearMax.setMonth(yearMax.getMonth() + 3);


            

            const svg = d3.select("#chart")
                .append("svg")
                .attr("width", w + 100)
                .attr("height", h + 50)
                .style("margin", margin)


            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -200)
                .attr('y', 80)
                .text('GDP in Billions of Dollars')
                .style("fill", "black");
            
                svg.append('text')
                .attr("id", "title")
                .attr('x', w/1.2)
                .attr('y', h-margin+40)
                .text('Code by AG')
                .style("fill", "black");

            const tooltip = d3.select("#chart")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "rgba(0, 0, 0, 0.7)")
                .style("color", "white")
                .style("padding", "10px")
                .style("border-radius", "8px")
                .style("pointer-events", "none");

            const xScale = d3.scaleTime()
            .domain([d3.min(scaledDate), yearMax])
            .range([0, w]);

            const yScale = d3.scaleLinear()
                .domain([0, gdpMax])
                .range([h - margin, 0]);

            const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%Y"));
            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format(".2s"));

            svg.append("g")
                .call(xAxis)
                .attr("id", "x-axis")
                .attr("transform", `translate(${margin}, ${h - margin})`);

            svg.append("g")
                .call(yAxis)
                .attr("id", "y-axis")
                .attr("transform", `translate(${margin}, 0)`);

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i * (w / dataset.length) + margin)
                .attr("y", d => yScale(d[1]))
                .attr("width", (w) / dataset.length - 1)
                .attr("height", d => h - margin - yScale(d[1]))
                .attr("fill", "blue")
                .attr("class", "bar")
                .attr("data-date", d => d[0])
                .attr("data-gdp", d => d[1])
                .on("mouseover", (event, d) => {
                    tooltip.transition()
                        .duration(0)
                        .style("opacity", 0.9);
                    tooltip.html(tooltipFunct(d))
                        .attr("data-date", d[0])
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 400) + "px");
                })
                .on("mouseout", () => {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        })
        .catch(err => console.log(err));
});