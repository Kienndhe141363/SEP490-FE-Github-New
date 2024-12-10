"use client";

import AddSubjectForm from "@/components/add-subject/AddSubjectForm";
import { useParams } from "next/navigation";

const SubjectDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <AddSubjectForm id={id} />
    </div>
  );
};

export default SubjectDetail;
