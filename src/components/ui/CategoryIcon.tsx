import { Coffee, Droplets, Leaf, CupSoda, Milk, GlassWater, Cake, Cookie, Wrench, Package, SprayCan, Candy, type LucideProps } from "lucide-react";

const icons = { coffee: Coffee, droplets: Droplets, leaf: Leaf, "cup-soda": CupSoda, milk: Milk, "glass-water": GlassWater, cake: Cake, cookie: Cookie, wrench: Wrench, package: Package, "spray-can": SprayCan, candy: Candy };

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? Package;
  return <Icon {...props} />;
}
