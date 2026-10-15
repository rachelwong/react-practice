import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FastForward,
  MoveLeft,
  MoveRight,
  Rewind,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";

const DATA = {
  APPLE: "APPLE",
  ORANGE: "ORANGE",
  LEMON: "LEMON",
  MELON: "MELON",
  CARROT: "CARROT",
  TOMATO: "TOMATO",
  LETTUCE: "LETTUCE",
  RHUBARB: "RHUBARB",
};

const initialState = {
  left: [DATA.APPLE, DATA.ORANGE, DATA.MELON, DATA.LEMON],
  right: [DATA.CARROT, DATA.TOMATO, DATA.LETTUCE, DATA.RHUBARB],
};

type Item = {
  id: string;
  value: boolean;
};

const TransferList = () => {
  const [leftList, setLeftList] = useState<Item[]>([]);
  const [rightList, setRightList] = useState<Item[]>([]);

  const setup = () => {
    setLeftList(initialState.left.map((x) => ({ id: x, value: false })));
    setRightList(initialState.right.map((x) => ({ id: x, value: false })));
  };

  const handleRightToLeft = () => {
    const selectedRight = rightList.filter((x) => x.value);
    setLeftList((prev) => {
      return [...prev, ...selectedRight];
    });
    setRightList((prev) => {
      return [...prev.filter((x) => !x.value)];
    });
  };
  const handleLeftToRight = () => {
    const selectedLeft = leftList.filter((x) => x.value);
    setRightList((prev) => {
      return [...prev, ...selectedLeft];
    });
    setLeftList((prev) => {
      return [...prev.filter((x) => !x.value)];
    });
  };
  const handleAllToRight = () => {
    setRightList((prev) => {
      return [...prev, ...leftList];
    });
    setLeftList([]);
  };
  const handleAllToLeft = () => {
    setLeftList((prev) => {
      return [...prev, ...rightList];
    });
    setRightList([]);
  };

  const disableLeftToRight = leftList.every((x) => !x.value);
  const disableRightToLeft = rightList.every((x) => !x.value);

  useEffect(() => {
    setup();
  }, []);

  return (
    <ScreenLayout
      title="Transfer list"
      brief="https://www.greatfrontend.com/questions/user-interface/transfer-list/react"
    >
      <p>
        {JSON.stringify(leftList.every((x) => !x.value))}{" "}
        {JSON.stringify(disableRightToLeft)}
      </p>
      <div className="max-w-4xl mx-auto w-full h-auto border-1 border-neutral-800 flex flex-row items-stretch justify-between">
        <ul className="left basis-1/3 flex flex-col gap-y-6 items-start justify-start w-full p-6 bg-sky-100">
          {leftList.map((left) => (
            <li className="flex flex-row items-center justify-start gap-x-6 p-4 bg-white w-full">
              <Checkbox
                checked={left.value}
                onCheckedChange={() => {
                  setLeftList((prev) => {
                    return prev.map((x) => {
                      if (x.id === left.id) {
                        return {
                          ...x,
                          value: !x.value,
                        };
                      }
                      return x;
                    });
                  });
                }}
                className="w-10 h-10 "
              />
              {left.id}
            </li>
          ))}
        </ul>
        <div className="controls basis-1/3 flex flex-col items-center justify-center w-full gap-y-5">
          <Button
            size="lg"
            disabled={!rightList.length}
            onClick={() => {
              handleAllToLeft();
            }}
          >
            <Rewind />
          </Button>
          <Button
            size="lg"
            disabled={disableRightToLeft}
            onClick={() => {
              handleRightToLeft();
            }}
          >
            <MoveLeft />
          </Button>
          <Button
            size="lg"
            disabled={disableLeftToRight}
            onClick={() => {
              handleLeftToRight();
            }}
          >
            <MoveRight />
          </Button>
          <Button
            size="lg"
            disabled={!rightList.length}
            onClick={() => {
              handleAllToRight();
            }}
          >
            <FastForward />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setup();
            }}
          >
            <RotateCcw />
          </Button>
        </div>
        <ul className="right basis-1/3 flex flex-col gap-y-6 items-start justify-start w-full p-6 bg-violet-100">
          {rightList.map((right) => (
            <li className="flex flex-row items-center justify-start gap-x-6 p-4 bg-white w-full">
              <Checkbox
                checked={right.value}
                onCheckedChange={() => {
                  setRightList((prev) => {
                    return prev.map((x) => {
                      if (x.id === right.id) {
                        return {
                          ...x,
                          value: !x.value,
                        };
                      }
                      return x;
                    });
                  });
                }}
                className="w-10 h-10"
              />
              {right.id}
            </li>
          ))}
        </ul>
      </div>
    </ScreenLayout>
  );
};

export default TransferList;
