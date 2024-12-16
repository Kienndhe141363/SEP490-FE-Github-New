import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { formatDate } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  id: any;
  startDate: any;
};

const Schedule = ({ id, startDate }: Props) => {
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

  const getTimeTableBySubject = async (sessionList: any) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/class-management/get-time-table-session`,
        {
          startDate,
          sessions: sessionList,
          slot: 0,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = response.data;
      return res?.data;
    } catch (error) {
      console.error(error);
    }
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

      // Combine all session lists into a single list
      const combinedSessionList = res?.data?.reduce(
        (acc: any[], subject: any) => {
          return acc.concat(subject.sessionsList);
        },
        []
      );

      // Call getTimeTableBySubject once with the combined session list
      const combinedSessions = await getTimeTableBySubject(combinedSessionList);

      // Distribute the returned sessions back to their respective subjects
      let sessionIndex = 0;
      const subjects = res?.data?.map((subject: any, index: number) => {
        const sessionsList = subject.sessionsList.map(
          () => combinedSessions[sessionIndex++]
        );
        return {
          ...subject,
          isExpanded: index === 0,
          sessionsList,
        };
      });

      setSubjects(subjects);
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
        {/* <div className="p-3 border-r border-white">Order</div> */}
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
              {subject?.sessionsList?.map((lesson: any, index: number) => (
                <div key={index} className="grid grid-cols-5 border-t">
                  <div className="p-4 border-r">{index + 1}</div>
                  <div className="p-4 border-r">{lesson.lesson}</div>
                  {/* <div className="p-4 border-r">{lesson.sessionOrder}</div> */}
                  <div className="p-4 border-r">
                    {/* {formatDate(new Date(subject.createdDate), "dd/MM/yyyy")} */}
                    {/* {formatDate(
                      getStartDate(index, subjectIndex),
                      "dd/MM/yyyy"
                    )} */}
                    {formatDate(new Date(lesson.startDate), "dd/MM/yyyy")}
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

export default Schedule;
