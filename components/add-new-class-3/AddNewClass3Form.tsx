"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  MinusCircle,
} from "lucide-react";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AddNewClass3FormProps {
  setActiveStep: (step: number) => void;
  data: any;
  setData: any;
}

const AddNewClass3Form = ({
  setActiveStep,
  data,
  setData,
}: AddNewClass3FormProps) => {
  const activeTab = "Trainee";
  console.log(data);
  const [listTrainee, setListTrainee] = useState([]);
  const [listUserIdsRemoved, setListUserIdsRemoved] = useState([]);
  const router = useRouter();

  const fetchListTrainee = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/get-trainee-in-class/${data.classId}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setListTrainee(res?.data);
      setListUserIdsRemoved([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListTrainee();
  }, []);

  const handleCancel = () => {
    // setActiveStep(1);
    router.push("/feature/view-class-list");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      if (listUserIdsRemoved.length > 0) {
        const paramsListUserIdsRemoved =
          listUserIdsRemoved.join("&listUserIds=");

        await axios.post(
          `${BASE_API_URL}/trainee/remove-trainee-by-class?classId=${data.classId}&listUserIds=${paramsListUserIdsRemoved}`,
          {
            classId: data.classId,
            listUserIds: listUserIdsRemoved,
          },
          {
            headers: { Authorization: `Bearer ${getJwtToken()}` },
          }
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActiveStep(3);
    }
  };

  const handleRemoveFromClass = (id: number) => {
    setListTrainee((prev) => prev.filter((trainee) => trainee.userId !== id));
    setListUserIdsRemoved((prev) => [...prev, id]);
  };

  console.log(data);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/trainee/export-template`, {
        headers: { Authorization: `Bearer ${getJwtToken()}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template-trainee.xlsx";
      a.click();
      toast.success("Downloaded template successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImportTrainee = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    // Kiểm tra đuôi file phải là .xlsx
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      !file.name.endsWith(".xlsx")
    ) {
      toast.error("Invalid file format. Please upload an Excel file (.xlsx).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${BASE_API_URL}/trainee/import?classId=${data.classId}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        toast.success("File imported successfully!");
        fetchListTrainee(); // Reload trainee list after successful import
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "import-trainee-error.xlsx";
        a.click();
      }
    } catch (err) {
      toast.error(
        (err as any)?.response?.data?.message || "Failed to import file"
      );
    }
  };

  console.log(listTrainee);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[250px] h-screen flex flex-col"></aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold">Add New Class</h1>
        <div className="mt-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-300">
            {["Class Info", "Trainee", "Session"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${
                  activeTab === tab ? "border-b-2 border-[#6FBC44]" : ""
                }`}
                disabled={activeTab !== tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="mt-6 pb-4">
            {/* Trainee in Class Section */}
            <div className="mb-6 flex justify-between items-center ">
              <h2 className="text-2xl font-semibold">Trainee in class</h2>
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 text-blue-600 hover:underline"
                  onClick={handleDownloadTemplate}
                >
                  Download Template
                </button>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleImportTrainee}
                />
                <label
                  htmlFor="file"
                  className="px-6 py-2 bg-[#6FBC44] text-white rounded cursor-pointer"
                >
                  Import
                </label>
              </div>
            </div>

            {/* In Class Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#6FBC44] text-white">
                    <th className="py-4 px-6 text-left w-[10%] border-r border-gray-300">
                      #
                    </th>
                    <th className="py-4 px-6 text-left w-[25%] border-r border-gray-300">
                      Account
                    </th>
                    <th className="py-4 px-6 text-left w-[35%] border-r border-gray-300">
                      Email
                    </th>
                    <th className="py-4 px-6 text-left w-[20%] border-r border-gray-300">
                      Phone number
                    </th>
                    <th className="py-4 px-6 w-[10%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {listTrainee?.map((trainee, index) => (
                    <tr
                      key={trainee.userId}
                      className={index % 2 === 1 ? "bg-[#EFF5EB]" : ""}
                    >
                      <td className="py-4 px-6 border-r border-gray-300">
                        {trainee.userId}
                      </td>
                      <td className="py-4 px-6 border-r border-gray-300">
                        {trainee.account}
                      </td>
                      <td className="py-4 px-6 border-r border-gray-300">
                        {trainee.email}
                      </td>
                      <td className="py-4 px-6 border-r border-gray-300">
                        {trainee.phone}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleRemoveFromClass(trainee.userId)}
                        >
                          <MinusCircle className="w-6 h-6 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                className="px-8 py-2 bg-[#D5DCD0] text-black rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`px-8 py-2 ${
                  listTrainee?.length === 0 ? "bg-[#b5e09d]" : "bg-[#6FBC44]"
                } text-white rounded`}
                onClick={handleSubmit}
                disabled={listTrainee?.length === 0}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewClass3Form;
