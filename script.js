const width = 900;
const height = 500;

const margin = {
  top: 50,
  right: 40,
  bottom: 60,
  left: 80
};

// svg
const svg = d3
  .select("#chart")
  .attr("width", width)
  .attr("height", height);

// g group
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const graph = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// on recup les données gdp
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then((data) => {
  const dataset = data.data;

  // on transforme les dates en objets
  const dates = dataset.map(d => new Date(d[0]));
  const gdps = dataset.map(d => d[1]);

  // axe x (temporel)
  const xScale = d3.scaleTime()
  .domain([d3.min(dates), d3.max(dates)])
  .range([0, innerWidth]);

  // axe y (gdp)
  const yScale = d3.scaleLinear()
  .domain([0, d3.max(gdps)])
  .range([innerHeight, 0]);

  // axisBottom pour x
  const xAxis = d3.axisBottom(xScale);

  graph.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  // axisLeft pour y
  const yAxis = d3.axisLeft(yScale);

  graph.append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  // barres
const barWidth = innerWidth / dataset.length;

graph.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(new Date(d[0])))
  .attr("y", d => yScale(d[1]))
  .attr("width", barWidth)
  .attr("height", d => innerHeight - yScale(d[1]))
  .attr("data-date", d => d[0])
  .attr("data-gdp", d => d[1])
  .attr("fill", "#f08bb4"); // i'm just a girl
  
  // tooltip
const tooltip = d3.select("#tooltip");

graph.selectAll(".bar")
  .on("mouseover", function (event, d) {
    tooltip
      .style("opacity", 1)
      .attr("data-date", d[0])
      .html(`
        <strong>Date :</strong> ${d[0]}<br>
        <strong>GDP :</strong> $${d[1]} Billion
      `);

    // on positionne le tooltip
    const [x, y] = d3.pointer(event);
    tooltip
      .style("left", x + margin.left + 30 + "px")
      .style("top", y + margin.top + "px");
  })
  .on("mouseout", () => {
    tooltip.style("opacity", 0);
  });

});
