import { BASE_API_URL_2 } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

type Props = {
  id: any;
};

const Progress = ({ id }: Props) => {
  const [data, setData] = useState<any>({
    percentageCompleted: 10,
    percentageNotStarted: 100,
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL_2}/data-visualization/curriculum-progress/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Study Progress Data
  const total = data.percentageCompleted + data.percentageNotStarted;
  const progressValue = ((data.percentageCompleted / total) * 100).toFixed(2);
  const progressData = {
    labels: ["Progress"],
    datasets: [
      {
        data: [Number(progressValue), 100 - Number(progressValue)],
        backgroundColor: ["#4CAF50", "#f5f5f5"],
        borderWidth: 0,
        rotation: 225,
      },
    ],
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
    fetchData();
  }, [id]);

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="h-[200px] relative">
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
  );
};

export default Progress;
