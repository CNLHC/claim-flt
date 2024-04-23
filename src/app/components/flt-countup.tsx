import { useAtom } from "jotai";
import CountUp from "react-countup";
import { fltCountAtom } from "../hooks";

export const FLTCountUp = () => {
  const [fltCount] = useAtom(fltCountAtom);
  if (fltCount == null) return null;
  return (
    <div className="text-center">
      <div className="text-sm"> Locked Value</div>
      <CountUp
        className="text-2xl font-bold"
        start={0}
        duration={1}
        useEasing
        formattingFn={(n) => {
          return `${n} FLT`;
        }}
        end={fltCount}
        decimalPlaces={1}
      ></CountUp>
    </div>
  );
};
