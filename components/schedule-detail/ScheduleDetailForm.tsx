"use client";
import React, { useState } from "react";

const trainers = ["HuyLT7", "HieuHT24", "LongNQ29", "PhuongDT98"]; // Danh sách các Trainer

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    subject: "Java",
    session: "Lesson2",
    trainer: "HuyLT7",
    date: "2024-12-09", // Định dạng ngày (YYYY-MM-DD) cho input type="date"
  });

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
    alert("Đã hủy thao tác");
  };

  return (
    <div className="min-h-screen flex-1 ml-[228px] bg-[#EFF5EB] p-8 py-10">
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
                name="subject"
                value={formData.subject}
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
                name="session"
                value={formData.session}
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
                {trainers.map((trainer, index) => (
                  <option key={index} value={trainer}>
                    {trainer}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
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
