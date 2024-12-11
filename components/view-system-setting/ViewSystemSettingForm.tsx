"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { FiEdit } from "react-icons/fi";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/config/constant";

const ViewSystemSettingForm: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [settingdata, setSettingdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Start with page 0
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const fetchSettings = async (page = 0) => {
    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_API_URL}/settings/search`,
        {
          keyword: searchTerm,
          page: currentPage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const settings = response?.data.data.dataSource;

      if (Array.isArray(settings)) {
        setSettingdata(settings);
        setTotalPages(response.data.data.pagination?.totalPages || 1); // Tính tổng số trang
      } else {
        console.error("Data received is not an array:", settings);
        setSettingdata([]);
      }
      setError(null);
    } catch (err) {
      setError("Error fetching users");
      console.error("Error fetching users:", err);
      setSettingdata([]);

      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/authen/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are within the max visible range
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // If there are many pages, show a subset with ellipses
      if (currentPage > 2) {
        pageButtons.push(
          <button
            key={0}
            onClick={() => handlePageChange(0)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            1
          </button>
        );
        if (currentPage > 3) {
          pageButtons.push(
            <span key="left-ellipsis" className="px-2">
              ...
            </span>
          );
        }
      }

      // Display pages around the current page
      for (
        let i = Math.max(0, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }

      // Add ellipses and last page if the current page is far from the last page
      if (currentPage < totalPages - 3) {
        if (currentPage < totalPages - 4) {
          pageButtons.push(
            <span key="right-ellipsis" className="px-2">
              ...
            </span>
          );
        }
        pageButtons.push(
          <button
            key={totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageButtons;
  };

  useEffect(() => {
    fetchSettings();
  }, [currentPage]);

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-12 min-h-screen">
      <div className="flex justify-between items-center p-8 border-b">
        <h2 className="text-6xl font-bold">System Setting</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchSettings();
              }
            }}
          />
          <button
            onClick={() => {
              fetchSettings();
            }}
            className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
          >
            Search
          </button>
          <button
            className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
            onClick={() => {
              router.push("/feature/add-setting");
            }}
          >
            + Add Setting
          </button>
        </div>
      </div>

      {loading ? (
        <p> Loading... </p>
      ) : (
        <>
          <table className="w-full mt-10 table-auto border-collapse rounded py-5">
            <thead>
              <tr className="bg-[#6FBC44] text-white">
                <th className="px-6 py-3 uppercase tracking-wider border-r-white">
                  #
                </th>
                <th className="px-6 py-3 text-left  tracking-wider border-r-white">
                  Setting Name
                </th>
                <th className="px-6 py-3 text-left  tracking-wider border-r-white">
                  Setting Group
                </th>
                <th className="px-6 py-3 text-left  tracking-wider border-r-white">
                  Description
                </th>
                <th className="px-6 py-3 text-center  tracking-wider border-r-white">
                  Status
                </th>
                <th className="px-6 py-3 text-center  tracking-wider border-r-white">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {settingdata
                ?.sort((a, b) => a?.id - b?.id)
                .map((settings, index) => {
                  return (
                    <tr key={settings?.id}>
                      <td className="border px-6 py-3 text-center">
                        {settings?.id}
                      </td>
                      <td className="border px-6 py-3 text-left">
                        {settings?.settingName}
                      </td>
                      <td className="border px-6 py-3 text-left">
                        {settings?.settingGroup}
                      </td>
                      <td className="border px-6 py-3 text-left">
                        {settings?.description}
                      </td>
                      <td className="border px-6 py-3 text-center">
                        {settings?.status ? "Active" : "Inactive"}
                      </td>
                      <td className="border px-6 py-3 justify-center-center">
                        <div className="flex justify-center">
                          <Link
                            href={`/feature/view-system-setting/${settings?.id}`}
                          >
                            <FiEdit className="w-6 h-6 text-green-600 hover:text-green-800" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination mt-4 flex align-middle w-[100%] justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              &lt;
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewSystemSettingForm;
