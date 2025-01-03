"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJwtToken } from "@/lib/utils";
import { BASE_API_URL } from "@/config/constant";
import axios from "axios";
import toast from "react-hot-toast";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const attendanceStatus = {
  P: "Present",
  A: "Absent",
  L: "Late",
  An: "Absent with notice",
  Ln: "Late with notice",
};

const getAttendanceColor = (status: string) => {
  switch (status) {
    case "P":
      return "bg-green-100 text-green-800";
    case "A":
      return "bg-red-100 text-red-800";
    case "L":
      return "bg-yellow-100 text-yellow-800";
    case "An":
      return "bg-blue-100 text-blue-800";
    case "Ln":
      return "bg-purple-100 text-purple-800";
    default:
      return "";
  }
};

type Props = {
  id: any;
  listTrainee: any[];
};

const specialWeek = "30/12-5/1";
const TakeAttendanceForm = ({ id, listTrainee }: Props) => {
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listAttendance, setListAttendance] = useState([]);
  const [listAttendanceUpdate, setListAttendanceUpdate] = useState([]);
  const [statistic, setStatistics] = useState([]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWeek, setSelectedWeek] = useState("2/12-8/12");

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

  const fetchListAttendance = async () => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/attendance-management/search-by-class?classId=${id}&subjectId=${selectedSubject}`,
        {
          classId: id, // ID lớp học
          subjectId: selectedSubject, // ID môn học
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      if (res?.data) {
        console.log(res?.data?.data?.listAttendances);
        setListAttendance(res?.data?.data?.listAttendances);
        setListAttendanceUpdate([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log("listAttendanceUpdate", listAttendanceUpdate);
  console.log("listAttendance", listAttendance);

  const handleReset = () => {
    setListAttendanceUpdate([]);
  };

  const handleAddAttendance = async () => {
    try {
      const formatData = listAttendanceUpdate.map((grade: any) => ({
        status: grade.status,
        attendanceNote: "note",
        scheduleDetailId: grade.scheduleDetailId,
        userId: grade.userId,
      }));

      await axios.post(
        `${BASE_API_URL}/attendance-management/attendance-update`,
        {
          data: formatData,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      // alert("Add attendance successfully");
      toast("Add attendance successfully", {
        icon: "✅",
      });
      // TODO: Refetch data
      fetchListAttendance();
    } catch (error) {
      // console.error(error);
      toast.error("Add attendance failed", {
        icon: "❌",
      });
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setListAttendance([]);
  };

  const getDateByDayAndCurrentWeek = (day: string, week: string) => {
    const [startDay, endDay] = week.split("-");

    const [startDayNumber, startMonth] = startDay.split("/").map(Number);
    const [endDayNumber, endMonth] = endDay.split("/").map(Number);

    let start, end;

    if (week === specialWeek) {
      // Handle special week case
      start = new Date(Date.UTC(2024, 11, 30)); // 30/12/2024
      end = new Date(Date.UTC(2025, 0, 5)); // 05/01/2025
    } else {
      start = new Date(selectedYear, startMonth - 1, startDayNumber);
      end = new Date(selectedYear, endMonth - 1, endDayNumber);
    }

    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayIndex = days.indexOf(day);

    while (start.getDay() !== dayIndex) {
      start.setDate(start.getDate() + 1);
    }

    return start.getDate();
  };

  const getRangeTimeByWeek = (week: string) => {
    const [startDay, endDay] = week.split("-");

    const [startDayNumber, startMonth] = startDay.split("/").map(Number);
    const [endDayNumber, endMonth] = endDay.split("/").map(Number);

    let start, end;

    if (week === specialWeek) {
      // Handle special week case
      start = new Date(Date.UTC(2024, 11, 30)); // 30/12/2024
      end = new Date(Date.UTC(2025, 0, 5)); // 05/01/2025
    } else {
      start = new Date(selectedYear, startMonth - 1, startDayNumber);
      end = new Date(selectedYear, endMonth - 1, endDayNumber);
    }

    return [start, end];
  };

  const findAttendance = (userId: number, dateSlot: any) => {
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const [day, slot] = dateSlot.split("-");
    const date = getDateByDayAndCurrentWeek(day, selectedWeek);

    const [start, end] = getRangeTimeByWeek(selectedWeek);

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);
        const endDay = endDate.getDate(); // Get the day of the month
        const endTimeString = attendance.endDate.split("T")[1];

        if (endDate < start || endDate > end) {
          return false;
        }

        if (endDay !== date) {
          return false;
        }

        if (slot === "slot1" && endTimeString.includes("04:30:00")) {
          return true;
        }

        if (slot === "slot2" && endTimeString.includes("10:00:00")) {
          return true;
        }

        return false;
      }
    );

    return (
      listAttendanceUpdate.find(
        (attendance: any) =>
          attendance.userId === userId && attendance.date === dateSlot
      )?.status ||
      attendanceDetail?.status ||
      ""
    );
  };

  const attendanceStatusKeys = Object.keys(attendanceStatus);

  const isDisableAttendance = (userId: number, dateSlot: any) => {
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const [day, slot] = dateSlot.split("-");
    const date = getDateByDayAndCurrentWeek(day, selectedWeek);

    const [start, end] = getRangeTimeByWeek(selectedWeek);

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);
        const endDay = endDate.getDate(); // Get the day of the month
        const endTimeString = attendance.endDate.split("T")[1];

        if (endDate < startToday || endDate > endToday) {
          return false;
        }

        if (endDate < start || endDate > end) {
          return false;
        }

        if (endDay !== date) {
          return false;
        }

        if (slot === "slot1" && endTimeString.includes("04:30:00")) {
          return true;
        }

        if (slot === "slot2" && endTimeString.includes("10:00:00")) {
          return true;
        }

        return false;
      }
    );

    return !attendanceDetail;
  };

  const findScheduleDetailId = (userId: number, dateSlot: any) => {
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const [day, slot] = dateSlot.split("-");
    const date = getDateByDayAndCurrentWeek(day, selectedWeek);

    const [start, end] = getRangeTimeByWeek(selectedWeek);

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);

        const endDay = endDate.getDate(); // Get the day of the month
        const endTimeString = attendance.endDate.split("T")[1];

        if (endDate < start || endDate > end) {
          return false;
        }

        if (endDay !== date) {
          return false;
        }

        if (slot === "slot1" && endTimeString.includes("04:30:00")) {
          return true;
        }

        if (slot === "slot2" && endTimeString.includes("10:00:00")) {
          return true;
        }

        return false;
      }
    );

    return attendanceDetail?.scheduleDetailId;
  };

  const getCurrentWeek = () => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const currentYear = currentDate.getFullYear();

    // Adjust currentDate to the previous Monday
    const startDate = new Date(currentDate);
    startDate.setDate(
      currentDate.getDate() -
        (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1)
    );

    // Calculate the end date (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Handle special week case
    if (startDate.getDate() === 30 && startDate.getMonth() === 11) {
      return specialWeek;
    }

    return `${startDate.getDate()}/${
      startDate.getMonth() + 1
    }-${endDate.getDate()}/${endDate.getMonth() + 1}`;
  };

  useEffect(() => {
    fetchListSubject();
    setSelectedWeek(getCurrentWeek());
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/attendance-management/attendance-report-list`,
        {
          classId: id,
          subjectId: selectedSubject,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      if (response?.data?.data) {
        setStatistics(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedSubject) return;
    fetchListAttendance();
    fetchStatistics();
  }, [selectedSubject]);
  console.log("statistic", statistic);

  const generateWeeks = (year: number) => {
    const weeks = [];
    if (year == 2025) weeks.push(specialWeek);
    let startDay = new Date(year, 0, 1);

    // Adjust startDay to the first Monday of the year
    while (startDay.getDay() !== 1) {
      startDay.setDate(startDay.getDate() + 1);
    }

    for (let i = 0; i < 52; i++) {
      const endDay = new Date(startDay);
      endDay.setDate(endDay.getDate() + 6);
      weeks.push(
        `${startDay.getDate()}/${startDay.getMonth() + 1}-${endDay.getDate()}/${
          endDay.getMonth() + 1
        }`
      );
      startDay.setDate(startDay.getDate() + 7);
    }
    if (year == 2024) weeks.push(specialWeek);
    return weeks;
  };

  const weeks = generateWeeks(selectedYear);

  return (
    <div>
      <Card className="shadow-none border-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">Year:</span>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => {
                  setSelectedYear(value as unknown as number);
                  if (value === "2025") {
                    setSelectedWeek(getCurrentWeek());
                  } else {
                    setSelectedWeek(specialWeek);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue>{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Week:</span>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue>{selectedWeek}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {weeks.map((week, index) => (
                    <SelectItem key={index} value={week}>
                      {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">Subject:</span>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {listSubject?.map((subject: any) => (
                    <SelectItem
                      key={subject.subjectId}
                      value={subject.subjectId}
                    >
                      {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    className="p-3 text-center w-16 bg-green-500 text-white border border-green-600"
                    rowSpan={2}
                  >
                    #
                  </th>
                  <th
                    className="p-3 text-left bg-green-500 text-white border border-green-600"
                    style={{ width: "300px" }}
                    rowSpan={2}
                  >
                    Name
                  </th>
                  {days.map((date) => (
                    <th
                      key={date}
                      colSpan={2}
                      className="p-3 text-center bg-green-500 text-white border border-green-600"
                    >
                      {date}
                    </th>
                  ))}
                </tr>
                <tr>
                  {days.map((date) => (
                    <>
                      <th
                        key={`${date}-slot1`}
                        className="p-3 text-center bg-green-500 text-white border border-green-600 min-w-3"
                      >
                        Slot 1
                      </th>
                      <th
                        key={`${date}-slot2`}
                        className="p-3 text-center bg-green-500 text-white border border-green-600 min-w-3"
                      >
                        Slot 2
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listTrainee.map((trainee, index) => (
                  <tr key={trainee.userId}>
                    <td className="p-3 text-center border">{index + 1}</td>
                    <td className="p-3 border" style={{ whiteSpace: "nowrap" }}>
                      {trainee.fullName}
                    </td>
                    {days.map((date: any) => (
                      <>
                        <td
                          key={`${trainee.userId}-${date}-slot1`}
                          className="p-3 text-center border min-w-3"
                        >
                          <select
                            className={`bg-transparent cursor-pointer outline-none min-w-3 text-center font-medium
                                    ${getAttendanceColor("")}
                                    ${
                                      isDisableAttendance(
                                        trainee.userId,
                                        `${date}-slot1`
                                      ) && "!bg-slate-500"
                                    }
                                    `}
                            value={
                              findAttendance(trainee.userId, `${date}-slot1`) ||
                              ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;

                              const foundIndex = listAttendanceUpdate.findIndex(
                                (item) =>
                                  item.userId === trainee.userId &&
                                  item.date === `${date}-slot1`
                              );
                              if (foundIndex !== -1) {
                                listAttendanceUpdate[foundIndex] = {
                                  userId: trainee.userId,
                                  date: `${date}-slot1`,
                                  status: value,
                                  scheduleDetailId: findScheduleDetailId(
                                    trainee.userId,
                                    `${date}-slot1`
                                  ),
                                };
                                setListAttendanceUpdate([
                                  ...listAttendanceUpdate,
                                ]);
                              } else {
                                setListAttendanceUpdate([
                                  ...listAttendanceUpdate,
                                  {
                                    userId: trainee.userId,
                                    date: `${date}-slot1`,
                                    status: value,
                                    scheduleDetailId: findScheduleDetailId(
                                      trainee.userId,
                                      `${date}-slot1`
                                    ),
                                  },
                                ]);
                              }
                            }}
                            disabled={isDisableAttendance(
                              trainee.userId,
                              `${date}-slot1`
                            )}
                          >
                            <option value="">Select</option>
                            {attendanceStatusKeys.map((status, index) => (
                              <option
                                key={status}
                                value={attendanceStatusKeys[index]}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td
                          key={`${trainee.userId}-${date}-slot2`}
                          className="p-3 text-center border min-w-3"
                        >
                          <select
                            className={`bg-transparent cursor-pointer outline-none min-w-3 text-center font-medium
                                    ${getAttendanceColor("")}
                                    ${
                                      isDisableAttendance(
                                        trainee.userId,
                                        `${date}-slot2`
                                      ) && "!bg-slate-500"
                                    }
                                    `}
                            value={
                              findAttendance(trainee.userId, `${date}-slot2`) ||
                              ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;

                              const foundIndex = listAttendanceUpdate.findIndex(
                                (item) =>
                                  item.userId === trainee.userId &&
                                  item.date === `${date}-slot2`
                              );
                              if (foundIndex !== -1) {
                                listAttendanceUpdate[foundIndex] = {
                                  userId: trainee.userId,
                                  date: `${date}-slot2`,
                                  status: value,
                                  scheduleDetailId: findScheduleDetailId(
                                    trainee.userId,
                                    `${date}-slot2`
                                  ),
                                };
                                setListAttendanceUpdate([
                                  ...listAttendanceUpdate,
                                ]);
                              } else {
                                setListAttendanceUpdate([
                                  ...listAttendanceUpdate,
                                  {
                                    userId: trainee.userId,
                                    date: `${date}-slot2`,
                                    status: value,
                                    scheduleDetailId: findScheduleDetailId(
                                      trainee.userId,
                                      `${date}-slot2`
                                    ),
                                  },
                                ]);
                              }
                            }}
                            disabled={isDisableAttendance(
                              trainee.userId,
                              `${date}-slot2`
                            )}
                          >
                            <option value="">Select</option>
                            {attendanceStatusKeys.map((status, index) => (
                              <option
                                key={status}
                                value={attendanceStatusKeys[index]}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-gray-200 px-6 py-2 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className={`${
                listAttendanceUpdate.length === 0
                  ? "bg-[#bddaaa]"
                  : "bg-[#6FBC44]"
              }  text-white px-6 py-2 rounded`}
              onClick={handleAddAttendance}
              disabled={listAttendanceUpdate.length === 0}
            >
              Save
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeAttendanceForm;
