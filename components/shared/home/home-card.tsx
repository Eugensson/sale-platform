import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type CardItem = {
  title: string;
  link: { text: string; href: string };
  items: {
    name: string;
    items?: string[];
    image: string;
    href: string;
  }[];
};

export const HomeCard = ({ cards }: { cards: CardItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-2xl shadow-md flex flex-col">
          <CardContent className="p-4 flex-1">
            <h3 className="text-xl text-center mb-8">{card.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {card.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col gap-2"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="aspect-square object-scale-down max-w-full h-auto mx-auto"
                    height={120}
                    width={120}
                  />
                  <p className="text-center capitalize text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
          {card.link && (
            <CardFooter>
              <Button asChild>
                <Link href={card.link.href} className="mt-4 block">
                  {card.link.text}
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};
