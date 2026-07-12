// src/pages/admin/categories/Categories.jsx
import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Modal from "../../../components/common/Modal";
import Badge from "../../../components/common/Badge";
import api from "../../../services/api";
import { FiPlus, FiTrash2, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";

const columns = (onEdit) => [
  { key: "name",        label: "Category Name" },
  { key: "description", label: "Description",   render: (v) => v || "—" },
  {
    key: "customFields",
    label: "Custom Attributes",
    render: (v) => v && v.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {v.map((f, idx) => (
          <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
            {f.name} ({f.type})
          </span>
        ))}
      </div>
    ) : "None",
  },
  {
    key: "status",
    label: "Status",
    render: (v) => <Badge label={v || "Active"} color={v === "Active" ? "green" : "slate"} />,
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat]   = useState(null);

  // Form State
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const [status, setStatus]           = useState("Active");

  // Custom Field Form State
  const [fieldName, setFieldName]     = useState("");
  const [fieldType, setFieldType]     = useState("text");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error("Failed to load asset categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setName("");
    setDescription("");
    setCustomFields([]);
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name || "");
    setDescription(cat.description || "");
    setCustomFields(cat.customFields || []);
    setStatus(cat.status || "Active");
    setIsModalOpen(true);
  };

  const handleAddCustomField = () => {
    if (!fieldName.trim()) return;
    setCustomFields((prev) => [...prev, { name: fieldName.trim(), type: fieldType }]);
    setFieldName("");
    setFieldType("text");
  };

  const handleRemoveCustomField = (index) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        customFields,
        status,
      };

      if (editingCat) {
        await api.put(`/api/categories/${editingCat._id}`, payload);
        toast.success("Asset category updated!");
      } else {
        await api.post("/api/categories", payload);
        toast.success("Asset category created!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    }
  };

  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Categories"
        subtitle="Define classification categories and dynamic custom attributes for hardware, furniture, etc."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <FiPlus className="h-4 w-4" />
            New Category
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search categories..."
        className="w-full max-w-sm"
      />

      <Table
        columns={columns(handleOpenEdit)}
        rows={filteredCats}
        loading={loading}
        onRowClick={handleOpenEdit}
        emptyMessage="No asset categories yet. Create your first category."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat ? "Edit Category" : "New Category"}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Save
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Electronics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Short description..."
            />
          </div>

          {/* Dynamic Custom Fields Section */}
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Dynamic Custom Fields
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Define custom attribute types for assets under this category (e.g. warranty period).
            </p>

            {/* List of current custom fields */}
            {customFields.length > 0 && (
              <div className="space-y-2 mb-3">
                {customFields.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
                    <span className="font-medium text-slate-700">
                      {field.name} <span className="text-slate-400 font-normal">({field.type})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add a field */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Field name (e.g. RAM)"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
              />
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
                className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Yes/No</option>
                <option value="date">Date</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add Field
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
