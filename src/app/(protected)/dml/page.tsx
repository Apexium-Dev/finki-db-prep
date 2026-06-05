import { fetchCategoryPageData } from "@/lib/categoryPage";
import { getT } from "@/lib/i18n/server";
import CategoryPageShell from "@/components/CategoryPageShell";

export default async function DmlPage() {
  const t = getT();
  const { enriched, totalCount, completedCount, avgDiff } = await fetchCategoryPageData("dml");
  return (
    <CategoryPageShell
      title={t.category.dml.title}
      subtitle={t.category.dml.subtitle}
      totalCount={totalCount}
      completedCount={completedCount}
      avgDiff={avgDiff}
      tasks={enriched}
    />
  );
}
