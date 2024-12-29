"use client";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FeedbackData {
  curriculumRating: number;
  recommendCourse: boolean;
  satisfiedCurriculum: boolean;
  trainerTeachFull: boolean;
  trainerOnTime: boolean;
  comments: string;
}

type Props = {
  userId: any;
  classId: any;
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

const NewFeedbackForm = ({ userId, classId }: Props) => {
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${classId}`,
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

  console.log("userId", userId);
  console.log("classId", classId);
  console.log("selectedSubject", selectedSubject);
  const [feedback, setFeedback] = useState<any>({
    listAnswers: [
      {
        questionId: 1,
        answer: 1,
      },
      {
        questionId: 2,
        answer: true,
      },
      {
        questionId: 3,
        answer: "",
      },
      {
        questionId: 4,
        answer: 1,
      },
      {
        questionId: 5,
        answer: true,
      },
    ],
    description: "",
  });

  const handleSubmit = async () => {
    console.log("Submitted feedback:", feedback);
    try {
      const res = await fetch(`${BASE_API_URL}/feedback-management/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getJwtToken()}`,
        },
        body: JSON.stringify({
          userId,
          classId,
          subjectId: selectedSubject,
          listAnswers: feedback.listAnswers,
          // listAnswers: [
          //   {
          //     questionId: 1,
          //     answer: 1,
          //   },
          //   {
          //     questionId: 2,
          //     answer: true,
          //   },
          //   {
          //     questionId: 3,
          //     answer: "ssss",
          //   },
          //   {
          //     questionId: 4,
          //     answer: 1,
          //   },
          //   {
          //     questionId: 5,
          //     answer: false,
          //   },
          // ],
          description: feedback.description,
          feedbackDate: new Date().toISOString(),
          openTime: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      console.log("Feedback response:", data);
      // alert("Feedback submitted successfully!");
      toast.success("Feedback submitted successfully", {
        icon: "✅",
      });
    } catch (error) {
      // console.error(error);
      toast.error("Error submitting feedback");
    }
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  const renderStar = (num: number, question: any) => {
    return (
      <svg
        key={num}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 cursor-pointer ${
          num <= feedback.listAnswers[question.id - 1].answer
            ? "text-[#FFC107]"
            : "text-gray-300"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => {
          feedback.listAnswers[question.id - 1].answer = num;
          setFeedback({ ...feedback });
        }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  };

  const renderInputByType = (question: any) => {
    switch (question.type) {
      case "rating":
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => renderStar(num, question))}
          </div>
        );
      case "yes-no":
        return (
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#6FBC44] w-4 h-4"
                checked={feedback.listAnswers[question.id - 1].answer !== false}
                onChange={() => {
                  feedback.listAnswers[question.id - 1].answer = true;
                  setFeedback({ ...feedback });
                }}
              />
              <span className="ml-2 text-sm">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-[#6FBC44] w-4 h-4"
                checked={feedback.listAnswers[question.id - 1].answer === false}
                onChange={() => {
                  feedback.listAnswers[question.id - 1].answer = false;
                  setFeedback({ ...feedback });
                }}
              />
              <span className="ml-2 text-sm">No</span>
            </label>
          </div>
        );
      case "text":
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FBC44] text-sm"
            value={feedback.listAnswers[question.id - 1].answer}
            onChange={(e) => {
              feedback.listAnswers[question.id - 1].answer = e.target.value;
              setFeedback({ ...feedback });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-[#EFF5EB] overflow-auto">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-4xl font-bold">Feedback</h2>
      </div>

      {/* Content */}
      <div className="p-4 w-[95%] mx-auto">
        {" "}
        {/* Changed max-w-4xl to w-[95%] */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Feedback Information */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Feedback Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <span className="font-bold">Class:</span>
                <span>Java01</span>
              </div>
              {/* <div className="flex gap-2">
                <span className="font-bold">Trainer:</span>
                <span>HuyLT</span>
              </div> */}
              <div className="flex gap-2">
                <span className="font-bold">Subject Name:</span>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
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
          </div>

          {listQuestion.map((question) => (
            <div key={question.id} className="mb-6">
              <p className="mb-2">{question.question}</p>
              {renderInputByType(question)}
            </div>
          ))}

          {/* Comments Section */}
          <div className="mb-6">
            <p className="mb-2 font-bold">Your comments about the course</p>
            <textarea
              className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FBC44] text-sm"
              value={feedback.description}
              onChange={(e) =>
                setFeedback({ ...feedback, description: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#6FBC44] text-white rounded-lg hover:bg-[#5da639] text-sm"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFeedbackForm;
