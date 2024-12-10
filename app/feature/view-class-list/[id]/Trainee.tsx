import { BASE_API_URL } from "@/config/constant";
import useRole from "@/hooks/useRole";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { MinusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  id: any;
  listTrainee: any[];
  fetchListTrainee: () => void;
  status: string;
};

const Trainee = ({ id, listTrainee, fetchListTrainee, status }: Props) => {
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleImportTrainee = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${BASE_API_URL}/trainee/import?classId=${id}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      console.log(res);
      fetchListTrainee();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/trainee/export/${id}`, {
        headers: { Authorization: `Bearer ${getJwtToken()}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template-trainee.xlsx";
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  const role = useRole();
  console.log(role);
  const hasAddTraineePermission =
    role === "ROLE_CLASS_ADMIN" ||
    role === "ROLE_ADMIN" ||
    role === "SYSTEM_ADMIN" ||
    role === "ROLE_MANAGER";
  const [listTraineeForAdd, setListTraineeForAdd] = useState<any[]>([]);
  const [searchTraineeAdd, setSearchTraineeAdd] = useState("");

  const fetchListTraineeForAdd = async () => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/user/search`,
        {
          roleId: 5,
          size: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      // const data = await response.json();
      setListTraineeForAdd(res?.data?.data?.dataSource);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(listTraineeForAdd);

  const handleAddTraineeToClass = async ({ classId, account }: any) => {
    try {
      await axios.post(
        `${BASE_API_URL}/trainee/add?classId=${classId}&account=${account}`,
        {
          // classId,
          // account,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      fetchListTrainee();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFromClass = async (traineeId: number) => {
    try {
      await axios.post(
        `${BASE_API_URL}/trainee/remove-trainee-by-class`,
        {
          classId: id,
          listUserIds: [traineeId],
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      fetchListTrainee();
    } catch (error) {
      console.error(error);
    }
  };

  const listTraineeForAddDisplay = listTraineeForAdd?.filter(
    (trainee) =>
      !listTrainee.some((t) => t.userId === trainee.userId) &&
      trainee.account.toLowerCase().includes(searchTraineeAdd.toLowerCase())
  );

  console.log(listTraineeForAddDisplay);

  useEffect(() => {
    fetchListTrainee();
    fetchListTraineeForAdd();
  }, []);

  return (
    <div>
      {hasAddTraineePermission && status && (
        <>
          <input
            type="text"
            placeholder="Search trainee"
            className="w-[150px] p-2 border border-gray-300 rounded-lg mb-4"
            value={searchTraineeAdd}
            onChange={(e) => setSearchTraineeAdd(e.target.value)}
          />

          <div className="w-full h-[250px] overflow-y-scroll mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#6FBC44] text-white">
                  <th className="py-4 px-6 text-left w-[10%] border-r border-gray-300">
                    #
                  </th>
                  <th className="py-4 px-6 text-left  border-r border-gray-300 w-10">
                    Account
                  </th>
                  <th className="py-4 px-6 text-left  border-r border-gray-300">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left border-r border-gray-300">
                    Phone number
                  </th>
                  <th className="py-4 px-6 "></th>
                </tr>
              </thead>
              <tbody>
                {listTraineeForAddDisplay?.map((trainee: any, index) => (
                  <tr
                    key={trainee.userId}
                    className={index % 2 === 1 ? "bg-[#EFF5EB]" : ""}
                  >
                    <td className="py-4 px-6 border-r border-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 border-r border-gray-300 w-10">
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
                        onClick={() =>
                          handleAddTraineeToClass({
                            classId: id,
                            account: trainee.account,
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Trainee in class</h2>
        <div className="flex gap-4">
          {/* <button
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
          </label> */}
          <button
            className="px-4 py-2 bg-[#6FBC44] text-white rounded"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>
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
              {hasAddTraineePermission && status && (
                <th className="py-4 px-6 w-[10%]"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {listTrainee.map((trainee, index) => (
              <tr
                key={trainee.userId}
                className={index % 2 === 1 ? "bg-[#EFF5EB]" : ""}
              >
                <td className="py-4 px-6 border-r border-gray-300">
                  {index + 1}
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
                {hasAddTraineePermission && status && (
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleRemoveFromClass(trainee.userId)}
                    >
                      <MinusCircle className="w-6 h-6 text-red-500" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trainee;
