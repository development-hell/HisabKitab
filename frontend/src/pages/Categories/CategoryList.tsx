import React from 'react';
import { Tag } from 'lucide-react';

interface Entity {
  entity_id: string;
  name: string;
  type: string;
}

interface CategoryListProps {
  categories: Entity[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  if (categories.length === 0) {
    return (
      <div className="text-center text-muted mt-10">
        <p>No categories found.</p>
        <p className="text-sm">Click "Add Category" to create one.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <div key={category.entity_id} className="card p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="p-3 rounded-full bg-background border border-border">
            <Tag className="text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
