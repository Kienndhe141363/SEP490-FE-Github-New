import { BASE_API_URL, BASE_API_URL_2 } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

type Props = {
  id: any;
};

const Performance = ({ id }: Props) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listSubject, setListSubject] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL_2}/data-visualization/grade-distribution/${id}/${selectedSubject}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res) {
        setData(res?.gradeBuckets);
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
        setSelectedSubject(res?.data[0]?.subjectId);
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

  console.log("data", data);

  const listGradeRange = data?.map((item: any) => item.gradeRange);
  const listGradePercentage = data?.map((item: any) => item.percentage);
  const noGradePercentage =
    100 - listGradePercentage.reduce((a: number, b: number) => a + b, 0);

  // Class Performance Data
  const performanceData = {
    labels: listGradeRange.concat("No Grade"),
    datasets: [
      {
        data: listGradePercentage.concat(noGradePercentage),
        backgroundColor: [
          "#FF6B6B",
          "#FFA500",
          "#00BCD4",
          "#0FCA7A",
          "#FFD700",
          "#FF8C00",
        ],
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

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <span>Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border p-1 rounded"
          >
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
  );
};

export default Performance;
