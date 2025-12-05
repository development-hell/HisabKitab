import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../lib/axios';
import CategoryList from './CategoryList';
import AddCategoryModal from './AddCategoryModal';

interface Entity {
  entity_id: string;
  name: string;
  type: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/entities/');
      const allEntities = response.data;
      const categoryEntities = allEntities.filter((e: Entity) => e.type === 'CATEGORY');
      setCategories(categoryEntities);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryAdded = () => {
    fetchCategories();
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-muted mt-10">Loading categories...</div>
        ) : (
          <CategoryList categories={categories} />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddCategoryModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCategoryAdded}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
