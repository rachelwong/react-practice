import Layout from "@/components/Layout";
import Star from "@/components/Star";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";

const TEST_STAR_VALUE = 5;
const TEST_MAX_STAR_VALUE = 10;
const MIN_STAR_VALUE = 2;

const StarReview = () => {
  const [numStars, setNumStars] = useState<number>(TEST_STAR_VALUE);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleStarValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      if (!isNaN(Number(e.target.value))) {
        setNumStars(Number(e.target.value));
      }
    },
    [],
  );

  const handleHoverStart = useCallback(
    (index: number) => {
      setHoveredRating(index);
    },

    [],
  );

  const handleHoverEnd = useCallback(() => setHoveredRating(null), []);

  const invalidStars = numStars < MIN_STAR_VALUE;

  const starIndices = useMemo(() => {
    let indices = [];
    for (let i = 0; i < numStars; i++) {
      indices.push(i + 1);
    }
    return indices.sort((a, b) => b - a);
  }, [numStars]);

  const resetStarReview = () => {
    setRating(null);
    setNumStars(TEST_STAR_VALUE);
  };

  return (
    <Layout
      heading={
        <>
          <h3 className="text-xl">Star Reviews component</h3>
          <p>Dynamic star review component with hover and click </p>
          <p>Star rating value grow from right to left</p>
        </>
      }
    >
      <Field>
        <FieldLabel>How many stars would you like?</FieldLabel>
        <Input
          value={numStars}
          type="number"
          min={"0"}
          max={TEST_MAX_STAR_VALUE}
          aria-invalid={invalidStars || undefined}
          onChange={(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
            handleStarValueChange(e)
          }
        ></Input>
        {invalidStars && (
          <Alert className="bg-red-100 border-red-400 mt-2">
            <AlertTitle className="text-red-900">
              You must specify at least {MIN_STAR_VALUE} stars
            </AlertTitle>
          </Alert>
        )}
      </Field>
      {!invalidStars && starIndices.length && (
        <form className="flex flex-wrap align-center justify-center my-6">
          {starIndices.map((starIndex) => (
            <Star
              key={starIndex}
              index={starIndex}
              isActiveRating={!!rating && starIndex <= rating}
              isChecked={!!rating && starIndex === rating}
              isHovered={!!hoveredRating && starIndex <= hoveredRating}
              onChange={setRating}
              onMouseEnter={handleHoverStart}
              onMouseOut={handleHoverEnd}
            />
          ))}
        </form>
      )}
      {rating && (
        <p className="text-md text-slate-900 text-center mt-5 font-extrabold">
          You have chosen {rating.toString()} star rating.
        </p>
      )}
      <Button
        variant="default"
        size="lg"
        className="bg-amber-600 text-white p-4 my-5 mx-auto"
        onClick={resetStarReview}
      >
        Reset Star Review
      </Button>
    </Layout>
  );
};

export default StarReview;
