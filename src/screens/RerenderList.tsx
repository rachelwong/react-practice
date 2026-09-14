import Layout from "@/components/Layout";
import ReRenderListItem from "@/components/ReRenderListItem";
import { Button } from "@/components/ui/button";
import { AVAILABLE_PRODUCTS } from "@/constants";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";

const RerenderList = () => {
  const [tick, setTick] = useState(0);

  const [list, setList] =
    useState<{ id: string; name: string; price: number }[]>(AVAILABLE_PRODUCTS);
  // Logger to check for re-renderings
  useEffect(() => {
    console.log("Rerenderlist rendered!");
  });

  // useCallback here stops it from being re-rendered whenever the tick causes this list to re-render
  // when state in parent changes, all of children also re-render
  const onHandleChange = useCallback(
    ({ e, id }: { e: ChangeEvent<HTMLInputElement>; id: string }) => {
      if (isNaN(Number(e.target.value))) {
        return;
      }

      // needs to update the existing state otherwise you're using stale values
      setList((prev) =>
        prev.map((item) => {
          return item.id !== id
            ? item
            : { ...item, price: Number(e.target.value) };
        }),
      );
      return;
    },
    [], // no dependencies because whenever the list updates, useCallback will return a new function ref
  );

  return (
    <Layout
      heading={
        <>
          <h3>Prevent re-rendering list</h3>
          <p>
            Original brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/memoize-list"
              target="_blank"
            >
              https://www.reactgrind.com/problems/memoize-list
            </a>
          </p>
          <p>
            This was helpful{" "}
            <a href="https://alexsidorenko.com/blog/react-list-rerender">
              https://alexsidorenko.com/blog/react-list-rerender
            </a>
          </p>
        </>
      }
    >
      <div className="relative flex flex-col gap-y-4 w-full">
        <h3>
          Tick count: <span className="font-extrabold">{tick}</span>
        </h3>
        <Button size="lg" onClick={() => setTick((t) => t + 1)}>
          Refresh at parent
        </Button>
        {list.map((x, index) => {
          return (
            <ReRenderListItem
              key={x.id}
              item={x}
              index={index + 1}
              onChange={onHandleChange}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default RerenderList;
