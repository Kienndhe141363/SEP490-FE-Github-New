"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AttendanceOverview from "./AttendanceOverview";
import PassRate from "./PassRate";
import Progress from "./Progress";
import Performance from "./Performance";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataVisualizationFormProps {
  id?: any;
}

const DataVisualizationForm = ({ id }: DataVisualizationFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <AttendanceOverview id={id} />
      {/* Class Performance Overview */}
      <Performance id={id} />

      {/* Study Progress Overview */}
      <Progress id={id} />

      {/* Pass Rate Overview */}
      <PassRate id={id} />
    </div>
  );
};

export default DataVisualizationForm;
