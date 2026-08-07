import Link from "next/link";
import { getAllCategoriesAdmin } from "@/lib/actions/product.action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeleteCategoryButton from "./delete-category-button";

const AdminCategoriesPage = async () => {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="h2-bold">
          <span className="text-accent">{"// "}</span>Categories
        </h1>
        <Button asChild className="bg-accent hover:bg-accent-dark text-white">
          <Link href="/admin/categories/create">
            <Plus className="h-4 w-4" /> New Category
          </Link>
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.slug}
                </td>
                <td className="px-4 py-3">{category._count.products}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-accent font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteCategoryButton categoryId={category.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
