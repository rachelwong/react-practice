import ScreenLayout from "@/components/ScreenLayout";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  name: string;
  joined: string;
  age: number;
  score: number;
  active: boolean;
};

const personCellCss =
  "person-cell text-center text-wrap text-ellipsis flex flex-row items-center justify-center";

const SortableTable = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filter, setFilter] = useState<{
    value: keyof Person | null;
    direction: boolean;
  }>({
    value: null,
    direction: false, // false desc, true asc
  });

  const getPersonData = async () => {
    const data = await fetch("/PeopleData.json").then((res) => res.json());
    setPeople(data.people);
  };

  const headers: (keyof Person)[] =
    people && people.length ? (Object.keys(people[0]) as (keyof Person)[]) : [];

  useEffect(() => {
    getPersonData();
  }, []);

  const onFilter = (filterStr: keyof Person) => {
    if (filter.value === filterStr) {
      setFilter((prev) => {
        return { ...prev, direction: !prev.direction };
      });
    } else {
      setFilter({ value: filterStr, direction: false });
    }
  };

  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/sortable-table"
      title="Sortable Table"
    >
      <div className="mx-auto mb-10 max-w-4xl w-full flex flex-col gap-y-6 items-center justify-center h-auto">
        <h1 className="text-3xl text-slate-800 font-bold text-center">
          Sortable Table
        </h1>
        <div className={`w-full `}>
          {headers.length && (
            <div
              className={`table-header w-full grid grid-cols-${headers.length} grid-flow-row`}
              // tailwind can't build classes dynamically on the fly
              style={{
                gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
              }}
            >
              {headers.map((header: keyof Person) => (
                <button
                  onClick={() => {
                    onFilter(header);
                  }}
                  key={header}
                  className={`header-cell flex flex-row justify-center items-center gap-x-6 bg-neutral-200 border-1 border-neutral-900 w-full capitalize py-2 hover:cursor-pointer`}
                >
                  <span className="font-bold">{header}</span>
                  {!!filter.value && header === filter.value && (
                    <div className="header-cell__icon">
                      {!filter.direction ? (
                        <ArrowDownWideNarrow size={20} />
                      ) : (
                        <ArrowUpNarrowWide size={20} />
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          {(!people || !people.length) && (
            <div className="w-full py-2 text-center bg-neutral-700 text-white font-bold">
              <h2>No people data to display</h2>
            </div>
          )}
          {!!people.length &&
            people
              .sort((a, b) => {
                if (!filter.value) {
                  return 0;
                }
                // separating this out as a var because
                // tsc treats a[filter.value] as "a string, a number or a boolean".
                const aValue = a[filter.value];
                const bValue = b[filter.value];

                // result must be init with value
                // or tsc thinks it could return undefined
                let result: number = 0;

                if (typeof aValue === "number" && typeof bValue === "number") {
                  result = aValue - bValue;
                }

                if (typeof aValue === "string" && typeof bValue === "string") {
                  result = aValue.localeCompare(bValue);
                }

                if (
                  typeof aValue === "boolean" &&
                  typeof bValue === "boolean"
                ) {
                  result = aValue.toString().localeCompare(bValue.toString());
                }

                return filter.direction ? result : -result;
              })
              .map((person, personIndex) => {
                const background =
                  personIndex % 2 === 0 ? "bg-indigo-100" : "bg-white";
                return (
                  <div
                    key={person.id}
                    className={`person-row grid border-1 border-neutral-400 w-full py-2 ${background}`}
                    style={{
                      gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`,
                    }}
                  >
                    <div className={personCellCss}>{personIndex}</div>
                    <div className={personCellCss}>{person.name}</div>
                    <div className={personCellCss}>
                      {new Date(person.joined).toLocaleString("en-AU")}
                    </div>
                    <div className={personCellCss}>{person.age}</div>
                    <div className={personCellCss}>{person.score}</div>
                    <div className={personCellCss}>
                      {JSON.stringify(person.active)}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </ScreenLayout>
  );
};

export default SortableTable;
