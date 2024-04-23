import { Button, ButtonLoading } from "@/components/ui/button";
import { FLTDropABI, FLTDropAddr } from "@/lib/flt/abi";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { match } from "ts-pattern";
import { useFLTUnlock } from "../hooks";

export const UnlockButton = (p: { isLocked: boolean }) => {
  const { state, writeContract, address, error } = useFLTUnlock();

  const unlock = useCallback(() => {
    writeContract({
      address: FLTDropAddr,
      abi: FLTDropABI,
      functionName: "transfer",
      args: [address, BigNumber("5000").shiftedBy(18).toNumber()],
    });
  }, [address, writeContract]);
  return (
    <div>
      {match(state)
        .with("idle", () => (
          <Button onClick={() => unlock()} disabled={p.isLocked}>
            Unlock
          </Button>
        ))
        .with("pending", () => <ButtonLoading>approving</ButtonLoading>)
        .with("error", () => {
          return (
            <div>
              <Button onClick={() => unlock()} disabled={p.isLocked}>
                retry
              </Button>
              {error && (
                <div className="text-sm text-red-500">
                  {`${error.cause}`.replaceAll(/[vV]ersion.*$/g, "")}
                </div>
              )}
            </div>
          );
        })
        .with("confirming", () => <ButtonLoading>confirming</ButtonLoading>)
        .with("success", () => (
          <div>Congratulations! You have claimed your FLT Token</div>
        ))
        .exhaustive()}
    </div>
  );
};
