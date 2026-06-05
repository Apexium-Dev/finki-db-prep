import { fetchCategoryPageData } from "@/lib/categoryPage";
import { getT } from "@/lib/i18n/server";
import CategoryPageShell from "@/components/CategoryPageShell";

export default async function TriggerPage() {
  const t = getT();
  const { enriched, totalCount, completedCount, avgDiff } = await fetchCategoryPageData("trigger");
  return (
    <CategoryPageShell
      title={t.category.trigger.title}
      subtitle={t.category.trigger.subtitle}
      totalCount={totalCount}
      completedCount={completedCount}
      avgDiff={avgDiff}
      tasks={enriched}
    />
  );
}
