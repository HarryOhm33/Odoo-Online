import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Modal from "../../../components/common/Modal";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import ActionMenu from "../../../components/common/ActionMenu";
import Badge from "../../../components/common/Badge";
import api from "../../../services/api";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";

const columns = (onEdit, onDelete) => [
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
  {
    key: "actions",
    label: "",
    render: (_, row) => (
      <ActionMenu
        actions={[
          { label: "Edit", icon: <FiEdit2 />, onClick: () => onEdit(row) },
          { label: "Delete", icon: <FiTrash2 />, danger: true, onClick: () => onDelete(row) },
        ]}
      />
    ),
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat]   = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

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

  const handleDeleteClick = (cat) => {
    setCatToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/categories/${catToDelete._id}`);
      toast.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setCatToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category.");
    }
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
        columns={columns(handleOpenEdit, handleDeleteClick)}
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
              className="px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Save
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              placeholder="e.g. Electronics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              rows={2}
              placeholder="Short description..."
            />
          </div>

          {/* Dynamic Custom Fields Section */}
          <div className="border border-white/10 rounded-lg p-3 bg-white/5">
            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Dynamic Custom Fields
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Define custom attribute types for assets under this category (e.g. warranty period).
            </p>

            {/* List of current custom fields */}
            {customFields.length > 0 && (
              <div className="space-y-2 mb-3">
                {customFields.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 text-sm">
                    <span className="font-medium text-white">
                      {field.name} <span className="text-slate-400 font-normal">({field.type})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(idx)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer transition-colors"
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
                className="flex-1 min-w-0 px-2 py-1.5 border border-white/10 bg-black/20 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              />
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
                className="px-2 py-1.5 border border-white/10 bg-black/20 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                <option className="bg-[#0B172A] text-white" value="text">Text</option>
                <option className="bg-[#0B172A] text-white" value="number">Number</option>
                <option className="bg-[#0B172A] text-white" value="boolean">Yes/No</option>
                <option className="bg-[#0B172A] text-white" value="date">Date</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Add Field
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              <option className="bg-[#0B172A] text-white" value="Active">Active</option>
              <option className="bg-[#0B172A] text-white" value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete ${catToDelete?.name}? This action cannot be undone and will fail if assets are assigned to it.`}
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default Categories;
