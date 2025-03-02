import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCart } from "@/components/shared/product/add-to-cart";
import { ReviewList } from "@/app/(root)/product/[slug]/review-list";
import { ProductPrice } from "@/components/shared/product/product-price";
import { RatingSummary } from "@/components/shared/product/rating-summary";
import { SelectVariant } from "@/components/shared/product/select-variant";
import { ProductSlider } from "@/components/shared/product/product-slider";
import { ProductGallery } from "@/components/shared/product/product-gallery";
import { BrowsingHistoryList } from "@/components/shared/browsing-history-list";
import { AddToBrowsingHistory } from "@/components/shared/product/add-to-browsing-history";

import { auth } from "@/auth";

import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from "@/lib/actions/product.actions";
import { generateId, round2 } from "@/lib/utils";

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;

  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
  };
};

const ProductDetails = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; color: string; size: string }>;
}) => {
  const session = await auth();
  const { slug } = await props.params;
  const { page, color, size } = await props.searchParams;

  const [product, relatedProducts] = await Promise.all([
    getProductBySlug(slug),
    getProductBySlug(slug).then((product) =>
      getRelatedProductsByCategory({
        category: product.category,
        productId: product._id,
        page: Number(page || "1"),
      })
    ),
  ]);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <section className="container space-y-10">
      <AddToBrowsingHistory id={product._id} category={product.category} />

      <section className="grid grid-cols-1 md:grid-cols-5">
        <ProductGallery images={product.images} className="col-span-2" />

        <div className="flex w-full flex-col gap-2 md:p-5 col-span-2">
          <div className="flex flex-col gap-3">
            <p className="p-medium-16 rounded-full bg-grey-500/10 text-muted-foreground">
              Brand {product.brand} {product.category}
            </p>
            <h1 className="text-xl">{product.name}</h1>
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              asPopover
              ratingDistribution={product.ratingDistribution}
            />
            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-3">
                <ProductPrice
                  price={product.price}
                  listPrice={product.listPrice}
                  isDeal={product.tags.includes("todays-deal")}
                  forListing={false}
                />
              </div>
            </div>
          </div>
          <SelectVariant
            product={product}
            size={size || product.sizes[0]}
            color={color || product.colors[0]}
          />
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <p className="p-bold-20 text-grey-600">Description:</p>
            <p className="p-medium-16 lg:p-regular-18">{product.description}</p>
          </div>
        </div>

        <Card className="h-fit">
          <CardContent className="p-4 flex flex-col  gap-4">
            <ProductPrice price={product.price} />
            {product.countInStock > 0 && product.countInStock <= 3 && (
              <p className="text-destructive font-bold">
                {`Only ${product.countInStock} left in stock - order soon`}
              </p>
            )}
            {product.countInStock !== 0 ? (
              <p className="text-green-700 text-xl">In Stock</p>
            ) : (
              <p className="text-destructive text-xl">Out of Stock</p>
            )}
            {product.countInStock !== 0 && (
              <AddToCart
                item={{
                  clientId: generateId(),
                  product: product._id,
                  countInStock: product.countInStock,
                  name: product.name,
                  slug: product.slug,
                  category: product.category,
                  price: round2(product.price),
                  quantity: 1,
                  image: product.images[0],
                  size: size || product.sizes[0],
                  color: color || product.colors[0],
                }}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <ReviewList product={product} userId={session?.user.id} />

      <ProductSlider
        products={relatedProducts.data}
        title={`Best Sellers in ${product.category}`}
      />

      <BrowsingHistoryList className="mt-10" />
    </section>
  );
};

export default ProductDetails;
