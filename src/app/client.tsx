"use client";
import dayjs from "dayjs";

import { Loader2 } from "lucide-react";
import { match } from "ts-pattern";
import { useAccount } from "wagmi";
import { FLTCountUp } from "./components/flt-countup";
import { ClaimCountDown } from "./components/flt-timer";
import { UnlockButton } from "./components/unlock-button";
import { useFltDropState } from "./hooks";
dayjs.extend(require("dayjs/plugin/duration"));

export const UnlockStat = () => {
  const { status } = useAccount();
  const { state, isLocked } = useFltDropState();
  if (status != "connected") {
    return null;
  }
  const cli = match(state)
    .with("loading", () => (
      <Loader2 className=" h-4 w-4 animate-spin mx-auto" />
    ))
    .with("claimed", () => (
      <div className="font-bold animate-pulse"> No locked FLT found</div>
    ))
    .with("valid", () => (
      <div>
        <FLTCountUp />
        <ClaimCountDown />
        <div className="mt-2">
          <UnlockButton isLocked={isLocked} />
        </div>
      </div>
    ))
    .with("unknown", () => null)
    .exhaustive();
  return cli;
};

