"use client";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ScheduleForm = ({ schedule, setScheduleSelected }: any) => {
  const [listTrainer, setListTrainer] = useState([]);

  const [formData, setFormData] = useState({
    subjectName: "Java",
    lesson: "Lesson2",
    trainer: "HuyLT7",
    date: "2024-12-09", // Định dạng ngày (YYYY-MM-DD) cho input type="date"
    startDate: "2024-12-09",
    endDate: "2024-12-09",
  });
  console.log(listTrainer);
  const fetchListTrainer = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/class-management/get-trainer-for-class`,
        {
          startDate: schedule.startDate,
          endDate: schedule.endDate,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = response.data;
      setListTrainer(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm xử lý khi thay đổi giá trị trong form
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý khi nhấn nút "Save"
  const handleSave = () => {
    alert(`Lịch đã lưu!\n${JSON.stringify(formData, null, 2)}`);
  };

  // Hàm xử lý khi nhấn nút "Cancel"
  const handleCancel = () => {
    setScheduleSelected(null);
    alert("Đã hủy thao tác");
  };

  useEffect(() => {
    if (schedule) {
      setFormData({
        subjectName: schedule.subjectName,
        lesson: schedule.lesson,
        trainer: schedule.trainer,
        date: schedule.date,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
      });
      fetchListTrainer();
    }
  }, [schedule]);

  return (
    <div className="min-h-screen flex-1  bg-[#EFF5EB] p-8 py-10">
      <h2 className="text-4xl font-bold p-4 mb-16">Schedule Detail</h2>
      <div className=" flex items-center justify-center bg-[#EFF5EB] ">
        <div className="bg-white p-8 rounded-md shadow-md md:w-11/12 ">
          <div className="grid grid-cols-2 gap-6 py-10">
            <div>
              <label className="block font-semibold mb-1 text-xl">
                Subject
              </label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                readOnly
                className="border rounded w-full p-2 bg-gray-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">
                Session
              </label>
              <input
                type="text"
                name="lesson"
                value={formData.lesson}
                readOnly
                className="border rounded w-full p-2 bg-gray-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">
                Trainer
              </label>
              <select
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                className="border rounded w-full p-2"
              >
                {listTrainer.map((trainer, index) => (
                  <option key={index} value={trainer.account}>
                    {trainer.account}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">Date</label>
              <input
                type="date"
                name="date"
                value={new Date(formData.startDate).toISOString().split("T")[0]}
                onChange={handleChange}
                className="border rounded w-full p-2"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-black px-6 py-2 rounded w-32 mr-4"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#6FBC44] text-white px-6 py-2 rounded w-32"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
