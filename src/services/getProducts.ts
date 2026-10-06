import axios from "axios";
import type { Product } from "./types/ProductResponse";

interface GetProductsRequest {
  maxNumber?: number;
}

const getProducts = async ({
  maxNumber = 10,
}: GetProductsRequest): Promise<Product[] | undefined> => {
  const baseURL = `https://dummyjson.com/products?limit=${maxNumber}`;

  try {
    const { data } = await axios.get(baseURL);
    return data.products;
  } catch (err) {
    console.error(`Error thrown at getProducts service ${err}`);
    throw err;
  }
};

export default getProducts;
