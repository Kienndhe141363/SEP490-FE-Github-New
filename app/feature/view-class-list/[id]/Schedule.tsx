import ScheduleForm from "@/components/schedule-detail/ScheduleDetailForm";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { formatDate } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

type Props = {
  id: any;
  startDate: any;
};

const Schedule = ({ id, startDate }: Props) => {
  const [subjects, setSubjects] = useState<any>([]);
  const [scheduleSelected, setScheduleSelected] = useState<any>(null);

  const toggleSubject = (subjectId: number) => {
    setSubjects(
      subjects.map((subject: any) =>
        subject.subjectId === subjectId
          ? { ...subject, isExpanded: !subject.isExpanded }
          : subject
      )
    );
  };

  const getStatusByDate = (date: string) => {
    const currentDate = new Date();
    const startDate = new Date(date);

    if (currentDate < startDate) {
      return <td className="p-4 border-r">Future</td>;
    }

    if (currentDate > startDate) {
      return <td className="p-4 border-r text-green-500">Done</td>;
    }

    return <td className="p-4 border-r text-yellow-500">Present</td>;
  };

  const hasEdit = (date: string) => {
    const currentDate = new Date();
    const startDate = new Date(date);

    if (currentDate < startDate) {
      return true;
    }

    if (currentDate > startDate) {
      return false;
    }

    return true;
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
      const combinedSessionList = res?.data?.listSubject?.reduce(
        (acc: any[], subject: any) => {
          return acc.concat(subject.sessionsList);
        },
        []
      );

      // Call getTimeTableBySubject once with the combined session list
      const combinedSessions = await getTimeTableBySubject(combinedSessionList);

      // Distribute the returned sessions back to their respective subjects
      let sessionIndex = 0;
      const subjects = res?.data?.listSubject?.map(
        (subject: any, index: number) => {
          const sessionsList = subject.sessionsList.map(
            () => combinedSessions[sessionIndex++]
          );
          return {
            ...subject,
            isExpanded: index === 0,
            sessionsList,
          };
        }
      );

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
      {scheduleSelected ? (
        <ScheduleForm
          schedule={scheduleSelected}
          setScheduleSelected={setScheduleSelected}
          classId={id}
        />
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full bg-[#6FBC44] text-white rounded-t-lg">
              <th className="p-3 border-r border-white">No</th>
              <th className="p-3 border-r border-white">Lesson</th>
              <th className="p-3 border-r border-white">Trainer</th>
              <th className="p-3 border-r border-white">Date</th>
              <th className="p-3 border-r border-white">Description</th>
              <th className="p-3 border-r border-white">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject: any, subjectIndex: any) => (
              <React.Fragment key={subject.subjectId}>
                <tr
                  className="cursor-pointer"
                  onClick={() => toggleSubject(subject.subjectId)}
                >
                  <td colSpan={6} className="p-4 font-bold flex">
                    {subject.subjectName}{" "}
                    {subject?.isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </td>
                </tr>
                {subject?.isExpanded &&
                  subject?.sessionsList?.map((lesson: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-4 border-r">{index + 1}</td>
                      <td className="p-4 border-r">{lesson.lesson}</td>
                      <td className="p-4 border-r">{lesson.trainer}</td>
                      <td className="p-4 border-r">
                        {formatDate(new Date(lesson.startDate), "dd/MM/yyyy")}
                      </td>
                      <td className="p-4 border-r">{lesson.description}</td>
                      {getStatusByDate(lesson.startDate)}
                      <td className="p-4">
                        {hasEdit(lesson.startDate) && (
                          <FiEdit
                            className="w-6 h-6 text-green-600 hover:text-green-800 cursor-pointer"
                            onClick={() =>
                              setScheduleSelected({
                                ...lesson,
                                subjectName: subject.subjectName,
                                subjectId: subject.subjectId,
                                sessionId: lesson.sessionId,
                                slot: lesson.sessionOrder,
                              })
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Schedule;
