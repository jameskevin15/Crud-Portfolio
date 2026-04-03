/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllData } from "@/_actions/crudActions";
import Form from "@/components/Form";
import FormDataViewer from "@/components/FormDataViewer";

export default function Home() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [search, setSearch] = useState("");

  const createSearchFilter = (query: string) => {
    if (!query) return {};
    
    return {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    };
  };

  const fetchData = useCallback(async (searchQuery = "") => {
    try {
      const result = await getAllData({
        filter: createSearchFilter(searchQuery),
        options: {},
      });
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  // Fetch data when component mounts or search changes
  useEffect(() => {
    fetchData(search);
  }, [search, fetchData]);

  // This will be called after successful form submission
  const handleSubmitSuccess = () => {
    fetchData(search); // Refresh the data with current search
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  return (
    <div className="p-5 m-5">
      <h1 className="text-center font-bold text-2xl mb-8">Basic CRUD Form</h1>
      <Form onSubmitSuccess={handleSubmitSuccess} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Entries</h2>
        <FormDataViewer 
          initialData={data} 
          search={search} 
          onSearchChange={handleSearchChange} 
        />
      </div>
    </div>
  );
}
