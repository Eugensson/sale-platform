import { Card, CardContent } from "@/components/ui/card";
import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import { ProductSlider } from "@/components/shared/product/product-slider";
import { BrowsingHistoryList } from "@/components/shared/browsing-history-list";

import data from "@/lib/data";
import { toSlug } from "@/lib/utils";
import {
  getHomePageData,
  getProductsByTag,
} from "@/lib/actions/product.actions";

const Home = async () => {
  const [
    { categories, newArrivals, featureds, bestSellers },
    todaysDeals,
    bestSellingProducts,
  ] = await Promise.all([
    getHomePageData(),
    getProductsByTag({ tag: "todays-deal" }),
    getProductsByTag({ tag: "best-seller" }),
  ]);

  const cards = [
    {
      title: "Categories to explore",
      link: {
        text: "See More",
        href: "/search",
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.png`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals,
      link: {
        text: "View All",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers,
      link: {
        text: "View All",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Featured Products",
      items: featureds,
      link: {
        text: "Shop Now",
        href: "/search?tag=new-arrival",
      },
    },
  ];

  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className="p-6 md:p-12 lg:p-16 bg-muted">
        <div className="container space-y-4 md:space-y-8">
          <HomeCard cards={cards} />
          <Card className="w-full py-4 rounded-2xl shadow-md">
            <CardContent className="py-4">
              <ProductSlider title={"Today's Deals"} products={todaysDeals} />
            </CardContent>
          </Card>
          <Card className="w-full py-4 rounded-2xl shadow-md">
            <CardContent className="p-4 items-center gap-3">
              <ProductSlider
                title="Best Selling Products"
                products={bestSellingProducts}
                hideDetails
              />
            </CardContent>
          </Card>
          <BrowsingHistoryList />
        </div>
      </div>
    </>
  );
};

export default Home;
