import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card } from "react-bootstrap";
import "./PerformanceChart.css";

interface PerformanceData {
  course: string;
  score: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 350 });

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;

        // Match the same dimensions as StudentDistributionChart
        const width = Math.min(containerWidth - 40, isMobile ? 350 : 500);
        const height = isMobile ? 320 : 350;

        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const isMobile = width <= 400;

    const margin = {
      top: isMobile ? 25 : 30,
      right: isMobile ? 20 : 30,
      bottom: isMobile ? 70 : 60,
      left: isMobile ? 50 : 60,
    };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales - adjust padding for mobile to make bars wider
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.course))
      .range([0, chartWidth])
      .padding(isMobile ? 0.2 : 0.3); // Reduced padding on mobile for wider bars

    const yScale = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

    // Colors
    const colors = [
      "#4a6fa5", // Blue
      "#28a745", // Green
      "#17a2b8", // Teal
      "#ffc107", // Yellow
      "#dc3545", // Red
      "#6c757d", // Gray
    ];

    // Calculate minimum bar width for mobile
    const minBarWidth = isMobile ? 20 : 30;
    const calculatedBandwidth = xScale.bandwidth();
    const barWidth = Math.max(calculatedBandwidth, minBarWidth);

    // Adjust x position to center bars when we use minimum width
    const xPosition = (d: PerformanceData) => {
      const x = xScale(d.course)!;
      return x + (calculatedBandwidth - barWidth) / 2;
    };

    // Bars - with adjusted width for mobile
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", xPosition)
      .attr("y", (d) => yScale(d.score))
      .attr("width", barWidth)
      .attr("height", (d) => chartHeight - yScale(d.score))
      .attr("fill", (d, i) => colors[i % colors.length])
      .attr("opacity", 0.8)
      .attr("rx", 3) // Rounded corners
      .attr("ry", 3);

    // X Axis
    const xAxis = chart
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale));

    // Adjust x-axis labels for mobile
    xAxis
      .selectAll("text")
      .attr("transform", isMobile ? "rotate(-45)" : "rotate(0)")
      .style("text-anchor", isMobile ? "end" : "middle")
      .attr("dx", isMobile ? "-0.8em" : "0")
      .attr("dy", isMobile ? "0.5em" : "0.5em")
      .style("font-size", isMobile ? "10px" : "11px");

    // Y Axis
    chart
      .append("g")
      .call(d3.axisLeft(yScale).ticks(isMobile ? 5 : 6))
      .selectAll("text")
      .style("font-size", isMobile ? "10px" : "11px");

    // Grid lines
    chart
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(isMobile ? 5 : 6)
          .tickSize(-chartWidth)
          .tickFormat(() => "")
      )
      .style("opacity", 0.1)
      .selectAll("line")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "2,2");

    // Labels
    chart
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + (isMobile ? 50 : 40))
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "12px" : "13px")
      .style("font-weight", "500")
      .text("Courses");

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", isMobile ? -35 : -40)
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "12px" : "13px")
      .style("font-weight", "500")
      .text("Average Score (%)");

    // Value labels on bars - adjust positioning for mobile
    chart
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => xPosition(d) + barWidth / 2)
      .attr("y", (d) => yScale(d.score) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-size", isMobile ? "10px" : "11px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text((d) => `${d.score}%`);

    // For very tall bars, put the label inside
    chart.selectAll(".bar-label").each(function (d: any) {
      const label = d3.select(this);
      const barHeight = chartHeight - yScale(d.score);

      // If bar is too short for label on top, put it inside at the bottom
      if (barHeight < 20) {
        label
          .attr("y", yScale(d.score) + barHeight / 2)
          .attr("fill", "#fff")
          .style("text-shadow", "0px 1px 2px rgba(0,0,0,0.7)");
      }
    });

    // Tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("z-index", "1000")
      .style("font-size", "14px");

    chart
      .selectAll(".bar")
      .on("mouseover", function (event, d: any) {
        // Highlight bar
        d3.select(this).attr("opacity", 1);

        tooltip.style(
          "opacity",
          1
        ).html(`<div style="font-weight: bold; margin-bottom: 4px;">${d.course}</div>
                 <div>Average Score: <strong>${d.score}%</strong></div>`);
      })
      .on("mousemove", function (event) {
        const tooltipWidth = 150;
        const tooltipHeight = 70;
        const x = event.pageX + 10;
        const y = event.pageY - 10;

        // Prevent tooltip from going off screen
        const adjustedX =
          x + tooltipWidth > window.innerWidth
            ? event.pageX - tooltipWidth - 10
            : x;
        const adjustedY =
          y + tooltipHeight > window.innerHeight
            ? event.pageY - tooltipHeight - 10
            : y;

        tooltip.style("left", adjustedX + "px").style("top", adjustedY + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, dimensions]);

  return (
    <Card className="border-0 shadow-sm chart-card">
      <Card.Body className="chart-card-body">
        <div className="chart-header">
          <h5 className="chart-title">Student Performance by Course</h5>
        </div>
        <div ref={containerRef} className="chart-container-responsive">
          <svg ref={svgRef} className="chart-svg"></svg>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PerformanceChart;
