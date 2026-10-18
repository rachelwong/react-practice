import RoughWordage from "@/components/RoughWordage";
import ScreenLayout from "@/components/ScreenLayout";

const Wordage = () => {
  return (
    <ScreenLayout
      title="Wordage Quiz"
      brief="https://www.abc.net.au/news/2026-10-04/abc-wordage-quiz/107211586"
      description={
        <>
          <p>
            Inspired by ABC Wordage Quiz. Refer to the{" "}
            <a className="link" href="/docs/wordage/README.md" target="_blank">
              markdown file
            </a>{" "}
            for business rules and acceptance criteria
          </p>
          <ul className="list-disc pl-2">
            <li>
              Initial start zone disappears after all items dragged into active
              drop zone
            </li>
            <li>Has Submit button (3 tries) and Hint button (2 tries)</li>
            <li>Win = all items in the correct order</li>
            <li>
              Hint button triggers two possible actions:
              <ol className="list-decimal pl-3">
                <li>Identify a correct answer, show a tick</li>
                <li>
                  Identify an incorrect answer and swap it for the right answer.
                </li>
                <li>
                  Identify an incorrect answer and swap it for the right answer.
                  The replaced item is moved to the bottom of the list unless
                  the item at the bottom is already correct.{" "}
                </li>
              </ol>{" "}
            </li>
            <li>
              If currently dragged item is above a list item, then it will be
              ordered before it. If it is below it, then ordered after it. It
              doesn't evaluate order when dragged over.
            </li>
            <li>
              Once outcome reached for an item, it cannot be dragged again
            </li>
            <li>Each submit click will validate all the correct items</li>
            <li>Stretch: re-number the list order on drag.</li>
            <li>
              Once an item in the drop zone has been validated to be in the
              correct position, it cannot be updated again.{" "}
            </li>
            <li>Stretch: lottery style generating hint for incorrect answer</li>
          </ul>
        </>
      }
    >
      <div className="mx-auto max-w-4xl w-full h-auto flex flex-col items-center justify-start">
        <h1 className="text-slate-800 text-3xl font-extrabold">
          First version
        </h1>
        <RoughWordage />
      </div>
    </ScreenLayout>
  );
};

export default Wordage;
