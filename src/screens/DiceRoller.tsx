import FixedDiceRoller from "@/components/FixedDiceRoller";
import RandomisedDiceRoller from "@/components/RandomisedDiceRoller";
import ScreenLayout from "@/components/ScreenLayout";

const DiceRoller = () => {
  return (
    <ScreenLayout
      brief="https://www.reactchallenges.com/challenges/roll-dices"
      title="Dice rollers"
      description={<p>Attempting randomised value selector for Wordage quiz</p>}
    >
      <div className="flex flex-col gap-y-10">
        <FixedDiceRoller />
        <RandomisedDiceRoller />
      </div>
    </ScreenLayout>
  );
};

export default DiceRoller;
