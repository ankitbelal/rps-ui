import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import "./css/StudentReportChart.css";
import { useGetStudentReportGraphQuery } from "../../../features/admin/dashboard/dahboardApi";
import { useGetProgramsQuery } from "../../../features/admin/students/studentApi";
import {
  Params,
  StudentGraphData,
} from "../../../features/admin/dashboard/utils";

interface SeriesConfig {
  key: keyof Omit<StudentGraphData, "year">;
  label: string;
  color: string;
}

interface Props {
  onRangeChange?: (fromYear: number, toYear: number) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SERIES: SeriesConfig[] = [
  { key: "new", label: "New", color: "#10b981" },
  { key: "passed", label: "Passed", color: "#f59e0b" },
  { key: "disabled", label: "Disabled", color: "#f43f5e" },
];

const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2015;

const ALL_YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => START_YEAR + i,
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fillRange(
  data: StudentGraphData[],
  fromYear: number,
  toYear: number,
): StudentGraphData[] {
  const map = new Map(data.map((d) => [d.year, d]));
  const result: StudentGraphData[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    result.push(map.get(y) ?? { year: y, new: 0, passed: 0, disabled: 0 });
  }
  return result;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Sk = ({ className }: { className: string }) => (
  <div className={`skeleton ${className}`} />
);

// ─── Draw Chart ───────────────────────────────────────────────────────────────
function drawChart(
  svgEl: SVGSVGElement,
  wrapEl: HTMLDivElement,
  tipEl: HTMLDivElement,
  chartData: StudentGraphData[],
  visible: Record<string, boolean>,
) {
  const totalWidth = wrapEl.clientWidth;
  if (!totalWidth) return;

  const margin = { top: 14, right: 24, bottom: 36, left: 52 };
  const width = totalWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  d3.select(svgEl).selectAll("*").remove();

  const svg = d3
    .select(svgEl)
    .attr("width", totalWidth)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "srg-svg");

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "srg-clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height + 10)
    .attr("y", -5);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const chartArea = g.append("g").attr("clip-path", "url(#srg-clip)");

  const x = d3
    .scaleLinear()
    .domain(d3.extent(chartData, (d) => d.year) as [number, number])
    .range([0, width]);

  const activeKeys = SERIES.filter((s) => visible[s.key]).map((s) => s.key);
  const yMax =
    d3.max(chartData, (d) =>
      Math.max(...activeKeys.map((k) => d[k] as number)),
    ) ?? 1;
  const y = d3
    .scaleLinear()
    .domain([0, yMax * 1.12])
    .nice()
    .range([height, 0]);

  g.append("g")
    .attr("class", "grid")
    .call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => ""),
    )
    .select(".domain")
    .remove();

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(chartData.map((d) => d.year))
        .tickFormat((d) => String(d))
        .tickSize(4),
    );

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

  const defs = svg.select("defs");
  SERIES.forEach((s) => {
    if (!visible[s.key]) return;

    const gradId = `srg-grad-${s.key}`;
    const grad = defs
      .append("linearGradient")
      .attr("id", gradId)
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    grad
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", s.color)
      .attr("stop-opacity", 0.26);
    grad
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", s.color)
      .attr("stop-opacity", 0.02);

    const areaGen = d3
      .area<StudentGraphData>()
      .x((d) => x(d.year))
      .y0(y(0))
      .y1((d) => y(d[s.key] as number))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const lineGen = d3
      .line<StudentGraphData>()
      .x((d) => x(d.year))
      .y((d) => y(d[s.key] as number))
      .curve(d3.curveCatmullRom.alpha(0.5));

    chartArea
      .append("path")
      .datum(chartData)
      .attr("fill", `url(#${gradId})`)
      .attr("d", areaGen);
    chartArea
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", s.color)
      .attr("stroke-width", 2.2)
      .attr("d", lineGen);
  });

  const crosshair = g
    .append("line")
    .attr("class", "crosshair")
    .attr("y1", 0)
    .attr("y2", height)
    .style("display", "none");

  const hoverDots: Record<
    string,
    d3.Selection<SVGCircleElement, unknown, null, undefined>
  > = {};
  SERIES.forEach((s) => {
    hoverDots[s.key] = g
      .append("circle")
      .attr("r", 5)
      .attr("fill", s.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("display", "none")
      .style("pointer-events", "none");
  });

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", `translate(${margin.left},0)`)
    .attr("fill", "transparent")
    .on("mousemove", function (event: MouseEvent) {
      const [mx] = d3.pointer(event, this);
      const hovered = x.invert(mx);
      const nearest = chartData.reduce((p, c) =>
        Math.abs(c.year - hovered) < Math.abs(p.year - hovered) ? c : p,
      );

      crosshair
        .attr("x1", x(nearest.year))
        .attr("x2", x(nearest.year))
        .style("display", null);

      SERIES.forEach((s) => {
        if (visible[s.key]) {
          hoverDots[s.key]
            .attr("cx", x(nearest.year))
            .attr("cy", y(nearest[s.key] as number))
            .style("display", null);
        } else {
          hoverDots[s.key].style("display", "none");
        }
      });

      tipEl.style.opacity = "1";
      tipEl.style.left = `${event.clientX + 16}px`;
      tipEl.style.top = `${event.clientY - 16}px`;
      tipEl.innerHTML = `
        <div class="srg-tooltip-title">Year ${nearest.year}</div>
        ${SERIES.map(
          (s) => `
          <div class="srg-tooltip-row">
            <div class="srg-tooltip-left">
              <div class="srg-tooltip-dot" style="background:${s.color}"></div>
              ${s.label}
            </div>
            <span class="srg-tooltip-val">${(nearest[s.key] as number).toLocaleString()}</span>
          </div>`,
        ).join("")}`;
    })
    .on("mouseleave", () => {
      crosshair.style("display", "none");
      SERIES.forEach((s) => hoverDots[s.key].style("display", "none"));
      tipEl.style.opacity = "0";
    });
}

// ─── Main Component ───────────────────────────────────────────────────────────
const StudentReportGraph: React.FC<Props> = ({ onRangeChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [fromYear, setFromYear] = useState<number | null>(null);
  const [toYear, setToYear] = useState<number | null>(null);
  const [visible, setVisible] = useState<Record<string, boolean>>({
    new: true,
    passed: true,
    disabled: true,
  });

  const [queryParams, setQueryParams] = useState<Params>({
    fromYear: CURRENT_YEAR - 3,
    toYear: CURRENT_YEAR,
  });

  const { data: programData } = useGetProgramsQuery();

  const {
    data: apiResponse,
    isFetching,
    isError,
  } = useGetStudentReportGraphQuery(queryParams);

  // stop skeleton if error (server down / network issue)
  const isLoading = !apiResponse && !isError;

  useEffect(() => {
    if (!apiResponse) return;
    setFromYear(apiResponse.fromYear);
    setToYear(apiResponse.toYear);
  }, [apiResponse]);

  const handleFromChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = Number(e.target.value);
      setFromYear(val);
      setToYear((prev) => (prev === null || prev <= val ? null : prev));
    },
    [],
  );

  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = Number(e.target.value);
      setToYear(val);
      if (fromYear !== null) {
        setQueryParams((prev) => ({ ...prev, fromYear, toYear: val }));
        onRangeChange?.(fromYear, val);
      }
    },
    [fromYear, onRangeChange],
  );

  // ── Program filter handler ────────────────────────────────────────────────────
  const handleProgramChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setQueryParams((prev) => ({
        ...prev,
        programId: val ? Number(val) : undefined,
      }));
    },
    [],
  );

  const chartData: StudentGraphData[] = (() => {
    if (!apiResponse || fromYear === null || toYear === null) return [];
    return fillRange(apiResponse.data, fromYear, toYear);
  })();

  const hasData = chartData.some(
    (d) => d.new > 0 || d.passed > 0 || d.disabled > 0,
  );

  // ── Draw on data / visibility change ─────────────────────────────────────────
  useEffect(() => {
    const svgEl = svgRef.current;
    const wrapEl = wrapRef.current;
    const tipEl = tooltipRef.current;
    if (!svgEl || !wrapEl || !tipEl || isFetching || !hasData) return;
    drawChart(svgEl, wrapEl, tipEl, chartData, visible);
  }, [chartData, visible, isFetching, hasData]);

  // ── ResizeObserver ────────────────────────────────────────────────────────────
  useEffect(() => {
    const svgEl = svgRef.current;
    const wrapEl = wrapRef.current;
    const tipEl = tooltipRef.current;
    if (!svgEl || !wrapEl || !tipEl || !hasData || isFetching) return;

    const observer = new ResizeObserver(() => {
      drawChart(svgEl, wrapEl, tipEl, chartData, visible);
    });

    observer.observe(wrapEl);
    return () => observer.disconnect();
  }, [chartData, visible, hasData, isFetching]);

  const toYearOptions =
    fromYear !== null
      ? ALL_YEARS.filter((y) => y > fromYear && y <= CURRENT_YEAR)
      : [];

  return (
    <div className="srg-card">
      {/* ── Header ── */}
      <div className="srg-header">
        <div>
          {isLoading ? (
            <>
              <Sk className="sk-title" />
              <Sk className="sk-sub" />
            </>
          ) : (
            <>
              <p className="srg-title">Student Report — Year Overview</p>
              <p className="srg-sub">
                New · Passed · Disabled &nbsp;|&nbsp; Click legend to toggle
                series
              </p>
            </>
          )}
        </div>

        {/* ── Controls: From / To / Program ── */}
        <div className="srg-controls">
          {isLoading ? (
            <>
              <Sk className="sk-select" />
              <Sk className="sk-select" />
              <Sk className="sk-select" />
            </>
          ) : (
            <>
              <label htmlFor="srg-from">From</label>
              <select
                id="srg-from"
                className="srg-select"
                value={fromYear ?? ""}
                onChange={handleFromChange}
                disabled={isFetching}
              >
                <option value="" disabled>
                  Select
                </option>
                {ALL_YEARS.filter((y) => y < CURRENT_YEAR).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <label htmlFor="srg-to">To</label>
              <select
                id="srg-to"
                className="srg-select"
                value={toYear ?? ""}
                onChange={handleToChange}
                disabled={fromYear === null || isFetching}
              >
                <option value="" disabled>
                  Select
                </option>
                {toYearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* ── Program dropdown ── */}
              <label htmlFor="srg-program">Program</label>
              <select
                id="srg-program"
                className="srg-select"
                value={queryParams.programId ?? ""}
                onChange={handleProgramChange}
                disabled={isFetching}
              >
                <option value="">All Programs</option>
                {programData?.data.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.code}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* ── Legend — centered ── */}
      <div className="srg-legend" style={{ justifyContent: "center" }}>
        {isLoading
          ? SERIES.map((s) => <Sk key={s.key} className="sk-legend" />)
          : SERIES.map((s) => (
              <button
                key={s.key}
                className={`srg-legend-item${visible[s.key] ? "" : " hidden"}`}
                onClick={() =>
                  setVisible((prev) => ({ ...prev, [s.key]: !prev[s.key] }))
                }
              >
                <span
                  className="srg-legend-dot"
                  style={{ background: s.color }}
                />
                {s.label}
              </button>
            ))}
      </div>

      {/* ── Chart ── */}
      <div className="srg-chart-wrap" ref={wrapRef}>
        {isLoading ? (
          <Sk className="sk-chart" />
        ) : isFetching ? (
          <div
            style={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: 14,
            }}
          >
            Loading chart...
          </div>
        ) : !hasData || isError ? (
          <div className="srg-empty">
            <div className="srg-empty-emoji">📉</div>
            <svg
              width="260"
              height="48"
              viewBox="0 0 260 48"
              style={{ margin: "6px 0" }}
            >
              <path className="fl-base" d="M0 34 H80" />
              <path
                className="fl-blip"
                d="M80 34 L94 34 L103 8 L112 48 L121 28 L130 34 H260"
              />
            </svg>
            <p className="srg-empty-title">No Data Found</p>
            <p className="srg-empty-sub">
              No student records exist for this year range.
              <br />
              Try selecting a different range.
            </p>
          </div>
        ) : (
          <svg ref={svgRef} />
        )}
      </div>

      <div className="srg-tooltip" ref={tooltipRef} />
    </div>
  );
};

export default StudentReportGraph;
