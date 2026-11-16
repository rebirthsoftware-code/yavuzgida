import { Wheat, Flame, Nut, Droplets, Cylinder, Utensils, Egg, Coffee, Cookie, Soup, Candy, Package, type LucideProps } from "lucide-react";

const icons = { wheat: Wheat, flame: Flame, nut: Nut, droplets: Droplets, cylinder: Cylinder, utensils: Utensils, egg: Egg, coffee: Coffee, cookie: Cookie, soup: Soup, candy: Candy, package: Package };

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? Package;
  return <Icon {...props} />;
}
