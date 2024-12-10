"use client";
import React, { useEffect } from "react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  UserCircle,
  BookCheck,
} from "lucide-react";
import { BASE_API_URL } from "@/config/constant";
import axios from "axios";
import { getJwtToken } from "@/lib/utils";

interface FeedbackDetailData {
  class: string;
  trainer: string;
  subjectName: string;
  duration: string;
  curriculumRating: number;
  recommendCourse: boolean;
  satisfiedCurriculum: boolean;
  trainerTeachFull: boolean;
  trainerOnTime: boolean;
  description: string;
}

type Props = {
  id: any;
};

const listQuestion = [
  {
    id: 1,
    question: "How would you rate this course?",
    type: "rating",
  },
  {
    id: 2,
    question: "Would you recommend this course to others?",
    type: "yes-no",
  },
  {
    id: 3,
    question: "Please provide additional comments",
    type: "text",
  },
  {
    id: 4,
    question: "How satisfied are you with the teacher?",
    type: "rating",
  },
  {
    id: 5,
    question: "Was the course material clear?",
    type: "yes-no",
  },
];

const FeedbackDetailForm = ({ id }: Props) => {
  console.log("id", id);

  const [data, setData] = React.useState<any>({});

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/feedback-management/detail`,
        {
          feedBackId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      setData(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("data", data);

  const renderInputByType = (item: any) => {
    switch (item.type) {
      case "rating":
        const value = data?.questionAnswerForm?.find(
          (q: any) => q?.questions?.questionId === item.id
        )?.answer;
        // value : 1.0, 2.0, 3.0, 4.0, 5.0
        const numberValue = parseInt(value);
        console.log("number", numberValue);
        return (
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((number) => (
              <label
                key={number}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  className="form-radio text-[#6FBC44]"
                  checked={numberValue === number}
                  readOnly
                />
                <span className="ml-2">{number}</span>
              </label>
            ))}
          </div>
        );
      case "yes-no":
        return (
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#6FBC44]"
                checked={
                  data?.questionAnswerForm?.find(
                    (q: any) => q?.questions?.questionId === item.id
                  )?.answer === "true"
                }
                readOnly
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#6FBC44]"
                checked={
                  data?.questionAnswerForm?.find(
                    (q: any) => q?.questions?.questionId === item.id
                  )?.answer === "false"
                }
                readOnly
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        );
      case "text":
        return (
          <div className="w-full">
            <textarea
              className="w-full p-2 border rounded-lg"
              value={
                data?.questionAnswerForm?.find(
                  (q: any) => q?.questions?.questionId === item.id
                )?.answer
              }
              readOnly
            />
          </div>
        );
      default:
        return null;
    }
  };

  console.log("data", data);
  const getAnswer = (questionId: number) => {
    console.log("questionAnswerForm", data?.questionAnswerForm);
    const question = data?.questionAnswerForm?.find(
      (item: any) => item?.questions?.questionId === questionId
    );
    console.log("question", question);
    return question?.answer === "false";
  };

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-[#EFF5EB]">
      {/* Sidebar */}
      <div className="w-[228px] bg-[#6FBC44] fixed h-screen">
        <div className="p-6">
          <img
            src="/assets/images/fpt-logo.png"
            alt="FPT Logo"
            width={150}
            height={50}
            className="mb-6"
          />
        </div>

        <nav className="text-white">
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <Home className="w-5 h-5 mr-3" />
            <span className="font-bold">Home</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <Users className="w-5 h-5 mr-3" />
            <span className="font-bold">User Management</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <BookOpen className="w-5 h-5 mr-3" />
            <span className="font-bold">Curriculum Management</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <BookCheck className="w-5 h-5 mr-3" />
            <span className="font-bold">Class Management</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 mt-40 hover:bg-[#5da639]"
          >
            <Settings className="w-5 h-5 mr-3" />
            <span className="font-bold">Setting</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <UserCircle className="w-5 h-5 mr-3" />
            <span className="font-bold">My Account</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-bold">Sign out</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[228px] bg-[#EFF5EB] h-screen overflow-auto">
        {/* Header */}
        <div className="p-6 bg-white">
          <h2 className="text-4xl font-bold">Feedback Detail</h2>
        </div>

        {/* Content */}
        <div className="p-4 w-[95%] mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Feedback Detail Section */}
            <h3 className="text-2xl font-bold mb-6">Feedback Detail</h3>

            <div className="grid grid-cols-2 gap-y-4 mb-8">
              <div className="flex gap-2">
                <span className="font-bold">Trainee Name:</span>
                <span>{data.traineeName}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Trainer Name:</span>
                <span>{data.trainerName}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Subject Name:</span>
                <span>{data.subjectName}</span>
              </div>
              {/* <div className="flex gap-2">
                <span className="font-bold">Duration:</span>
                <span>
                  {data.openDate}-{data.endDate}
                </span>
              </div> */}
            </div>
            {/* <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6"> */}
            {listQuestion.map((item) => (
              <div key={item.id} className="mb-6">
                <p className="mb-2">{item.question}</p>
                {/* <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44]"
                        checked={!getAnswer(item.id)}
                        readOnly
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44]"
                        checked={getAnswer(item.id)}
                        readOnly
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div> */}
                {renderInputByType(item)}
              </div>
            ))}
            {/* </div> */}

            {/* Description Section */}
            <div>
              <p className="font-bold mb-2">Description</p>
              <div className="w-full min-h-[200px] p-4 border rounded-lg bg-gray-50">
                {data.description || "No description provided."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailForm;
