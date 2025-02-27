import Link from "next/link";
import Image from "next/image";

import { Rating } from "@/components/shared/product/rating";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ImageHover } from "@/components/shared/product/image-hover";
import { ProductPrice } from "@/components/shared/product/product-price";

import { formatNumber, generateId, round2 } from "@/lib/utils";
import { IProduct } from "@/lib/db/models/product.model";
import { AddToCart } from "./add-to-cart";

type Props = {
  product: IProduct;
  hideDetails?: boolean;
  hideBorder?: boolean;
  hideAddToCart?: boolean;
};

export const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: Props) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className="relative h-52">
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className="relative h-52">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </Link>
  );
  const ProductDetails = () => (
    <div className="flex-1 space-y-2">
      <p className="font-medium">{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className="overflow-hidden text-ellipsis text-sm"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {product.name}
      </Link>
      <div className="flex items-center justify-center gap-1">
        <Rating rating={product.avgRating} />
        <span className="text-sm">({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes("todays-deal")}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  );

  const AddButton = () => (
    <div className="w-full text-center">
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  );

  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage />
      {!hideDetails && (
        <>
          <div className="p-3 flex-1 text-center">
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className="flex flex-col  ">
      <CardHeader className="p-3">
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-3 flex-1 text-center">
            <ProductDetails />
          </CardContent>
          <CardFooter className="p-3">
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  );
};
