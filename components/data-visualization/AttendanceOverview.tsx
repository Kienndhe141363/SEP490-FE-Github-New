import { BASE_API_URL_2 } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

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

type Props = {
  id: any;
};

const AttendanceOverview = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState<any>();
  const [listSchedules, setListSchedules] = useState<any>([]);
  const [data, setData] = useState<any>([]);

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
    labels: [
      "Present",
      "Late Not Justified",
      "Late In",
      "Early Out Not Justified",
      "Early Out",
      "Absent Not Justified",
      "Absent",
    ],
    datasets: [
      {
        data: data,
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

  const fetchListSchedules = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL_2}/data-visualization/schedule-details/${props.id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res) {
        setListSchedules(res);
        setSelectedDate(res[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL_2}/data-visualization/attendance/${selectedDate?.scheduleDetailId}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res) {
        const { scheduleDetailId, ...rest } = res;
        const newData = Object.values(rest);
        console.log("newData", newData);
        setData(newData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListSchedules();
  }, []);

  useEffect(() => {
    if (selectedDate?.scheduleDetailId) fetchData();
  }, [selectedDate?.scheduleDetailId]);

  console.log("listSchedules", listSchedules);
  console.log("selectedDate", selectedDate);
  console.log("data", data);

  return (
    <div className="bg-white p-4 rounded-lg relative">
      {/* Added date display ABOVE the chart */}
      <div className="flex justify-center items-center mb-2">
        <select
          value={formatDate(new Date(selectedDate?.date))}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-gray-300 rounded-md p-1"
        >
          {listSchedules.map((schedule: any) => (
            <option key={schedule.scheduleDetailId} value={schedule}>
              {formatDate(new Date(schedule.date))}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[200px] mt-4">
        <Pie data={attendanceData} options={chartOptions} />
      </div>

      <p className="text-center mt-2 text-sm">
        Chart Title: Daily Attendance Overview
      </p>
    </div>
  );
};

export default AttendanceOverview;
