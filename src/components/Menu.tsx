import type { Category, MenuItem } from "@/domain/types";
import MenuItemCard from "./MenuItemCard";

const SECTIONS: readonly { category: Category; title: string }[] = [
  { category: "drink", title: "Drinks" },
  { category: "food", title: "Food" },
];

interface MenuProps {
  items: readonly MenuItem[];
  onAdd: (item: MenuItem) => void;
}

export default function Menu({ items, onAdd }: MenuProps) {
  return (
    <section aria-labelledby="menu-heading" className="space-y-8">
      <h2 id="menu-heading" className="text-2xl font-bold">
        Menu
      </h2>
      {SECTIONS.map(({ category, title }) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-stone-500 uppercase">{title}</h3>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <li key={item.id}>
                  <MenuItemCard item={item} onAdd={onAdd} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
