import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { appRouter } from "@/server/root";
import { createTRPCContext } from "@/server/trpc";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({
    headers: heads,
  } as Parameters<typeof createTRPCContext>[0]);
});

export const api = appRouter.createCaller(createContext);
