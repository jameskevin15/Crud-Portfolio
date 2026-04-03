"use client";

import { useState, useEffect } from "react";
import { deleteData, updateData } from "@/_actions/crudActions";
import Search from "./ui/Search";

const FormDataViewer = ({
  initialData,
  search,
  onSearchChange,
}: {
  initialData: Record<string, any>[];
  search: string;
  onSearchChange: (query: string) => void;
}) => {
  const [data, setData] = useState<Record<string, any>[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({
    _id: "",
    title: "",
    description: "",
  });

  // Auto-refresh data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleEdit = (item: Record<string, any>) => {
    setEditingId(item._id);
    setEditForm({
      _id: item._id,
      title: item.title,
      description: item.description,
    });
  };

  const handleDelete = async (_id: string) => {
    console.log("_id", _id);
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await deleteData(_id);
      // Update the UI optimistically
      setData((prevData) => {
        const newData = prevData.filter((item) => item._id !== _id);
        if (newData.length === prevData.length) {
          console.warn("Item was not found in local state");
        }
        return newData;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      // You might want to show an error message to the user here
      alert("Failed to delete the item. Please try again.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { _id, ...updates } = editForm;
      await updateData(_id, updates);

      // Update the local state with the edited data
      setData((prevData) =>
        prevData.map((item) =>
          item._id === _id ? { ...item, ...updates } : item,
        ),
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };


  if (search && data.length === 0) {
    return (
      <div>
        <Search search={search} onSearchChange={onSearchChange} />
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-medium">
            No results found for &quot;{search}&quot;
          </div>
          <div className="text-gray-500 mt-2">
            Try searching with different keywords
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Search search={search} onSearchChange={onSearchChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gray-100 rounded">
        {data.map((item) => (
          <div
            key={item._id}
            className="rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {editingId === item._id ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-500">ID: {item._id}</h4>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormDataViewer;
