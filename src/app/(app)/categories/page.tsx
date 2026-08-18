import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoryIcon, TagIcon } from "@/components/icons";
import CategoryForm from "./category-form";
import DeleteCategoryButton from "./delete-category-button";
import LimitEditor from "./limit-editor";

export default async function CategoriesPage() {
  const session = await getSession();
  if (!session) return null;

  const categories = await prisma.category.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });

  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-ink">
        <TagIcon className="h-5 w-5 text-accent" />
        <h1 className="font-display font-semibold tracking-tight text-2xl">Kategorie</h1>
      </div>

      <div className="elevated rounded-2xl border border-border bg-canvas-raised p-6">
        <h2 className="font-display font-semibold tracking-tight text-xl text-ink">Nowa kategoria</h2>
        <div className="mt-5">
          <CategoryForm />
        </div>
      </div>

      {[
        { title: "Wydatki", list: expense, withLimit: true },
        { title: "Przychody", list: income, withLimit: false },
      ].map(({ title, list, withLimit }) => (
        <div key={title} className="elevated rounded-2xl border border-border bg-canvas-raised">
          <h2 className="border-b border-border px-6 py-5 font-display font-semibold tracking-tight text-xl text-ink">
            {title}
          </h2>
          {list.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-ink-faint">
              Brak kategorii {title === "Wydatki" ? "wydatków" : "przychodów"}.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${c.color}26`, color: c.color }}
                    >
                      <CategoryIcon icon={c.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm text-ink">{c.name}</p>
                      {withLimit && (
                        <LimitEditor
                          categoryId={c.id}
                          initialLimit={c.monthlyLimit ? Number(c.monthlyLimit) : null}
                        />
                      )}
                    </div>
                  </div>
                  <DeleteCategoryButton id={c.id} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
