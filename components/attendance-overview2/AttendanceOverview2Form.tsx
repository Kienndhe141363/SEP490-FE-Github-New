"use client";

import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
      align: "center" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
  maintainAspectRatio: false,
};

type Props = {
  id: any;
  columnWeekData: any[];
  columnMonthData: any[];
};

const AttendanceOverview2 = ({
  id,
  columnWeekData,
  columnMonthData,
}: Props) => {
  console.log(id, "id");
  console.log(columnWeekData, "columnWeekData");
  console.log(columnMonthData, "columnMonthData");

  // Weekly Attendance Data
  const weeklyAttendanceData = {
    labels: columnWeekData.map((item: any) => item.weekLabel),
    datasets: [
      {
        label: "Present",
        data: columnWeekData.map((item: any) => item.percentagePresent),
        backgroundColor: "#F7A23B",
      },
      {
        label: "Late Not Justified",
        data: columnWeekData.map(
          (item: any) => item.percentageLateNotJustified
        ),
        backgroundColor: "#FD1414",
      },
      {
        label: "Late In",
        data: columnWeekData.map((item: any) => item.percentageLateIn),
        backgroundColor: "#0FCA7A",
      },
      {
        label: "Early Out Not Justified",
        data: columnWeekData.map(
          (item: any) => item.percentageEarlyOutNotJustified
        ),
        backgroundColor: "#FFFF00",
      },
      {
        label: "Early Out",
        data: columnWeekData.map((item: any) => item.percentageEarlyOut),
        backgroundColor: "#B7FD14",
      },
      {
        label: "Absent Not Justified",
        data: columnWeekData.map(
          (item: any) => item.percentageAbsentNotJustified
        ),
        backgroundColor: "#1456FD",
      },
      {
        label: "Absent",
        data: columnWeekData.map((item: any) => item.percentageAbsent),
        backgroundColor: "#8B60D0",
      },
    ],
  };

  // Monthly Attendance Data
  const monthlyAttendanceData = {
    labels: columnMonthData.map((item: any) => item.monthLabel),
    datasets: [
      {
        label: "Present",
        data: columnMonthData.map((item: any) => item.percentagePresent),
        backgroundColor: "#F7A23B",
      },
      {
        label: "Late Not Justified",
        data: columnMonthData.map(
          (item: any) => item.percentageLateNotJustified
        ),
        backgroundColor: "#FD1414",
      },
      {
        label: "Late In",
        data: columnMonthData.map((item: any) => item.percentageLateIn),
        backgroundColor: "#0FCA7A",
      },
      {
        label: "Early Out Not Justified",
        data: columnMonthData.map(
          (item: any) => item.percentageEarlyOutNotJustified
        ),
        backgroundColor: "#FFFF00",
      },
      {
        label: "Early Out",
        data: columnMonthData.map((item: any) => item.percentageEarlyOut),
        backgroundColor: "#B7FD14",
      },
      {
        label: "Absent Not Justified",
        data: columnMonthData.map(
          (item: any) => item.percentageAbsentNotJustified
        ),
        backgroundColor: "#1456FD",
      },
      {
        label: "Absent",
        data: columnMonthData.map((item: any) => item.percentageAbsent),
        backgroundColor: "#8B60D0",
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="h-[300px] mb-8">
        <Bar data={weeklyAttendanceData} options={chartOptions} />
        <h3 className="text-center mb-4">Weekly Attendance Overview</h3>
      </div>

      <div className="h-[300px] mb-4">
        <Bar data={monthlyAttendanceData} options={chartOptions} />
        <h3 className="text-center">Monthly Attendance Overview</h3>
      </div>
    </div>
  );
};

export default AttendanceOverview2;
