import { useState } from "react";
import { Plus, Edit, Trash2, X, Save, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore, MenuItem } from "../../store";

export function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Get all unique categories from menu items
  const allCategories = Array.from(new Set(menuItems.map((item) => item.category)));
  const categories = ["All", ...allCategories];

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    isVeg: true,
    popular: false,
  });

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCategory = formData.category?.trim() || "";
    
    if (editingItem) {
      updateMenuItem(editingItem.id, { ...formData, category: cleanCategory });
    } else {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: formData.name || "",
        description: formData.description || "",
        price: formData.price || 0,
        category: cleanCategory,
        image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
        isVeg: formData.isVeg ?? true,
        popular: formData.popular ?? false,
      };
      addMenuItem(newItem);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      isVeg: true,
      popular: false,
    });
    setEditingItem(null);
    setIsEditing(false);
    setIsAddingNewCategory(false);
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsEditing(true);
    setIsAddingNewCategory(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMenuItem(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-coffee-brown mb-2">Menu Management</h2>
          <p className="text-muted-foreground">
            Manage your menu items, categories, and pricing
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-coffee-brown text-white rounded-xl hover:bg-coffee-brown/90 transition-all shadow-lg"
          >
            <Plus className="size-5" />
            Add New Item
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-coffee-brown">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h3>
              <button onClick={resetForm} className="text-muted-foreground hover:text-coffee-brown">
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-brown mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-coffee-brown mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-coffee-brown mb-2">
                    Category *
                  </label>
                  {isAddingNewCategory ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter new category name"
                        value={formData.category}
                        className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        autoFocus
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewCategory(false);
                          setFormData({ ...formData, category: "" });
                        }}
                        className="text-sm text-coffee-brown hover:underline"
                      >
                        ← Back to select category
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === "__new__") {
                          setIsAddingNewCategory(true);
                          setFormData({ ...formData, category: "" });
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown cursor-pointer"
                      required
                    >
                      <option value="">Select Category</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__new__" className="font-semibold">+ Add New Category</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-coffee-brown mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="size-5 rounded text-coffee-brown"
                  />
                  <span className="text-sm font-medium">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="size-5 rounded text-coffee-brown"
                  />
                  <span className="text-sm font-medium">Mark as Popular</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-coffee-brown text-white rounded-xl hover:bg-coffee-brown/90 transition-all"
                >
                  <Save className="size-5" />
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 glass-strong rounded-xl hover:bg-white/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="glass-strong rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-coffee-brown text-white"
                    : "glass hover:bg-white/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-strong rounded-2xl p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="size-16 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 hover:bg-coffee-brown/10 rounded-lg transition-colors text-coffee-brown"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold text-lg text-coffee-brown mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-coffee-brown">₹{item.price}</span>
                <span className="px-3 py-1 bg-coffee-brown/10 text-coffee-brown rounded-full text-sm font-medium">
                  {item.category}
                </span>
              </div>

              <div className="flex gap-2">
                {item.isVeg && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    VEG
                  </span>
                )}
                {item.popular && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    POPULAR
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No menu items found</p>
        </div>
      )}
    </div>
  );
}
