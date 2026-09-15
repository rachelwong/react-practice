import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

type AccordionData = {
  id: string;
  isOpenByDefault: boolean;
  title: string;
  content: string;
};

const Accordion = () => {
  const [data, setData] = useState<AccordionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // SSOT for selected accordion id

  const getAccordionData = async () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const { data } = await axios.get("/AccordionData.json");
        if (!data?.items?.length) {
          console.error("Unable to fetch accordion data");
        }
        setData(data.items);
      }, 1000);
    } catch (err) {
      console.error(`Unable to fetch accordion data error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const onSelected = (id: string) => {
    if (id === selectedId) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  useEffect(() => {
    getAccordionData();
  }, []);

  return (
    <Layout
      heading={
        <>
          <h3>Accordion</h3>
          <p>
            Original brief from{" "}
            <a href="https://www.reactgrind.com/problems/accordion-single-expand">
              https://www.reactgrind.com/problems/accordion-single-expand
            </a>
          </p>
        </>
      }
    >
      {!loading && !!data && data.length && (
        <div className="accordion-list w-200 mx-auto">
          {data.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <div
                key={item.id}
                className="accordion-container block relative w-full mb-4"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="accordion-trigger w-full py-2 px-4 flex flex-row align-center justify-between"
                  onClick={() => onSelected(item.id)}
                >
                  <p className="text-left">{item.title}</p>
                  {isSelected ? <ChevronUp /> : <ChevronDown />}
                </Button>
                <div
                  className="accordion-content mt-1 px-4 border-1 border-slate-300"
                  style={{
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateRows: isSelected ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease-out",
                  }}
                >
                  <div
                    className="accordion-content-inner py-0 px-3"
                    style={{
                      overflow: "hidden",
                      transition: "padding 0.3s ease- out",
                    }}
                  >
                    <p>{item.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Accordion;
