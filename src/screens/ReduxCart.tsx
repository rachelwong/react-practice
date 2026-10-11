import Layout from "@/components/Layout";
import ReduxCartDrawer from "@/components/ReduxCartDrawer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  addToCart,
  fetchProducts,
  resetCartSelection,
} from "@/context/cartReducer";
import { useCartDispatch, useCartSelector } from "@/context/cartStore";
import type { Product } from "@/services/types/ProductResponse";
import { useEffect } from "react";

const ReduxCart = () => {
  const products = useCartSelector((state) => state.availableProducts);
  const status = useCartSelector((state) => state.status);

  const dispatch = useCartDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <Layout
      title="Shopping Cart in Redux"
      brief="https://www.reactchallenges.com/challenges/shopping-cart"
    >
      <div className="products max-w-4xl mx-auto h-full flex flex-col gap-y-4">
        {status === "loading" && <Spinner width={20} height={20} />}
        <ReduxCartDrawer />
        {status === "succeeded" && (
          <>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => dispatch(resetCartSelection())}
            >
              Reset cart
            </Button>
            <div className="grid grid-cols-3 gap-4">
              {products.map((product: Product) => {
                return (
                  <Card
                    key={product.title}
                    className="h-full flex flex-col justify-between items-stretch"
                  >
                    {!!product.images.length && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="relative z-20 aspect-video w-full object-cover "
                      />
                    )}
                    <CardHeader>
                      <CardAction>
                        <h3>${product.price}</h3>
                      </CardAction>
                      <CardTitle>{product.title}</CardTitle>
                      <CardDescription>{product.description} </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        onClick={() => {
                          console.log(
                            "product selected",
                            product.id.toString(),
                            product.title,
                          );
                          dispatch(addToCart(product.id.toString()));
                        }}
                        className="w-full"
                      >
                        Add to cart
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReduxCart;
