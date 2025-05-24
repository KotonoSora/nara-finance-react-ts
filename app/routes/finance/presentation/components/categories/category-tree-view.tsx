import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

interface CategoryTreeViewProps {
  categories: Category[];
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string) => void;
  onAddSubcategory?: (parentId: string) => void;
  onEditCategory?: (categoryId: string) => void;
  showControls?: boolean;
}

interface CategoryNodeProps {
  category: Category;
  level?: number;
  onSelect?: (categoryId: string) => void;
  onAddSubcategory?: (parentId: string) => void;
  onEditCategory?: (categoryId: string) => void;
  selectedCategory?: string | null;
  showControls?: boolean;
}

function CategoryNode({
  category,
  level = 0,
  onSelect,
  onAddSubcategory,
  onEditCategory,
  selectedCategory,
  showControls = true,
}: CategoryNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategory === category.id;

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group ${
          isSelected ? "bg-primary/10 border border-primary/20" : ""
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => onSelect?.(category.id)}
      >
        {hasChildren ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        ) : (
          <div className="w-6" />
        )}

        {category.icon && (
          <span
            className="text-lg"
            style={{ color: category.color || undefined }}
          >
            {category.icon}
          </span>
        )}

        <span className="flex-1 text-sm font-medium">{category.name}</span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground capitalize">
            {category.type}
          </span>

          {category.budget_limit && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              ${category.budget_limit}
            </span>
          )}

          {showControls && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubcategory?.(category.id);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory?.(category.id);
                }}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {hasChildren && (
        <Collapsible open={isOpen}>
          <CollapsibleContent className="space-y-1">
            {category.children?.map((child) => (
              <CategoryNode
                key={child.id}
                category={child}
                level={level + 1}
                onSelect={onSelect}
                onAddSubcategory={onAddSubcategory}
                onEditCategory={onEditCategory}
                selectedCategory={selectedCategory}
                showControls={showControls}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export default function CategoryTreeView({
  categories,
  selectedCategory,
  onCategorySelect,
  onAddSubcategory,
  onEditCategory,
  showControls = true,
}: CategoryTreeViewProps) {
  // Filter to only show root categories (no parent_id)
  const rootCategories = categories.filter((cat) => !cat.parent_id);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Categories</span>
          {showControls && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddSubcategory?.("")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {rootCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No categories found</p>
            {showControls && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onAddSubcategory?.("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Category
              </Button>
            )}
          </div>
        ) : (
          rootCategories.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              onSelect={onCategorySelect}
              onAddSubcategory={onAddSubcategory}
              onEditCategory={onEditCategory}
              selectedCategory={selectedCategory}
              showControls={showControls}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
