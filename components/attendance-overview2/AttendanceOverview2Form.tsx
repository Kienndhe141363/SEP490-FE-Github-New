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
} from 'chart.js';

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
      position: 'right' as const,
      align: 'center' as const,
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
};

const AttendanceOverview2 = (props: Props) => {
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [weeklyData, setWeeklyData] = useState<number[]>([]);
    const [monthlyData, setMonthlyData] = useState<number[]>([]);
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const getWeeksInMonth = (month: number, year: number = new Date().getFullYear()) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const weeks = [];
      
      // Get the first Monday
      let currentDate = new Date(firstDay);
      while (currentDate.getDay() !== 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      // Get all weeks
      while (currentDate <= lastDay) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        weeks.push(`${weekStart.getDate()}-${weekEnd.getDate()}`);
        currentDate.setDate(currentDate.getDate() + 7);
      }
  
      return weeks;
    };
  
    const currentWeeks = getWeeksInMonth(selectedMonth);

  // Weekly Attendance Data
  const weeklyAttendanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
        {
            label: 'Present',
            data: Array(12).fill(8),
            backgroundColor: '#F7A23B',
          },
          {
            label: 'Late Not Justified',
            data: Array(12).fill(8),
            backgroundColor: '#FD1414',
          },
          {
            label: 'Late In',
            data: Array(12).fill(5),
            backgroundColor: '#0FCA7A',
          },
          {
            label: 'Early Out Not Justified',
            data: Array(12).fill(3),
            backgroundColor: '#FFFF00',
          },
          {
            label: 'Early Out',
            data: Array(12).fill(10),
            backgroundColor: '#B7FD14',
          },
          {
            label: 'Absent Not Justified',
            data: Array(12).fill(6),
            backgroundColor: '#1456FD',
          },
          {
            label: 'Absent',
            data: Array(12).fill(9),
            backgroundColor: '#8B60D0',
          },
    ],
  };

  // Monthly Attendance Data
  const monthlyAttendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Present',
        data: Array(12).fill(8),
        backgroundColor: '#F7A23B',
      },
      {
        label: 'Late Not Justified',
        data: Array(12).fill(8),
        backgroundColor: '#FD1414',
      },
      {
        label: 'Late In',
        data: Array(12).fill(5),
        backgroundColor: '#0FCA7A',
      },
      {
        label: 'Early Out Not Justified',
        data: Array(12).fill(3),
        backgroundColor: '#FFFF00',
      },
      {
        label: 'Early Out',
        data: Array(12).fill(10),
        backgroundColor: '#B7FD14',
      },
      {
        label: 'Absent Not Justified',
        data: Array(12).fill(6),
        backgroundColor: '#1456FD',
      },
      {
        label: 'Absent',
        data: Array(12).fill(9),
        backgroundColor: '#8B60D0',
      },
    ],
  };

  
  return (
    <div className="flex-1 ml-[228px] bg-white p-8 min-h-screen rounded-lg">
      <div className="flex justify-between mb-4">  
        <div className="flex items-center">     
            <span className="mr-2">Month:</span>
            <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-1"
            >
                {months.map((month, index) => (
                    <option key={month} value={index}>
                        {month}
                    </option>
                ))}
            </select>
        </div>

        <div className="flex items-center">
            <span className="mr-4">Subject:</span>
            <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-300 rounded-md p-1"
            >
            </select>
        </div>
    </div>

      <div className="h-[300px] mb-8">
        
        <Bar data={weeklyAttendanceData} options={chartOptions} />
        <h3 className="text-center mb-4">Weekly Attendance Overview</h3>
      </div>

      <div className="h-[300px]">
        
        <Bar data={monthlyAttendanceData} options={chartOptions} />
        <h3 className="text-center mb-4">Monthly Attendance Overview</h3>
      </div>
    </div>
  );
};

export default AttendanceOverview2;