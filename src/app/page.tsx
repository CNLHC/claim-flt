import { IconBrandGithubFilled, IconBrandX } from "@tabler/icons-react";
import { UnlockStat } from "./client";
import { ConnectButton } from "./components/connect-button";

const Footer = () => {
  return (
    <div className="absolute bottom-0 flex-grow-0 py-2">
      <div className="flex gap-2 items-center font-semibold text-xs">
        <div>Built by CNLHC</div>
        <a href="https://github.com/CNLHC" rel="noreferrer" target="_blank">
          <IconBrandGithubFilled />
        </a>
        <a href="https://twitter.com/cncnlhc" rel="noreferrer" target="_blank">
          <IconBrandX />
        </a>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="relative h-[100vh] flex flex-col items-center">
      <div className="grid place-items-center flex-1 relative">
        <div className="text-center">
          <UnlockStat />
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
