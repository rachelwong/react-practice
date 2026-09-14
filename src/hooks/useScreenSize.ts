import { BREAK_POINTS, VIEWPORT } from "@/constants";
import { useEffect, useState } from "react";

// derived from tailwindcss

type UseScreenSizeType = {
  breakPoint: (typeof VIEWPORT)[keyof typeof VIEWPORT];
  isMobile: boolean;
  width: number;
};
// custom hook to get screen size values (w/h)

const useScreenSize = (): UseScreenSizeType => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile = width < BREAK_POINTS.MOBILE;

  // be mindful of off by one errors here or it will clash
  // and resolve to the final return
  const calculateBreakpoint = () => {
    if (width >= BREAK_POINTS.DESKTOP) {
      return VIEWPORT.DESKTOP;
    }
    if (width >= BREAK_POINTS.MOBILE && width < BREAK_POINTS.DESKTOP) {
      return VIEWPORT.TABLET;
    }
    return VIEWPORT.MOBILE;
  };

  const breakPoint = calculateBreakpoint();

  useEffect(() => {
    const handleWidth = () => {
      setWidth(window.innerWidth);
    };
    // registeres the resize event listener and capture the screen width
    window.addEventListener("resize", handleWidth);

    // cleanup function before component unmounts
    // the cleanup needs to be the same function that is created inside the useEffect
    // otherwise it's different function references
    return () => window.removeEventListener("resize", handleWidth);
  }, []);

  return {
    isMobile,
    width,
    breakPoint,
  };
};

export default useScreenSize;
