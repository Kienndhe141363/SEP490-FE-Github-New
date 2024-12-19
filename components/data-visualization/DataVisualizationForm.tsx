"use client";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import AttendanceOverview from "./AttendanceOverview";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataVisualizationFormProps {
  id?: any;
}

const DataVisualizationForm = ({ id }: DataVisualizationFormProps) => {
  const [selectedSubject, setSelectedSubject] = useState("TOTAL");
  const [listSubject, setListSubject] = useState<any[]>([]);

  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res?.data) {
        setListSubject(res?.data);
        setSelectedSubject(res?.data[0]?.subjectId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Class Performance Data
  const performanceData = {
    labels: ["9-10", "8-9", "7-8", "6-7", "<6"],
    datasets: [
      {
        data: [25, 28, 22, 90, 10],
        backgroundColor: [
          "#FF6B6B",
          "#FFA500",
          "#00BCD4",
          "#0FCA7A",
          "#FFD700",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Study Progress Data
  const progressValue = 65;
  const progressData = {
    labels: ["Progress"],
    datasets: [
      {
        data: [progressValue, 100 - progressValue],
        backgroundColor: ["#4CAF50", "#f5f5f5"],
        borderWidth: 0,
        rotation: 225,
      },
    ],
  };

  // Pass Rate Data
  const passRateData = {
    labels: ["Pass", "Not Pass"],
    datasets: [
      {
        data: [91, 9],
        backgroundColor: ["#0FCA7A", "#FD1414"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        align: "center" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
        rtl: false,
        margin: {
          right: 30,
        },
      },
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 30,
      },
    },
  };

  const progressOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: "70%",
    maintainAspectRatio: false,
    rotation: 270,
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  console.log("selectedSubject", selectedSubject);
  console.log("listSubject", listSubject);

  return (
    <div className="grid grid-cols-2 gap-6">
      <AttendanceOverview id={id} />
      {/* Class Performance Overview */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span>Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="TOTAL">TOTAL</option>
              {listSubject.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-[200px]">
          <Pie data={performanceData} options={chartOptions} />
        </div>
        <p className="text-center mt-4 text-sm ">
          Chart Title: Class Performance Overview
        </p>
      </div>

      {/* Study Progress Overview */}
      <div className="bg-white p-4 rounded-lg">
        <div className="h-[200px] relative mt-12">
          <div className="relative h-full">
            <Doughnut data={progressData} options={progressOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{progressValue}%</span>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-sm ">
          Chart Title: Study Progress Overview
        </p>
      </div>

      {/* Pass Rate Overview */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span>Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="TOTAL">TOTAL</option>
              {listSubject.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-[200px]">
          <Pie data={passRateData} options={chartOptions} />
        </div>
        <p className="text-center mt-4 text-sm ">
          Chart Title: Pass Rate Overview
        </p>
      </div>
    </div>
  );
};

export default DataVisualizationForm;
