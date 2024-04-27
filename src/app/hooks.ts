import { FLTDropABI, FLTDropAddr } from "@/lib/flt/abi";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const scopeKeyAtom = atom<string>("0");
export const fltCountAtom = atom<number | null>(null);
export const unLockAtAtom = atom<number | null>(null);
export const claimStateAtom = atomWithStorage<{ [key: string]: `0x${string}` }>(
  "CLAIMED_ADDRESS",
  {}
);

export const useTime = (refreshCycle = 100) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), refreshCycle);
    return () => clearInterval(intervalId);
  }, [refreshCycle, setNow]);

  return now;
};
export const useFltDropState = () => {
  const { address } = useAccount();
  const [unlockTs, setUnlockTs] = useAtom(unLockAtAtom);
  const [fltCount, setFltCount] = useAtom(fltCountAtom);
  const result = useReadContract({
    abi: FLTDropABI,
    address: FLTDropAddr,
    functionName: "lockedBalances",
    args: [address],
    scopeKey: "foo",
  });
  useEffect(() => {
    if (
      Array.isArray(result.data) &&
      typeof result.data?.[0] == "bigint" &&
      typeof result.data?.[1] == "bigint"
    ) {
      setFltCount(
        BigNumber(result.data?.[0].toString())
          .shiftedBy(-18)
          .decimalPlaces(1)
          .toNumber()
      );

      setUnlockTs(BigNumber(result.data?.[1].toString()).toNumber());
    }
  }, [result.data, setFltCount, setUnlockTs]);
  const state = useMemo(() => {
    if (result.isLoading) {
      return "loading" as const;
    }
    if (fltCount && fltCount > 0) {
      return "valid" as const;
    }
    if (!fltCount || fltCount == 0) {
      return "claimed" as const;
    }
    return "unknown" as const;
  }, [fltCount, result.isLoading]);
  const isLocked = useMemo(() => {
    if (!unlockTs) return true;
    return dayjs.unix(unlockTs).isAfter(dayjs());
  }, [unlockTs]);
  return {
    unlockTs,
    fltCount,
    isLocked,
    state,
  };
};

export const useFLTUnlock = () => {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { address } = useAccount();
  const [historyTx, saveTx] = useAtom(claimStateAtom);
  const mergedHash = useMemo(() => {
    if (hash) return hash;
    if (address) return historyTx?.[address];
  }, [address, hash, historyTx]);
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: mergedHash,
  });

  useEffect(() => {
    if (address && hash && txError == null) {
      saveTx((e) => ({
        ...e,
        [address]: hash,
      }));
    }
  }, [address, hash, saveTx, txError]);

  useEffect(() => {
    if (address && mergedHash && txError) {
      saveTx((e) => {
        let m = Object.assign({}, e);
        delete m[address];
        return m;
      });
    }
  }, [address, mergedHash, saveTx, txError]);

  const state = useMemo(() => {
    if (error) {
      return "error" as const;
    }
    if (isPending) {
      return "pending" as const;
    }
    if (isConfirming) {
      return "confirming" as const;
    }
    if (isConfirmed) {
      return "success" as const;
    }
    return "idle" as const;
  }, [error, isConfirmed, isConfirming, isPending]);

  return {
    state: state,
    error,
    writeContract,
    tx: mergedHash,
    address,
  };
};
