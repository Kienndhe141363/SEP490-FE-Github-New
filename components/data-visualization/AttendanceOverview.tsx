import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import AttendanceOverview2 from "../attendance-overview2/AttendanceOverview2Form";

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

const AttendanceOverview = ({ id }: Props) => {
  const [selectedDate, setSelectedDate] = useState<any>();
  const [listSchedules, setListSchedules] = useState<any>([]);
  const [data, setData] = useState<any>([]);

  const [attendanceTab, setAttendanceTab] = useState(0);
  const listTabs = ["Pie Chart", "Column Chart"];
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listSubject, setListSubject] = useState<any[]>([]);
  const [columnWeekData, setColumnWeekData] = useState<number[]>([]);
  const [columnMonthData, setColumnMonthData] = useState<number[]>([]);

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
        `${BASE_API_URL}/data-visualization/schedule-details/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res) {
        setListSchedules(res);
        setSelectedDate(res[0]?.scheduleDetailId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/data-visualization/attendance/${selectedDate}`,
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
    if (selectedDate) fetchData();
  }, [selectedDate]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/data-visualization/attendance-statistics/week/${id}/${selectedSubject}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res) {
        setColumnWeekData(res);
      }

      const response2 = await fetch(
        `${BASE_API_URL}/data-visualization/attendance-statistics/month/${id}/${selectedSubject}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res2 = await response2.json();
      if (res) {
        setColumnMonthData(res2);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setListSubject(res?.data?.listSubject);
        setSelectedSubject(res?.data?.listSubject[0]?.subjectId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  useEffect(() => {
    if (selectedSubject) fetchPerformanceData();
  }, [selectedSubject]);

  console.log("listSchedules", listSchedules);
  console.log("selectedDate", selectedDate);
  console.log("data", data);

  return (
    <div className="bg-white p-4 rounded-lg relative">
      {/* Added date display ABOVE the chart */}
      <div className="flex justify-center items-center my-2 gap-2">
        {/* chọn loại biểu đồ  */}
        <select
          value={attendanceTab}
          onChange={(e) => setAttendanceTab(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1"
        >
          {listTabs.map((tab, index) => (
            <option key={index} value={index}>
              {tab}
            </option>
          ))}
        </select>
        {attendanceTab === 0 ? (
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            {listSchedules.map((schedule: any) => (
              <option
                key={schedule.scheduleDetailId}
                value={schedule.scheduleDetailId}
              >
                {formatDate(new Date(schedule.date))}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            {listSubject.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        )}
      </div>

      {attendanceTab === 0 ? (
        <div className="h-[200px] mt-4">
          <Pie data={attendanceData} options={chartOptions} />
        </div>
      ) : (
        <AttendanceOverview2
          id={id}
          columnWeekData={columnWeekData}
          columnMonthData={columnMonthData}
        />
      )}
      {attendanceTab === 0 && (
        <p className="text-center mt-2 text-sm">
          Chart Title: Daily Attendance Overview
        </p>
      )}
    </div>
  );
};

export default AttendanceOverview;
