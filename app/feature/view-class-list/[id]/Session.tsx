import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  id: any;
  startDate: any;
};

const Session = ({ id, startDate }: Props) => {
  const [subjects, setSubjects] = useState<any>([]);

  const toggleSubject = (subjectId: number) => {
    setSubjects(
      subjects.map((subject: any) =>
        subject.subjectId === subjectId
          ? { ...subject, isExpanded: !subject.isExpanded }
          : subject
      )
    );
  };

  const getLastDatePrevSubject = (subjectIndex: number) => {
    if (subjectIndex === 0) {
      return new Date(startDate);
    }

    let lastDate = new Date(startDate);

    for (let i = 0; i < subjectIndex; i++) {
      const subject = subjects[i];
      const lastSession = subject.sessionsList[subject.sessionsList.length - 1];
      lastDate.setDate(lastDate.getDate() + lastSession.sessionOrder * 0.5);
    }

    return lastDate;
  };

  const getStartDate = (index: number, subjectIndex: number) => {
    let date;
    if (subjectIndex === 0) {
      date = new Date(startDate);
    } else {
      date = getLastDatePrevSubject(subjectIndex);
    }

    let daysAdded = 0; // Số ngày hợp lệ (weekday) đã thêm

    while (daysAdded < index) {
      date.setDate(date.getDate() + 0.5); // Tăng ngày lên 1

      // Kiểm tra nếu ngày hiện tại là ngày trong tuần (Monday to Friday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        daysAdded++; // Chỉ tăng đếm nếu là ngày hợp lệ
      }
    }

    return date;
  };

  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setSubjects(
        res?.data?.map((subject: any, index: number) => ({
          ...subject,
          isExpanded: index === 0,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-5 bg-[#6FBC44] text-white rounded-t-lg">
        <div className="p-3 border-r border-white">No</div>
        <div className="p-3 border-r border-white">Lesson</div>
        <div className="p-3 border-r border-white">Order</div>
        <div className="p-3 border-r border-white">Date</div>
        <div className="p-3">Description</div>
      </div>
      {subjects.map((subject: any, subjectIndex: any) => (
        <div key={subject.subjectId} className="border rounded-lg mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSubject(subject.subjectId)}
          >
            <h3 className="font-bold">{subject.subjectName}</h3>
            {subject?.isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>

          {subject?.isExpanded && (
            <>
              {subject?.sessionsList.map((lesson: any, index: number) => (
                <div key={index} className="grid grid-cols-5 border-t">
                  <div className="p-4 border-r">{index + 1}</div>
                  <div className="p-4 border-r">{lesson.lesson}</div>
                  <div className="p-4 border-r">{lesson.sessionOrder}</div>
                  <div className="p-4 border-r">
                    {/* {formatDate(new Date(subject.createdDate), "dd/MM/yyyy")} */}
                    {formatDate(
                      getStartDate(index, subjectIndex),
                      "dd/MM/yyyy"
                    )}
                  </div>
                  <div className="p-4">{lesson.description}</div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Session;
