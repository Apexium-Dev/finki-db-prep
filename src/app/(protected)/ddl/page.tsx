import { fetchCategoryPageData } from "@/lib/categoryPage";
import { getT } from "@/lib/i18n/server";
import CategoryPageShell from "@/components/CategoryPageShell";

export default async function DdlPage() {
  const t = getT();
  const { enriched, totalCount, completedCount, avgDiff } = await fetchCategoryPageData("ddl");
  return (
    <CategoryPageShell
      title={t.category.ddl.title}
      subtitle={t.category.ddl.subtitle}
      totalCount={totalCount}
      completedCount={completedCount}
      avgDiff={avgDiff}
      tasks={enriched}
    />
  );
}
