"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import {
  Formik,
  Field,
  FieldArray,
  ErrorMessage,
  useFormikContext,
  Form,
} from "formik";
import * as Yup from "yup";
import { Trash2 } from "lucide-react";
import { FormError } from "../custom/form-error";
import { Tab } from "@headlessui/react";
import toast from "react-hot-toast";
interface Subject {
  code: string;
  weight: number;
  subjectId?: number;
  subjectCode?: string;
}

interface FormValues {
  subjectName: string;
  subjectCode: string;
  descriptions: string;
  schemes: { markName: string; markWeight: number }[];
  lessonList: { lesson: string; sessionOrder: number; description: string }[];
}

const FormSubject = ({
  initialValues,
  id,
  currentTab,
  setCurrentTab,
  hasErrors,
  subjectCodeError,
  handleNext,
  handleImportFile,
  downloadTemplate,
  hasEdit,
}: any) => {
  const { values, setFieldValue, errors, validateForm, setTouched } =
    useFormikContext<FormValues>();

  useEffect(() => {
    if (id && initialValues.subjectCode) {
      setFieldValue("subjectName", initialValues.subjectName);
      setFieldValue("subjectCode", initialValues.subjectCode);
      setFieldValue("descriptions", initialValues.descriptions);
      setFieldValue("schemes", initialValues.schemes);
      setFieldValue("lessonList", initialValues.lessonList);
    }
  }, [initialValues]);

  useEffect(() => {
    if (!id && initialValues.lessonList.length) {
      setFieldValue("lessonList", initialValues.lessonList);
    }
  }, [initialValues.lessonList]);

  return (
    <Tab.Group
      selectedIndex={currentTab}
      onChange={(index) => {
        // Không cho phép chuyển sang tab Session List nếu có lỗi
        if (index === 1 && hasErrors) {
          return; // Không chuyển tab nếu có lỗi
        }
        setCurrentTab(index); // Chuyển tab nếu không có lỗi
      }}
    >
      <Tab.List className="flex space-x-4 mb-8">
        <Tab
          className={({ selected }) =>
            selected
              ? "bg-[#6FBC44] text-white font-bold py-2 px-4 rounded"
              : "bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded"
          }
        >
          General Info
        </Tab>
        <Tab
          disabled={currentTab === 0} // Disable tab Session List khi có lỗi
          className={
            ({ selected }) =>
              selected
                ? "bg-[#6FBC44] text-white font-bold py-2 px-4 rounded"
                : "bg-gray-200 text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed" // Always show as disabled
          }
        >
          Session List
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Form className="grid grid-cols-2 gap-x-16 gap-y-8">
            <div className="col-span-1">
              <label className="block font-bold text-2xl mb-2">
                Subject Name<span className="text-red-500">*</span>
              </label>
              <Field
                name="subjectName"
                placeholder="Input Subject Name"
                className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
              />
              <ErrorMessage
                name="subjectName"
                component="div"
                className="text-red-500"
              />
              <label className="block font-bold text-2xl mb-2 mt-4">
                Description
              </label>
              <Field
                as="textarea"
                name="descriptions"
                placeholder="Input Description"
                className="p-2.5 w-full border border-[#D4CBCB] h-20 rounded"
              />
              <ErrorMessage
                name="descriptions"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block font-bold text-2xl mb-2">
                Subject Code<span className="text-red-500">*</span>
              </label>
              <Field
                name="subjectCode"
                placeholder="Input Subject Code"
                className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
              />
              {subjectCodeError && (
                <div className="text-red-500 mt-1">{subjectCodeError}</div>
              )}
              {/* Hiển thị thông báo lỗi */}
              <label className="block font-bold text-2xl mb-2 mt-4">
                Weight Grade
              </label>
              <FieldArray name="schemes">
                {({ remove, push }) => (
                  <div>
                    <table className="w-full border border-[#D4CBCB] text-center">
                      <thead>
                        <tr className="bg-[#6FBC44] text-white">
                          <th className="px-4 py-3 uppercase tracking-wider">
                            Mark Name
                          </th>
                          <th className="px-4 py-3 uppercase tracking-wider">
                            Mark Weight (%)
                          </th>
                          <th className="px-4 py-3 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {values?.schemes?.map((scheme: any, index: any) => (
                          <tr key={index} className="border-b border-[#D4CBCB]">
                            <td className="px-4 py-2">
                              <Field
                                name={`schemes[${index}].markName`}
                                placeholder="Mark Name"
                                className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
                              />
                              <ErrorMessage
                                name={`schemes[${index}].markName`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Field
                                name={`schemes[${index}].markWeight`}
                                type="number"
                                placeholder="Mark Weight"
                                className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
                              />
                              <ErrorMessage
                                name={`schemes[${index}].markWeight`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-6 h-6" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {values.schemes.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-red-500 text-sm mt-1 text-center"
                            >
                              Add mark name to subject
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      onClick={() => push({ markName: "", markWeight: 0 })}
                      className="mt-4 bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]"
                    >
                      + Add Scheme
                    </button>
                    {errors.schemes && typeof errors.schemes === "string" && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.schemes}
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>
            <div className="flex mt-10 col-span-2 gap-x-6">
              <button
                type="button"
                onClick={() => {
                  if (id) {
                    setCurrentTab(1);
                    return;
                  }
                  handleNext(validateForm, values, setTouched);
                }}
                className="text-white bg-[#6FBC44] font-bold shadow-md hover:shadow-lg hover:bg-[#5da639] py-3 px-6 rounded"
              >
                Next
              </button>
            </div>
          </Form>
        </Tab.Panel>
        <Tab.Panel>
          <Form className="grid grid-cols-1 gap-x-16 gap-y-8">
            <FieldArray name="lessonList">
              {({ remove, push }) => (
                <div>
                  {!id && (
                    <div className="flex justify-end mb-4">
                      <button
                        type="button"
                        className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639] mr-4"
                        onClick={() => downloadTemplate()}
                      >
                        Download Template
                      </button>
                      <label className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639] cursor-pointer">
                        Import
                        <input
                          id="fileInput"
                          name="file"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            setFieldValue("file", e.currentTarget.files?.[0]);
                            handleImportFile(e); // Truyền sự kiện e đúng cách
                          }}
                        />
                      </label>
                    </div>
                  )}
                  <table className="w-full border border-[#D4CBCB] text-center">
                    <thead>
                      <tr className="bg-[#6FBC44] text-white">
                        <th className="px-4 py-3 uppercase tracking-wider">
                          Lesson
                        </th>
                        <th className="px-4 py-3 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-4 py-3 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.lessonList.map((lesson, index) => (
                        <tr key={index} className="border-b border-[#D4CBCB]">
                          <td className="px-4 py-2">
                            <Field
                              name={`lessonList[${index}].lesson`}
                              placeholder="Lesson"
                              className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
                            />
                            <ErrorMessage
                              name={`lessonList[${index}].lesson`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            {/* <Field
                              name={`lessonList[${index}].sessionOrder`}
                              type="number"
                              placeholder="Session Order"
                              className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
                            /> */}
                            <input
                              type="number"
                              name={`lessonList[${index}].sessionOrder`}
                              placeholder="Session Order"
                              className="p-2.5 w-full h-11 rounded"
                              readOnly
                              value={index + 1}
                            />
                            <ErrorMessage
                              name={`lessonList[${index}].sessionOrder`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Field
                              name={`lessonList[${index}].description`}
                              placeholder="Description"
                              className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded"
                            />
                            <ErrorMessage
                              name={`lessonList[${index}].description`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        lesson: "",
                        sessionOrder: 1,
                        description: "",
                      })
                    }
                    className="mt-4 bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]"
                  >
                    + Add Lesson
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="flex mt-10 col-span-2 gap-x-6">
              <button
                type="button"
                onClick={() => setCurrentTab(0)}
                className="text-black bg-[#D5DCD0] font-bold shadow-md hover:shadow-lg hover:bg-gray-400 py-3 px-6 rounded"
              >
                Back
              </button>
              {hasEdit && (
                <button
                  type="submit"
                  className="text-white bg-[#6FBC44] font-bold shadow-md hover:shadow-lg hover:bg-[#5da639] py-3 px-6 rounded mr-10"
                >
                  Submit
                </button>
              )}
            </div>
          </Form>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const AddSubjectForm = ({ id }: { id?: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [subjectCodeError, setSubjectCodeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [hasEdit, setHasEdit] = useState(true);

  const checkHasUpdate = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/subject/check-update/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const isInClass = response.data.data;
      setHasEdit(!isInClass);
    } catch (err) {
      console.error("Error checking has update:", err);
    }
  };

  const [initialValues, setInitialValues] = useState({
    subjectName: "",
    subjectCode: "",
    descriptions: "",
    schemes: [{ markName: "", markWeight: 0 }],
    lessonList: [{ lesson: "", sessionOrder: 1, description: "" }],
  });

  const fetchSubjects = async () => {
    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_API_URL}/subject/search`,
        { page: 0, size: 100, orderBy: "id", sortDirection: "asc" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllSubjects(response.data.data.dataSource || []);
    } catch (err) {
      toast.error("Error fetching subjects.");
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/authen/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const validationSchema = Yup.object({
    subjectName: Yup.string().required("Subject Name is required"),
    subjectCode: Yup.string().required("Subject Code is required"),
    descriptions: Yup.string().optional(),
    schemes: Yup.array()
      .of(
        Yup.object({
          markName: Yup.string().required("Mark Name is required"),
          markWeight: Yup.number()
            .min(0, "Weight must be positive")
            .required("Mark Weight is required"),
        })
      )
      .test("total-weight", "Total mark weight must be 100", (schemes) => {
        const totalWeight = schemes.reduce(
          (sum, scheme) => sum + scheme.markWeight,
          0
        );
        return totalWeight === 100;
      }),
    lessonList: Yup.array().of(
      Yup.object({
        lesson: Yup.string().required("Lesson is required"),
        sessionOrder: Yup.number()
          .min(1, "Session Order must be at least 1")
          .required("Session Order is required"),
        description: Yup.string().optional(),
      })
    ),
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  const handleNext = (validateForm: any, values: any, setTouched: any) => {
    const generalInfoFields = {
      subjectName: values.subjectName,
      subjectCode: values.subjectCode,
      descriptions: values.descriptions,
      schemes: values.schemes,
    };

    const existingSubjectCodes = allSubjects.map(
      (subject) => subject.subjectCode
    );
    if (existingSubjectCodes.includes(values.subjectCode)) {
      setSubjectCodeError("Code exists"); // Gán thông báo lỗi cho mã môn học
      setTouched({
        subjectName: true,
        subjectCode: true,
        descriptions: true,
        schemes: values.schemes.map(() => ({
          markName: true,
          markWeight: true,
        })),
      });
      return; // Dừng lại nếu mã môn học đã tồn tại
    } else {
      setSubjectCodeError(null); // Xóa thông báo lỗi nếu không có lỗi
    }

    validateForm(generalInfoFields).then((errors: any) => {
      if (Object.keys(errors).length === 0) {
        setHasErrors(false); // Không có lỗi, chuyển sang tab Session List
        setCurrentTab(1); // Chuyển sang tab Session List
      } else {
        setHasErrors(true); // Có lỗi, không chuyển tab
        setTouched({
          subjectName: true,
          subjectCode: true,
          descriptions: true,
          schemes: values.schemes.map(() => ({
            markName: true,
            markWeight: true,
          })),
        });
      }
    });
  };

  const handleSubmit = async (values: any) => {
    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }
    try {
      setLoading(true);
      if (id) {
        await axios.put(
          `${BASE_API_URL}/subject/update-subject`,
          {
            subjectName: values.subjectName,
            subjectCode: values.subjectCode,
            descriptions: values.descriptions,
            status: true,
            schemes: values.schemes,
            lessonList: values.lessonList.map((lesson: any, index: number) => ({
              lesson: lesson.lesson,
              sessionOrder: index + 1,
              description: lesson.description,
              sessionId: lesson.sessionId,
            })),
            id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Subject updated successfully.");
        router.push("/feature/view-subject-list");
        return;
      }

      await axios.post(
        `${BASE_API_URL}/subject/add-subject`,
        {
          subjectName: values.subjectName,
          subjectCode: values.subjectCode,
          descriptions: values.descriptions,
          status: true,
          schemes: values.schemes,
          lessonList: values.lessonList.map((lesson: any, index: number) => ({
            lesson: lesson.lesson,
            sessionOrder: index + 1,
            description: lesson.description,
          })),
          documentLink: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Subject added successfully.");
      router.push("/feature/view-subject-list");
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.errorCode === "ERR026"
      ) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error adding subject.");
      }
    } finally {
      setLoading(false);
    }
  };
  const downloadTemplate = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_API_URL}/session-management/export-template`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Quan trọng để tải file
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SessionTemplate.xlsx"); // Đặt tên file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Template downloaded successfully!");
    } catch (err) {
      console.error("Error downloading template:", err);
      toast.error("Failed to download template");
    }
  };
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Kiểm tra xem e.target và e.target.files có hợp lệ không
    if (!e.target || !e.target.files) {
      toast.error("No file selected.");
      return;
    }

    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Kiểm tra định dạng file
    if (!file.name.endsWith(".xlsx")) {
      toast.error("Invalid file format. Please upload an Excel file (.xlsx).");
      return;
    }

    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/session-management/import-session`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const errors = response.data.errors || [];
      if (errors.length) {
        errors.forEach((err: { code: any; message: any }) => {
          switch (err.code) {
            case "ERR045":
              toast.error("ERR045: Lesson can't not be empty.");
              break;
            case "ERR046":
              toast.error("ERR046: Order can't not be empty.");
              break;
            case "ERR047":
              toast.error("ERR047: Order already exist.");
              break;
            case "ERR048":
              toast.error("ERR048: Order number must be at least 1.");
              break;
            case "ERR041":
              toast.error("ERR041: Failed to upload.");
              break;
            case "ERR042":
              toast.error("ERR042: Session expired.");
              break;
            default:
              toast.error(`Unknown error: ${err.message}`);
          }
        });
      } else {
        const newLessonList = response.data.data.validSessions;
        console.log("lessonList", newLessonList);
        setInitialValues((prev) => ({
          ...prev,
          lessonList: [...prev.lessonList, ...newLessonList],
        }));
        toast.success("Import successful!");
      }
    } catch (error) {
      toast.error("Import failed. Please try again.");
    }
  };

  const fetchSubjectDetail = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/subject/detail/${id}`, {
        headers: { Authorization: `Bearer ${getJwtToken()}` },
      });
      const subject = response.data.data;

      const lessonListRes = await axios.get(
        `${BASE_API_URL}/session-management/by-subject/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const lessonList = lessonListRes.data.data;

      console.log("lessonListRes", lessonListRes);
      console.log("subject", subject);
      setInitialValues({
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        descriptions: subject.descriptions,
        schemes: subject.schemes,
        lessonList,
      });
    } catch (err) {
      toast.error("Error fetching subject detail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubjectDetail();
      checkHasUpdate();
    }
  }, [id]);

  console.log("initialValues", initialValues);

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-8 min-h-screen">
      <div className="flex justify-between items-center p-8 border-b">
        <h2 className="text-5xl font-bold">
          {id ? "Subject Detail" : "Add New Subject"}
        </h2>
      </div>
      {error && <FormError message={error} />}
      <div className="bg-white rounded-[40px] p-12 mx-auto mt-10">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <FormSubject
            id={id}
            initialValues={initialValues}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            hasErrors={hasErrors}
            subjectCodeError={subjectCodeError}
            handleNext={handleNext}
            handleImportFile={handleImportFile}
            downloadTemplate={downloadTemplate}
            hasEdit={hasEdit}
          />
        </Formik>
      </div>
    </div>
  );
};
export default AddSubjectForm;
