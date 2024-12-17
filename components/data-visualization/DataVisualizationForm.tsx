"use client";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataVisualizationFormProps {
  id?: any;
}

const DataVisualizationForm = ({ id }: DataVisualizationFormProps) => {
  const [selectedSubject, setSelectedSubject] = useState("TOTAL");
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // Array of dates for navigation (you can modify this as needed)
  const dates = [
    new Date(2024, 0, 15), // Example dates
    new Date(2024, 0, 16),
    new Date(2024, 0, 17),
  ];

  useEffect(() => {
    // Update current date when currentDateIndex changes
    if (currentDateIndex >= 0 && currentDateIndex < dates.length) {
      setCurrentDate(dates[currentDateIndex]);
    }
  }, [currentDateIndex]);

  // Format date function
  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[date.getDay()];
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
    return `${day}, ${formattedDate}`;
  };

  // Daily Attendance Data
  const attendanceData = {
    labels: ["A", "An", "P", "L", "Ln", "E", "En"],
    datasets: [
      {
        data: [0, 0, 100, 0, 0, 0, 0],
        backgroundColor: [
          "#F7A23B",
          "#FD1414",
          "#0FCA7A",
          "#FFFF00",
          "#B7FD14",
          "#1456FD",
          "#8B60D0",
        ],
        borderWidth: 0,
      },
    ],
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

  const doughnutOptions = {
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    cutout: "70%",
    maintainAspectRatio: false,
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

  const handlePrevious = () => {
    setCurrentDateIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentDateIndex((prev) => (prev < dates.length - 1 ? prev + 1 : prev));
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  console.log("selectedSubject", selectedSubject);
  console.log("listSubject", listSubject);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg relative">
        {/* Added date display ABOVE the chart */}
        <div className="flex justify-center items-center mb-2">
          <button
            onClick={handlePrevious}
            disabled={currentDateIndex === 0}
            className="mr-4 text-xl font-bold hover:text-gray-600 disabled:opacity-50"
          >
            &#60;
          </button>
          <p className="text-sm font-semibold">{formatDate(currentDate)}</p>
          <button
            onClick={handleNext}
            disabled={currentDateIndex === dates.length - 1}
            className="ml-4 text-xl font-bold hover:text-gray-600 disabled:opacity-50"
          >
            &#62;
          </button>
        </div>

        <div className="h-[200px] mt-4">
          <Pie data={attendanceData} options={chartOptions} />
        </div>

        <p className="text-center mt-2 text-sm">
          Chart Title: Daily Attendance Overview
        </p>
      </div>

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
