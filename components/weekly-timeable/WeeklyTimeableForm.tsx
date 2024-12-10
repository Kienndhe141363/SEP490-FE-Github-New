"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
type WeeklyTimetableFormProps = {
  id: any;
  listTrainee: any;
};

const WeeklyTimetableForm = ({ id, listTrainee }: WeeklyTimetableFormProps) => {
  const router = useRouter();
  console.log(id);
  console.log(listTrainee);
  const account = listTrainee[0]?.account;
  console.log(account);

  const [data, setData] = useState<any>(null);

  const getSlot = (date: string) => {
    const time = new Date(date).getHours();
    if (time >= 7 && time < 11) {
      return "slot1";
    } else {
      return "slot2";
    }
  };

  const getDayOfWeek = (date: string) => {
    const day = new Date(date).getDay();
    return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][day];
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/attendance-management/attendance-by-user`,
        {
          classId: id,
          userName: account,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );

      const listSubjectTimeTable =
        response?.data?.data?.listSubjectTimeTable || [];

      // Tạo mảng mới với subjectName cho từng phần tử
      // Kiểm tra dữ liệu đầu vào và xử lý với bảo vệ
      const formattedArray = (listSubjectTimeTable || []).flatMap((item: any) =>
        (item.listWeeklyAttendances || []).map((attendance: any) => ({
          ...attendance,
          subjectName: item.subjectName, // Thêm subjectName vào mỗi phần tử attendance
          slot: getSlot(attendance.startDate),
          dayOfWeek: getDayOfWeek(attendance.startDate),
        }))
      );

      setData(formattedArray || []);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(data);

  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, []);

  const handleSave = () => {
    // Logic để lưu thông tin
    console.log("Thông tin đã được lưu.");
  };

  const handleCancel = () => {
    router.push("/feature/view-class-list"); // Quay về trang danh sách lớp
  };

  const [selectedWeek, setSelectedWeek] = useState("2/12-8/12");

  const timeSlots = [
    { id: 1, time: "9h30-11h00" },
    { id: 2, time: "13h00-16h00" },
  ];

  const days = ["Week", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Generate weeks for the entire year
  const weeks = Array.from({ length: 52 }, (_, index) => {
    const startDay = new Date(2024, 0, 1 + index * 7);
    const endDay = new Date(startDay);
    endDay.setDate(endDay.getDate() + 6);
    return `${startDay.getDate()}/${
      startDay.getMonth() + 1
    }-${endDay.getDate()}/${endDay.getMonth() + 1}`;
  });

  const dataDisplayByWeek = data?.filter((item: any) => {
    const [startWeek, endWeek] = selectedWeek.split("-");
    const [startDay, startMonth] = startWeek.split("/");
    const [endDay, endMonth] = endWeek.split("/");
    // Sử dụng Date.UTC để tạo ngày với múi giờ UTC
    const startDate = new Date(
      Date.UTC(2024, parseInt(startMonth) - 1, parseInt(startDay))
    );
    const endDate = new Date(
      Date.UTC(2024, parseInt(endMonth) - 1, parseInt(endDay))
    );

    const date = new Date(item.startDate);
    return date >= startDate && date <= endDate;
  });
  console.log(dataDisplayByWeek);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="p-6 w-full">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-semibold">Weekly Timetable</h1>
            {/* <div className="flex items-center gap-2">
              <span>Class:</span>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue>{selectedClass}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HN24_FR_KS_04">HN24_FR_KS_04</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <Card className="shadow-md">
            <CardContent className="p-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 bg-[#4CAF50] text-black border">
                      <div className="flex items-center">
                        <span className="mr-2">Week:</span>
                        <Select
                          value={selectedWeek}
                          onValueChange={setSelectedWeek}
                        >
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
                    </th>
                    {days.slice(1).map((day) => (
                      <th
                        key={day}
                        className="p-3 bg-[#4CAF50] text-white border"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td className="p-3 border bg-[#F5F5F5]">
                        <div className="text-sm">{slot.time}</div>
                      </td>
                      {/* Columns for each day */}
                      {/* {days.slice(1).map((day) => (
                        <td key={`${slot.id}-${day}`} className="p-3 border">
                          <Select
                            defaultValue={slot.id === "slot1" ? "JAVA" : "KOR1"}
                          >
                            <SelectTrigger className="w-full mb-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JAVA">JAVA</SelectItem>
                              <SelectItem value="KOR1">KOR1</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="mb-2">
                            <div className="text-xs text-green-600">ROOM:</div>
                            <Select defaultValue="PASSION">
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PASSION">PASSION</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <div className="text-xs text-green-600">
                              Trainer:
                            </div>
                            <Select
                              defaultValue={
                                slot.id === "slot1" ? "LongNQ3" : "AnhBH17"
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LongNQ3">LongNQ3</SelectItem>
                                <SelectItem value="AnhBH17">AnhBH17</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      ))} */}
                      {days.slice(1).map((day) => {
                        const dataBySlot = dataDisplayByWeek?.filter(
                          (item: any) => item.slot === `slot${slot.id}`
                        );
                        const dataByDay = dataBySlot?.filter(
                          (item: any) => item.dayOfWeek === day
                        );
                        return (
                          <td key={`${slot.id}-${day}`} className="p-3 border">
                            {dataByDay?.map((item: any) => (
                              <div key={item.id} className="mb-2">
                                <div className="text-lg text-green-600">
                                  {item.subjectName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span>Location: </span>
                                  {item.location}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span>Trainer: </span>
                                  {item.trainer}
                                </div>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-[#4CAF50] text-white px-8 py-2 rounded"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-200 px-8 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableForm;
