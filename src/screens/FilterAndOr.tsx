import ScreenLayout from "@/components/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { fullRandomShuffleArray } from "@/utils";
import classNames from "classnames";
import { Circle, Hexagon, Pentagon, Square, Triangle } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

interface ShapeType {
  id: string;
  shape: ReactNode;
  colour: string;
  size: string;
  shapeName: string;
}

const COLOURS: string[] = [
  "red",
  "blue",
  "indigo",
  "orange",
  "yellow",
  "green",
  "purple",
] as const;

const SIZES: string[] = ["sm", "md", "lg"] as const;

const SHAPES: { shapeName: string; shape: ReactNode }[] = [
  { shapeName: "triangle", shape: <Triangle className="size-full" /> },
  { shapeName: "circle", shape: <Circle className="size-full" /> },
  { shapeName: "square", shape: <Square className="size-full" /> },
  { shapeName: "hexagon", shape: <Hexagon className="size-full" /> },
  { shapeName: "pentagon", shape: <Pentagon className="size-full" /> },
];

const DATA: ShapeType[] = COLOURS.map((colour) => {
  return SIZES.map((size) => {
    return {
      size,
      colour,
    };
  });
})
  .flat()
  .map((config) => {
    return SHAPES.map((shape) => {
      return {
        id: uuidv4(),
        ...config,
        ...shape,
      };
    });
  })
  .flat();

const FILTER_TYPE = {
  AND: "&&",
  OR: "||",
} as const;

const FILTER_ALL = "all" as const;

const shapeTypes = SHAPES.map((x) => x.shapeName);

type ShapeFilterType = (typeof shapeTypes)[number] & typeof FILTER_ALL;

const shapeFilters = [
  { label: FILTER_ALL, value: FILTER_ALL },
  ...SHAPES.map((x) => {
    return { label: x.shapeName, value: x.shapeName };
  }),
];

const sizeFilters = [
  { label: FILTER_ALL, value: FILTER_ALL },
  ...SIZES.map((x) => {
    return { label: x, value: x };
  }),
];

const colourFilters = [
  { label: FILTER_ALL, value: FILTER_ALL },
  ...COLOURS.map((x) => {
    return { label: x, value: x };
  }),
];

const FilterAndOr = () => {
  const [size, setSize] = useState<(typeof SIZES)[number] & typeof FILTER_ALL>(
    FILTER_ALL,
  );
  const [colour, setColour] = useState<
    (typeof COLOURS)[number] & typeof FILTER_ALL
  >(FILTER_ALL);
  const [shape, setShape] = useState<ShapeFilterType>(FILTER_ALL);
  const [filterType, setFilterType] = useState<
    (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE]
  >(FILTER_TYPE.AND);

  const randomData = useMemo(() => {
    return fullRandomShuffleArray({ items: DATA });
  }, [DATA]);

  const displayData = useMemo(() => {
    // common to both AND OR filtering
    const showEverything =
      colour === FILTER_ALL && shape === FILTER_ALL && size === FILTER_ALL;

    if (showEverything) {
      return randomData;
    }

    return randomData.filter((item) => {
      // "all" should mean "nothing picked, so this filter adds nothing".
      // filtering specifically for that match
      const colourMatched: boolean = item.colour === colour;
      const shapeMatched: boolean = item.shapeName === shape;
      const sizeMatched: boolean = item.size === size;

      if (filterType === FILTER_TYPE.AND) {
        // AND: a filter set to "all" lets every item through
        const colourFilter: boolean = colour === FILTER_ALL || colourMatched;
        const shapeFilter: boolean = shape === FILTER_ALL || shapeMatched;
        const sizeFilter: boolean = size === FILTER_ALL || sizeMatched;

        return colourFilter && shapeFilter && sizeFilter;
      }

      return colourMatched || shapeMatched || sizeMatched;
    });
  }, [randomData, colour, shape, size, filterType]);

  const clearFilters = () => {
    setSize(FILTER_ALL);
    setColour(FILTER_ALL);
    setShape(FILTER_ALL);
    setFilterType(FILTER_TYPE.AND);
  };

  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/filter-and-or"
      title="Filter AND | OR"
    >
      <Card className="p-10">
        <p>shape {shape}</p>
        <CardAction className="w-full text-center flex flex-col gap-y-4">
          <h3 className="text-2xl font-extrabold">
            Filter{" "}
            <span
              className={
                filterType === FILTER_TYPE.AND
                  ? "text-green-600 p-2 rounded rounded-lg border-1 border-neutral-200"
                  : ""
              }
            >
              AND
            </span>{" "}
            |{" "}
            <span
              className={
                filterType === FILTER_TYPE.OR
                  ? "text-green-600 p-2 rounded rounded-lg border-1 border-neutral-200"
                  : ""
              }
            >
              OR
            </span>
          </h3>
          <div className="w-full flex flex-row justify-center gap-x-6 items-center">
            <Field className="flex flex-col justify-start items-start w-20">
              <FieldLabel htmlFor="filterType">Filter type:</FieldLabel>
              <Switch
                size="default"
                value={filterType}
                checked={filterType === FILTER_TYPE.OR}
                id="filterType"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilterType(FILTER_TYPE.OR);
                  } else {
                    setFilterType(FILTER_TYPE.AND);
                  }
                }}
              />
            </Field>
            <Button
              size="lg"
              className="px-4 py-3 bg-orange-500 text-white"
              onClick={() => clearFilters()}
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-row items-center justify-center w-full">
            <Field className="basis-1/3">
              <FieldLabel>Shape</FieldLabel>
              <Select
                items={shapeFilters}
                value={shape}
                onValueChange={(val: string | null) => {
                  console.log("filter", val);
                  if (!val) {
                    return;
                  }
                  setShape(val as ShapeFilterType);
                }}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Filter by Shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Shape</SelectLabel>
                    {shapeFilters.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field className="basis-1/3">
              <FieldLabel htmlFor="filter-colour">Colours</FieldLabel>
              <Select
                id="filter-colour"
                items={colourFilters}
                value={colour}
                onValueChange={(val: string | null) => {
                  if (!val) {
                    return;
                  }
                  setColour(
                    val as (typeof COLOURS)[number] & typeof FILTER_ALL,
                  );
                }}
              >
                <SelectTrigger id="filter-colour" className="w-full max-w-48">
                  <SelectValue placeholder="Filter by colour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Colour</SelectLabel>
                    {colourFilters.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field className="basis-1/3">
              <FieldLabel>Sizes</FieldLabel>
              <Select
                items={sizeFilters}
                value={size}
                onValueChange={(val: string | null) => {
                  console.log("filter", val);
                  if (!val) {
                    return;
                  }
                  setSize(val as (typeof SIZES)[number] & typeof FILTER_ALL);
                }}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Filter by size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Size</SelectLabel>
                    {sizeFilters.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardAction>
        <CardContent className="flex flex-col gap-y-4 items-center justify-start">
          <div className="flex flex-row flex-wrap justify-center items-center gap-4">
            {displayData.map((item) => (
              <div
                key={item.id}
                className={classNames(
                  "relative block flex items-center justify-center fill-current size-full",
                  {
                    "bg-purple-500": item.colour === "purple",
                    "bg-yellow-500": item.colour === "yellow",
                    "bg-red-500": item.colour === "red",
                    "bg-green-500": item.colour === "green",
                    "bg-blue-500": item.colour === "blue",
                    "bg-indigo-500": item.colour === "indigo",
                    "bg-orange-500": item.colour === "orange",
                    "w-20 h-20": item.size === "lg",
                    "w-10 h-10": item.size === "md",
                    "w-5 h-5": item.size === "sm",
                  },
                )}
              >
                <div className=" block fill-current size-full">
                  {item.shape}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xl font-extrabold">
            Total items: {displayData.length}
          </p>
        </CardContent>
      </Card>
    </ScreenLayout>
  );
};

export default FilterAndOr;
