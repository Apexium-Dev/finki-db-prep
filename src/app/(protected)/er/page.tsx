import { fetchCategoryPageData } from "@/lib/categoryPage";
import { getT } from "@/lib/i18n/server";
import CategoryPageShell from "@/components/CategoryPageShell";

export default async function ErPage() {
  const t = getT();
  const { enriched, totalCount, completedCount, avgDiff } = await fetchCategoryPageData("er");
  return (
    <CategoryPageShell
      title={t.category.er.title}
      subtitle={t.category.er.subtitle}
      totalCount={totalCount}
      completedCount={completedCount}
      avgDiff={avgDiff}
      tasks={enriched}
      showERCounts
    />
  );
}
