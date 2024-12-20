import { BASE_API_URL_2 } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

type Props = {
  id: any;
};

const PassRate = ({ id }: Props) => {
  const [data, setData] = useState<any>({
    percentagePass: 0,
    percentageFail: 0,
  });

  const fetchPassRate = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL_2}/data-visualization/pass-rate/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPassRate();
  }, [id]);

  const percentNoResultYet = 100 - data.percentagePass - data.percentageFail;
  // Pass Rate Data
  const passRateData = {
    labels: ["Pass", "Not Pass", "No Results Yet"],
    datasets: [
      {
        data: [data.percentagePass, data.percentageFail, percentNoResultYet],
        backgroundColor: ["#0FCA7A", "#FD1414", "#FFD700"],
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
      <div className="h-[200px]">
        <Pie data={passRateData} options={chartOptions} />
      </div>
      <p className="text-center mt-4 text-sm ">
        Chart Title: Pass Rate Overview
      </p>
    </div>
  );
};

export default PassRate;
