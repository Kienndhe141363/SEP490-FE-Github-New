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

const dateTime = {
  January: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  February: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
  ],
  March: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  April: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  May: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  June: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  July: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  August: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  September: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  October: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  November: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ],
  December: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
};

const monthMapping: { [key: string]: number } = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

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

const TakeAttendanceForm = ({ id, listTrainee }: Props) => {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<keyof typeof dateTime>(
    Object.keys(dateTime)[currentMonth] as keyof typeof dateTime
  );
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listAttendance, setListAttendance] = useState([]);
  const [listAttendanceUpdate, setListAttendanceUpdate] = useState([]);

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

  const handleChangeMonth = (month: keyof typeof dateTime) => {
    setSelectedMonth(month);
  };

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

  const findAttendance = (userId: number, dateSlot: any) => {
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const [date, slot] = dateSlot.split("-");
    const dateNumber = parseInt(date, 10); // Convert date to a number
    // const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
    //   (attendance: any) => {
    //     const endDate = new Date(attendance.endDate).getDate();
    //     return endDate === date;
    //   }
    // );

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);
        const endDay = endDate.getDate(); // Get the day of the month
        const endTimeString = attendance.endDate.split("T")[1];

        const endMonth = endDate.getMonth() + 1; // Get the month of the year (0-based index)
        if (endMonth !== monthMapping[selectedMonth]) {
          return false;
        }
        if (endDay !== dateNumber) {
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

  const months = Object.keys(dateTime);
  const listDateOfMonth = dateTime[selectedMonth];
  const attendanceStatusKeys = Object.keys(attendanceStatus);

  const isDisableAttendance = (userId: number, dateSlot: any) => {
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const [date, slot] = dateSlot.split("-");
    const dateNumber = parseInt(date, 10); // Convert date to a number

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);
        const endDay = endDate.getDate(); // Get the day of the month
        const endTimeString = attendance.endDate.split("T")[1];

        const endMonth = endDate.getMonth() + 1; // Get the month of the year (0-based index)
        if (endMonth !== monthMapping[selectedMonth]) {
          return false;
        }
        if (endDay !== dateNumber) {
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

    const [date, slot] = dateSlot.split("-");
    const dateNumber = parseInt(date, 10); // Convert date to a number

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);

        const endDay = endDate.getDate(); // Get the day of the month
        const endTimeString = attendance.endDate.split("T")[1];

        const endMonth = endDate.getMonth() + 1; // Get the month of the year (0-based index)
        if (endMonth !== monthMapping[selectedMonth]) {
          return false;
        }
        if (endDay !== dateNumber) {
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

  useEffect(() => {
    fetchListSubject();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    fetchListAttendance();
  }, [selectedSubject]);

  return (
    <div>
      <Card className="shadow-none border-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">MileStone:</span>
              <Select value={selectedMonth} onValueChange={handleChangeMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue>{selectedMonth}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
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
                  <th className="p-3 text-center w-16 bg-green-500 text-white border border-green-600">
                    #
                  </th>
                  <th
                    className="p-3 text-left bg-green-500 text-white border border-green-600"
                    style={{ width: "300px" }}
                  >
                    Name
                  </th>
                  {listDateOfMonth.map((date) => (
                    <>
                      <th
                        key={`${date}-slot1`}
                        className="p-3 text-center bg-green-500 text-white border border-green-600 min-w-3"
                      >
                        {date}
                        <br />
                        Slot1
                      </th>
                      <th
                        key={`${date}-slot2`}
                        className="p-3 text-center bg-green-500 text-white border border-green-600 min-w-3"
                      >
                        {date}
                        <br />
                        Slot2
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
                    {listDateOfMonth.map((date: any) => (
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
