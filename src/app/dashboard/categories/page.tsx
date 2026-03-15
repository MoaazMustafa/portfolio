import { Plus } from 'lucide-react';

import { CategoryDialog } from '@/components/dashboard/category-dialog';
import { CategoryList } from '@/components/dashboard/category-list';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/lib/actions/category';

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.categories || [];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your project categories.
          </p>
        </div>
        <CategoryDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />
      </div>
      <div className="py-4">
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
