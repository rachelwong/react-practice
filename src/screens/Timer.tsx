import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { integerToMinuteSeconds } from "@/utils";
import { useEffect, useState } from "react";

const maxTimerSecondstimerValue = 3599; // 59:59 in mm:ss

const Timer = () => {
  const [clockTime, setClock] = useState(new Date());
  const [timer, setTimer] = useState<number>(0);
  const [playStatus, setPlayStatus] = useState<boolean>(false); // false = stopped, true = start

  useEffect(() => {
    if (!playStatus) {
      return;
    }
    if (timer < maxTimerSecondstimerValue) {
      setTimer((prev) => prev + 1);
    } else {
      // reset
      setTimer(0);
    }
  }, [clockTime]);

  useEffect(() => {
    if (!playStatus) {
      return;
    }
    const timerId = setInterval(() => {
      setClock(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, [playStatus]);

  const handleReset = () => {
    setPlayStatus(false);
    setTimer(0);
  };

  return (
    <Layout
      heading={
        <>
          <h3>Timer</h3>
          <p>
            Start/Stop timer in minutes and seconds only and will not exceed 59
            minutes: 59 seconds
          </p>
        </>
      }
    >
      <Button
        variant="outline"
        size="lg"
        onClick={() => setPlayStatus((prev) => !prev)}
      >
        {playStatus ? "Stop" : "Start"}
      </Button>
      <Button variant="outline" size="lg" onClick={() => handleReset()}>
        Reset
      </Button>

      <p className="text-lg font-extrabold">
        Timer {integerToMinuteSeconds(timer)}
      </p>
      <br />
      <p className="text-lg font-extrabold">
        Clock Time {clockTime.toLocaleTimeString()}
      </p>
    </Layout>
  );
};

export default Timer;
