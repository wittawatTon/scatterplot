import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './App.css';
/*
const strTimeCvt =(str)=>{
    // Split the time string into minutes and seconds
    const [minutes, seconds] = str.split(':').map(Number);

    // Calculate the total seconds
    const totalSeconds = (minutes * 60) + seconds;
  
    return totalSeconds;
}
*/
const App = () => {
  useEffect(() => {

    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(data => {
        if (!data) {
          console.error('No data found');
          return;
        }
        console.log("data: " + JSON.stringify(data, null, 2));
        console.log("data length: " + data.length);

        const width = 1000;
        const height = 500;

        // Clear previous SVG elements to prevent duplicate graphs
        d3.select('.visHolder').selectAll('*').remove();

        const tooltip = d3.select('.visHolder')
        .append('div')
        .attr('id', 'tooltip');
  
      let svgContainer = d3.select('.visHolder')
        .append('svg')
        .attr('width', width + 120)
        .attr('height', height + 100);
        const X = data.map(item => Number(item.Year));
        //console.log("X:"+dateData);
        const maxX = (d3.max(X));
        let minX = (d3.min(X));
        minX--;
        //console.log("X max:min "+maxX+":"+minX);

        const xScale = d3.scaleLinear()
          .domain([minX, maxX])
          .range([0, width]);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

        svgContainer.append('g')
          .call(xAxis)
          .attr('id', 'x-axis')
          .attr('transform', 'translate(60,'+ (height+20) +')');

      
        const Y = data.map(item => {
          const [minutes, seconds]=(item.Time).split(':')
          return new Date(1970, 0, 1, 0, minutes, seconds);
      });
        const maxY = d3.max(Y);
        const minY = d3.min(Y);
        const timeFormat = d3.timeFormat('%M:%S');
        //console.log("Y:"+Y);
        //console.log("Y max:min "+maxY+":"+minY);


        const yScale = d3.scaleTime()
          .domain([minY, maxY])
          .range([0, height]);

        const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
        svgContainer.append('g')
          .call(yAxis)
          .attr('id', 'y-axis')
          .attr('transform', 'translate(60, 20)');

        //merge data
        const mData = X.map((value, index) => [value, Y[index]]);

        svgContainer.selectAll('circle')
          .data(mData)
          .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('index', (d, i) => i)
          .attr('data-xvalue', (d, i) => d[0])
          .attr('data-yvalue', (d, i) => d[1])
          .attr('cx', (d, i) => xScale(d[0]))
          .attr('cy', (d, i) => yScale(d[1]))
          .attr('r', 10)
          .style('fill', '#233')
          .attr('transform', 'translate(60, 20)')
          .on('mouseover', function (event, d) {
            const i = this.getAttribute('index');
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(data[i].Name + '<br>Time:' + data[i].Time + '<br>Year:' + data[i].Year).style('left', 40 + 'px');
          })
          .on('mouseout', function () {
            tooltip.transition().duration(300).style('opacity', 0);
          });
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div id="title">Doping in Professional Bicycle Racing</div>
        <div className="visHolder"></div>
      </div>
    </div>
  );
};

export default App;
