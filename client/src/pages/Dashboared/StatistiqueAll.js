import React, { useEffect, useRef } from "react";
import { useAppcontext } from "../../context/appContext";
import ReactApexChart from "react-apexcharts";
import "../../assets/wrappers/stats.css";

function StatistiqueAll() {
  const { ageCounts, getAllPatientStats, atcdCounts, genderCounts } =
    useAppcontext();

  const chartRef = useRef(null);

  useEffect(() => {
    getAllPatientStats();
  }, []);

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(ageCounts),
      labels: {
        style: {
          colors: "white",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "white",
        },
      },
      tickAmount: 5,
      min: 0,
      max: 10,
      tickPlacement: "between",
      tickInterval: 3,
    },
  };
  const options2 = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(atcdCounts),
      labels: {
        style: {
          colors: "white",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "white",
        },
      },
      tickAmount: 5,
      min: 0,
      max: 10,
      tickPlacement: "between",
      tickInterval: 3,
    },
  };

  const options3 = {
    chart: {
      type: "pie",
      height: 350,
    },
    labels: Object.keys(genderCounts),
    colors: ["#008FFB", "#f08675"],
    dataLabels: {
      enabled: true,
      style: {
        colors: ["white"],
      },
    },
    theme: {
      mode: "light",
    },
  };

  return (
    <>
      <div className="charts">
        <div className="charts-card">
          <h2 className="chart-title">Repartition par âge</h2>
          <ReactApexChart
            options={options}
            series={[{ data: Object.values(ageCounts) }]}
            type="bar"
            height={350}
            ref={chartRef}
          />
        </div>

        <div className="charts-card">
          <h2 className="chart-title">Repartition par Antecedent</h2>
          <ReactApexChart
            options={options2}
            series={[{ data: Object.values(atcdCounts) }]} // donnes de graph
            type="bar"
            height={350}
            ref={chartRef}
          />
        </div>
        <div className="charts-card">
          <h2 className="chart-title">Repartition par Genre</h2>
          <ReactApexChart
            options={options3}
            series={Object.values(genderCounts)}
            type="pie"
            height={350}
          />
        </div>
      </div>
      <div></div>
    </>
  );
}

export default StatistiqueAll;
