"use client";
import { Button, ButtonLoading } from "@/components/ui/button";
import Clarity from "@/lib/clarity";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect } from "react";
import { match } from "ts-pattern";
import { useAccount } from "wagmi";

export const ConnectButton = () => {
  const { address, status } = useAccount();
  const { open } = useWeb3Modal();

  useEffect(() => {
    if (status == "connected") {
      Clarity.identify(address, {});
    }
  }, [address, status]);

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
