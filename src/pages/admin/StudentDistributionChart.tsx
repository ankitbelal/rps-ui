import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card } from "react-bootstrap";
import "./StudentDistributionChart.css";

interface DistributionData {
  program: string;
  students: number;
  color: string;
}

interface StudentDistributionChartProps {
  data: DistributionData[];
  Loading: boolean;
}

const VIVID_COLORS = [
  "#6366f1",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#14b8a6",
  "#8b5cf6",
];

const StudentDistributionChart: React.FC<StudentDistributionChartProps> = ({
  data,
  Loading = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 380 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDimensions({ width: w, height: w < 480 ? 320 : 380 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const total = d3.sum(data, (d) => d.students);

    const coloredData = data.map((d, i) => ({
      ...d,
      color: VIVID_COLORS[i % VIVID_COLORS.length],
    }));

    /* ── Legend geometry ── */
    const legendRowH = 26; // ↑ taller rows so text breathes
    const legendCols = Math.min(coloredData.length, 4);
    const legendRows = Math.ceil(coloredData.length / legendCols);
    const legendH = legendRows * legendRowH + 28;

    /* ── Pie geometry ── */
    const pieAreaH = height - legendH;
    const pieCX = width / 2;
    const pieCY = pieAreaH / 2;
    const outerR = Math.min(pieCX - 24, pieCY - 16, 130); // ← 130 instead of 160
    const innerR = outerR * 0.5;
    const midR = (innerR + outerR) / 2;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    /* ── Drop shadow ── */
    const defs = svg.append("defs");
    const f = defs
      .append("filter")
      .attr("id", "sdc-sh")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    f.append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 3)
      .attr("stdDeviation", 8)
      .attr("flood-color", "rgba(0,0,0,0.11)");

    /* ── Pie ── */
    const pie = d3
      .pie<(typeof coloredData)[0]>()
      .value((d) => d.students)
      .sort(null)
      .padAngle(0.03);

    const arc = d3
      .arc<d3.PieArcDatum<(typeof coloredData)[0]>>()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .cornerRadius(6);

    const arcHover = d3
      .arc<d3.PieArcDatum<(typeof coloredData)[0]>>()
      .innerRadius(innerR - 3)
      .outerRadius(outerR + 9)
      .cornerRadius(6);

    const chartG = svg
      .append("g")
      .attr("transform", `translate(${pieCX},${pieCY})`)
      .attr("filter", "url(#sdc-sh)");

    const arcs = chartG
      .selectAll(".arc")
      .data(pie(coloredData))
      .enter()
      .append("g")
      .attr("class", "arc");

    const paths = arcs
      .append("path")
      .attr("d", (d) => arc(d) as string)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2.5)
      .attr("opacity", 0.92)
      .style("cursor", "pointer");

    /* % labels inside segments */
    arcs.each(function (d) {
      const pct = Math.round((d.data.students / total) * 100);
      const arcLen = (d.endAngle - d.startAngle) * midR;
      if (pct < 5 || arcLen < 22) return;
      const mid = (d.startAngle + d.endAngle) / 2;
      d3.select(this)
        .append("text")
        .attr(
          "transform",
          `translate(${Math.sin(mid) * midR},${-Math.cos(mid) * midR})`,
        )
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#fff")
        .attr("font-size", "11px")
        .attr("font-weight", "700")
        .attr("pointer-events", "none")
        .text(`${pct}%`);
    });

    /* Centre label */
    const cg = svg
      .append("g")
      .attr("transform", `translate(${pieCX},${pieCY})`);
    cg.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("font-size", "22px")
      .attr("font-weight", "800")
      .attr("fill", "#1f2937")
      .text(total.toLocaleString());
    cg.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 13)
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .attr("fill", "#9ca3af")
      .attr("letter-spacing", "1")
      .text("STUDENTS");

    /* ── Legend — measured widths, tight columns ── */
    const charW = 7; // ↑ wider estimate for bigger font
    const rectW = 13; // ↑ slightly bigger swatch
    const textOff = 20; // rect(13) + gap(7)

    const itemW = coloredData.map((item) => {
      const lbl =
        item.program.length > 14
          ? `${item.program.substring(0, 14)}…`
          : item.program;
      return textOff + `${lbl}: ${item.students}`.length * charW;
    });

    const colMax: number[] = Array(legendCols).fill(0);
    coloredData.forEach((_, i) => {
      colMax[i % legendCols] = Math.max(colMax[i % legendCols], itemW[i]);
    });

    const colGap = 20;
    const colX: number[] = [];
    let cur = 0;
    for (let c = 0; c < legendCols; c++) {
      colX.push(cur);
      cur += colMax[c] + colGap;
    }
    const totLegW = cur - colGap;
    const legStartX = (width - totLegW) / 2;
    const legY = pieAreaH + 28;

    const lgG = svg
      .append("g")
      .attr("transform", `translate(${legStartX},${legY})`);

    coloredData.forEach((item, i) => {
      const col = i % legendCols;
      const row = Math.floor(i / legendCols);
      const lbl =
        item.program.length > 14
          ? `${item.program.substring(0, 14)}…`
          : item.program;

      const itemG = lgG
        .append("g")
        .attr("transform", `translate(${colX[col]},${row * legendRowH})`);

      /* Coloured square */
      itemG
        .append("rect")
        .attr("width", rectW)
        .attr("height", rectW)
        .attr("fill", item.color)
        .attr("rx", 3)
        .attr("y", 2);

      /* Label text — bigger + bolder */
      itemG
        .append("text")
        .attr("x", textOff)
        .attr("y", 9)
        .attr("dominant-baseline", "middle")
        .attr("font-size", "13.5px") // ↑ was 12px
        .attr("font-weight", "600") // ↑ was unset/400
        .attr("fill", "#374151") // ↑ darker than #444
        .text(`${lbl}: ${item.students}`);
    });

    /* ── Tooltip ── */
    const tip = d3
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

    paths
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr(
            "d",
            (d) =>
              arcHover(d as d3.PieArcDatum<(typeof coloredData)[0]>) as string,
          )
          .attr("opacity", 1);
        const pct = Math.round((d.data.students / total) * 100);
        tip.style("opacity", 1).html(
          `<div style="font-weight:bold;color:${d.data.color};margin-bottom:4px">${d.data.program}</div>
           <div>Students: ${d.data.students}</div><div>Percentage: ${pct}%</div>`,
        );
      })
      .on("mousemove", function (event) {
        const tw = 150,
          th = 80,
          x = event.pageX + 10,
          y = event.pageY - 10;
        tip
          .style(
            "left",
            `${x + tw > window.innerWidth ? event.pageX - tw - 10 : x}px`,
          )
          .style(
            "top",
            `${y + th > window.innerHeight ? event.pageY - th - 10 : y}px`,
          );
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr(
            "d",
            (d) => arc(d as d3.PieArcDatum<(typeof coloredData)[0]>) as string,
          )
          .attr("opacity", 0.92);
        tip.style("opacity", 0);
      });

    return () => {
      tip.remove();
    };
  }, [data, dimensions]);

  return (
    <Card className="border-0 shadow-sm chart-card h-100">
      {Loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: 200 }}
        >
          <span
            className="spinner-border text-primary"
            role="status"
            aria-hidden="true"
          />
        </div>
      ) : (
        <Card.Body className="chart-card-body d-flex flex-column">
          <h5 className="chart-title">
            Student <span className="chart-title-gradient">Distribution</span>{" "}
            by Program
          </h5>
          <div
            ref={containerRef}
            className="chart-container-responsive flex-grow-1"
          >
            <svg ref={svgRef} className="chart-svg" />
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

export default StudentDistributionChart;
