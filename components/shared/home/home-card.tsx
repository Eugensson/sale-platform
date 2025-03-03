import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4">
      {cards.map((card) => (
        <li key={card.title}>
          <Card className="flex flex-col rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="text-center">
                <h3 className="text-lg">{card.title}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1">
                {card.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex flex-col gap-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="aspect-square object-scale-down max-w-full h-auto mx-auto"
                      height={75}
                      width={75}
                    />
                    <p className="text-center capitalize text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
            {card.link && (
              <CardFooter>
                <Button asChild>
                  <Link href={card.link.href} className="block">
                    {card.link.text}
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
};
