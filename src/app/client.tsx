"use client";
import { Button, ButtonLoading } from "@/components/ui/button";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { FLTDropABI, FLTDropAddr } from "@/lib/flt/abi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { match } from "ts-pattern";
import { useAccount, useReadContract } from "wagmi";
dayjs.extend(require("dayjs/plugin/duration"));

export const useTime = (refreshCycle = 100) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), refreshCycle);
    return () => clearInterval(intervalId);
  }, [refreshCycle, setNow]);

  return now;
};
export const ConnectButton = () => {
  const { address, status } = useAccount();
  const { open } = useWeb3Modal();

  return match(status)
    .with("connecting", () => <ButtonLoading>connecting </ButtonLoading>)
    .with("disconnected", () => (
      <Button onClick={() => open()}>connect to wallet</Button>
    ))
    .with("reconnecting", () => <ButtonLoading>reconnecting </ButtonLoading>)
    .with("connected", () => (
      <Button onClick={() => open()}>
        connected with ( {address?.slice(0, 6).toLowerCase()})
      </Button>
    ))
    .exhaustive();
};

const FLTCountUp = (p: { d: unknown }) => {
  if (typeof p.d != "bigint") return null;
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
        end={BigNumber(p.d.toString())
          .shiftedBy(-18)
          .decimalPlaces(1)
          .toNumber()}
        decimalPlaces={1}
      ></CountUp>
    </div>
  );
};

const ClaimCountDown = (p: { d: unknown }) => {
  const now = useTime(100);
  if (typeof p.d != "bigint") return null;

  const unFreezeAt = dayjs.unix(BigNumber(p.d.toString()).toNumber());
  const diff = unFreezeAt.diff(dayjs(now), "s");
  const duration = dayjs
    .duration(diff, "s")
    .format("M [mon] DD [days] HH [h] s [sec] ");

  return (
    <div className="text-center">
      <div className="text-sm">
        Unlock at {unFreezeAt.format("YY-MM-DD HH:mm:ss ZZ")}{" "}
      </div>
      <div className="text-2xl font-bold font-mono">{duration}</div>
    </div>
  );
};

export const UnlockStat = () => {
  const { address } = useAccount();
  const { status } = useAccount();

  const result = useReadContract({
    abi: FLTDropABI,
    address: FLTDropAddr,
    functionName: "lockedBalances",
    args: [address],
  });

  if (status !== "connected") return null;
  if (result.isFetching) {
    return <Loader2 className=" h-4 w-4 animate-spin mx-auto" />;
  }

  if (
    result.data &&
    Array.isArray(result.data) &&
    typeof result.data[0] == "bigint"
  ) {
    const locked = BigNumber(result.data[0].toString());

    if (locked.lte(0)) {
      return (
        <div className="font-bold animate-pulse"> No locked FLT found</div>
      );
    }
    return (
      <div>
        <FLTCountUp d={result.data?.[0]} />
        <ClaimCountDown d={result.data?.[1]} />
        <Button disabled className="mt-4">
          Unlock Now
        </Button>
      </div>
    );
  }
  return null;
};
