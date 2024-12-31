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

const specialWeek = "30/12-5/1";
const WeeklyTimetableForm = ({ id, listTrainee }: WeeklyTimetableFormProps) => {
  const router = useRouter();
  const account = listTrainee[0]?.account;

  const [data, setData] = useState<any>(null);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWeek, setSelectedWeek] = useState("2/12-8/12");

  const getSlot = (date: string) => {
    // tôi muốn date +6h
    const trueDate = new Date(date).getTime() + 6 * 60 * 60 * 1000;
    const time = new Date(trueDate).getHours();
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
          slot: getSlot(attendance.endDate),
          dayOfWeek: getDayOfWeek(attendance.endDate),
        }))
      );

      setData(formattedArray || []);
    } catch (error) {
      console.error(error);
    }
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
    if (account) {
      fetchData();
    }
    setSelectedWeek(getCurrentWeek());
  }, []);

  const handleSave = () => {
    // Logic để lưu thông tin
    console.log("Thông tin đã được lưu.");
  };

  const handleCancel = () => {
    router.push("/feature/view-class-list"); // Quay về trang danh sách lớp
  };

  const timeSlots = [
    { id: 1, time: "9h30-11h00" },
    { id: 2, time: "13h00-16h00" },
  ];

  const days = ["Week", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

  const dataDisplayByWeek = data?.filter((item: any) => {
    const [startWeek, endWeek] = selectedWeek.split("-");
    const [startDay, startMonth] = startWeek.split("/");
    const [endDay, endMonth] = endWeek.split("/");

    let startDate, endDate;

    if (selectedWeek === specialWeek) {
      // Handle special week case
      startDate = new Date(Date.UTC(2024, 11, 30)); // 30/12/2024
      endDate = new Date(Date.UTC(2025, 0, 5)); // 05/01/2025
    } else {
      // Sử dụng Date.UTC để tạo ngày với múi giờ UTC
      startDate = new Date(
        Date.UTC(selectedYear, parseInt(startMonth) - 1, parseInt(startDay))
      );
      endDate = new Date(
        Date.UTC(selectedYear, parseInt(endMonth) - 1, parseInt(endDay))
      );
    }

    const date = new Date(item.startDate);
    return date >= startDate && date <= endDate;
  });
  console.log(data);
  console.log(dataDisplayByWeek);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="p-6 w-full">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-semibold">Weekly Timetable</h1>
            <div className="flex items-center gap-2">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => {
                  setSelectedYear(value as unknown as number);
                  if (getCurrentWeek() !== specialWeek) {
                    if (value === "2025") {
                      setSelectedWeek(getCurrentWeek());
                    } else {
                      setSelectedWeek(weeks[weeks.length - 1]);
                    }
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

          {/* <div className="flex justify-center gap-4 mt-6">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableForm;
