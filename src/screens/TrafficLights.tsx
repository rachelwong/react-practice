import Layout from "@/components/Layout";
import { useEffect, useState } from "react";

const lights = ["bg-red-500", "bg-yellow-300", "bg-green-500"];

const TrafficLights = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const handleLightChange = setInterval(() => {
      if (currentIndex === 0) {
        setCurrentIndex(lights.length - 1);
      } else if (currentIndex === lights.length - 1) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setCurrentIndex(0);
      }
    }, 2000);

    return () => clearInterval(handleLightChange);
  }, [currentIndex, lights]);

  return (
    <Layout
      title={"Traffic lights"}
      brief={"https://www.reactchallenges.com/challenges/traffic-light"}
    >
      <div className="max-w-4xl mx-auto h-full flex flex-col items-start justify-start">
        {lights.map((colour, lightIndex) => {
          const isCurrent = lightIndex === currentIndex;
          const classToApply = isCurrent ? colour : "bg-neutral-100";
          return (
            <div
              key={colour}
              className={`w-40 h-40 rounded-full ${classToApply}`}
            ></div>
          );
        })}
      </div>
    </Layout>
  );
};

export default TrafficLights;
