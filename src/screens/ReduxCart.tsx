import Layout from "@/components/Layout";
import getProducts from "@/services/getProducts";
import type { Product } from "@/services/types/ProductResponse";
import { useEffect, useState } from "react";

const ReduxCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const getTestProducts = async () => {
    const response = await getProducts({});
    if (!response || !response.length) {
      return;
    }
    setProducts(response);
  };
  useEffect(() => {
    getTestProducts();
  }, []);

  return (
    <Layout
      title="Shopping Cart in Redux"
      brief="https://www.reactchallenges.com/challenges/shopping-cart"
    >
      <ol>
        {products.map((x) => (
          <li>
            {x.title} ${x.price}
          </li>
        ))}
      </ol>
    </Layout>
  );
};

export default ReduxCart;
