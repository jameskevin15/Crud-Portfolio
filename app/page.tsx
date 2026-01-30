"use client";

import { useState, useEffect } from "react";
import { getAllData } from "@/_actions/crudActions";
import Form from "@/components/Form";
import FormDataViewer from "@/components/FormDataViewer";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getAllData();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // This will be called after successful form submission
  const handleSubmitSuccess = () => {
    fetchData(); // Refresh the data
  };

  return (
    <div className="p-5 m-5">
      <h1 className="text-center font-bold text-2xl mb-8">Basic CRUD Form</h1>
      <Form onSubmitSuccess={handleSubmitSuccess} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Entries</h2>
        <FormDataViewer initialData={data} />
      </div>
    </div>
  );
}