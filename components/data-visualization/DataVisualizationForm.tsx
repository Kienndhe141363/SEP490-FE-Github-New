"use client";
import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AttendanceOverview from "./AttendanceOverview";
import PassRate from "./PassRate";
import Progress from "./Progress";
import Performance from "./Performance";
import AttendanceOverview2 from "../attendance-overview2/AttendanceOverview2Form";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataVisualizationFormProps {
  id?: any;
}

const DataVisualizationForm = ({ id }: DataVisualizationFormProps) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {/* Class Performance Overview */}
        <Performance id={id} />

        {/* Study Progress Overview */}
        <Progress id={id} />

        {/* Pass Rate Overview */}
        <PassRate id={id} />
      </div>
      <AttendanceOverview id={id} />
    </>
  );
};

export default DataVisualizationForm;
