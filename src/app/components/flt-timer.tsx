import dayjs from "dayjs";
import { useAtom } from "jotai";
import { unLockAtAtom, useTime } from "../hooks";

export const ClaimCountDown = () => {
  const now = useTime(100);
  const [unlockTs] = useAtom(unLockAtAtom);
  if (unlockTs == null) return null;

  // BigNumber(p.d.toString()).toNumber()
  const unFreezeAt = dayjs.unix(unlockTs);
  const diff = unFreezeAt.diff(dayjs(now), "s");
  const duration = dayjs
    .duration(diff, "s")
    .format("M [mon] DD [days] H [h] mm [m] s [s] ");
  return (
    <div className="text-center">
      <div className="text-sm">
        Unlock at {unFreezeAt.format("YY-MM-DD HH:mm:ss ZZ")}{" "}
      </div>
      <div className="text-xl font-bold font-mono">{duration}</div>
    </div>
  );
};
