import React from "react";
import { FiEdit } from "react-icons/fi";

const scheduleData = [
  {
    id: 1,
    subject: "Java",
    session: "Lesson 1",
    trainer: "HuyLT7",
    date: "6/12/2024",
    status: "Present",
  },
  {
    id: 2,
    subject: "Java",
    session: "Lesson 2",
    trainer: "HuyLT7",
    date: "9/12/2024",
    status: "Future",
  },
  {
    id: 3,
    subject: "Java",
    session: "Lesson 3",
    trainer: "HuyLT7",
    date: "10/12/2024",
    status: "Future",
  },
  {
    id: 4,
    subject: "Java",
    session: "Lesson 4",
    trainer: "HuyLT7",
    date: "11/12/2024",
    status: "Future",
  },
  {
    id: 5,
    subject: "Java",
    session: "Lesson 5",
    trainer: "HuyLT7",
    date: "12/12/2024",
    status: "Future",
  },
  {
    id: 6,
    subject: "Java",
    session: "Lesson 6",
    trainer: "HuyLT7",
    date: "13/12/2024",
    status: "Future",
  },
  {
    id: 7,
    subject: "Java",
    session: "Lesson 7",
    trainer: "HuyLT7",
    date: "16/12/2024",
    status: "Future",
  },
];

const ViewScheduleForm = () => {
  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-8 min-h-screen">
      {/* Wrapper cho tiêu đề và thanh tab */}
      <div className="flex-1 mb-6 ">
        <h2 className="text-4xl font-bold mb-4">Schedule: HN24_FR_KS_04</h2>

        {/* Navigation Tabs */}
        <div className="flex border-b">
          {["Class Info", "Trainee", "Attendance", "Grade", "Schedule"].map(
            (tab, index) => (
              <button
                key={index}
                className={`mr-6 py-2 font-semibold ${
                  tab === "Schedule"
                    ? "border-b-4 border-[#6FBC44] text-[#6FBC44]"
                    : "text-gray-600"
                } hover:text-[#6FBC44]`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table Filters */}
      <div className="flex space-x-4 mb-4">
        <select className="border px-3 py-2 rounded">
          <option value="">Korea</option>
          <option value="Java">Java</option>
        </select>
        <select className="border px-3 py-2 rounded">
          <option value="Present">Present</option>
          <option value="Future">Future</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse border border-gray-300 rounded shadow-md">
  <thead>
    <tr className="bg-[#6FBC44] text-white">
      <th className="px-6 py-3 uppercase tracking-wider border border-gray-300">#</th>
      <th className="px-6 py-3 text-left uppercase tracking-wider border border-gray-300">Subject</th>
      <th className="px-6 py-3 text-left uppercase tracking-wider border border-gray-300">Session</th>
      <th className="px-6 py-3 text-left uppercase tracking-wider border border-gray-300">Trainer</th>
      <th className="px-6 py-3 text-center uppercase tracking-wider border border-gray-300">Date</th>
      <th className="px-6 py-3 text-center uppercase tracking-wider border border-gray-300">Status</th>
      <th className="px-6 py-3 text-center uppercase tracking-wider border border-gray-300">Detail</th>
    </tr>
  </thead>
  <tbody>
    {scheduleData.map((item) => (
      <tr key={item.id} className="border">
        <td className="px-6 py-3 text-center tracking-wider border border-gray-300">{item.id}</td>
        <td className="px-6 py-3 text-left tracking-wider border border-gray-300">{item.subject}</td>
        <td className="px-6 py-3 text-left tracking-wider border border-gray-300">{item.session}</td>
        <td className="px-6 py-3 text-left tracking-wider border border-gray-300">{item.trainer}</td>
        <td className="px-6 py-3 text-center tracking-wider border border-gray-300">{item.date}</td>
        <td
          className={`px-6 py-3 text-center tracking-wider border border-gray-300 ${
            item.status === "Present" ? "text-green-500" : ""
          }`}
        >
          {item.status}
        </td>
        <td className="px-6 py-3 text-center  border border-gray-300">
            <div className="flex justify-center">
          <FiEdit className="w-6 h-6 text-green-600 hover:text-green-800  cursor-pointer" />
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button className="px-3 py-2 rounded bg-gray-200">&lt;</button>
        <span className="px-4 py-2 bg-[#6FBC44] text-white rounded">1</span>
        <button className="px-3 py-2 rounded bg-gray-200">&gt;</button>
      </div>
    </div>
  );
};

export default ViewScheduleForm;
