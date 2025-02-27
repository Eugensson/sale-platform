import { CartAddItem } from "@/app/(root)/cart/[itemId]/cart-add-item";

const CartAddItemPage = async (props: {
  params: Promise<{ itemId: string }>;
}) => {
  const { itemId } = await props.params;

  return <CartAddItem itemId={itemId} />;
};

export default CartAddItemPage;
