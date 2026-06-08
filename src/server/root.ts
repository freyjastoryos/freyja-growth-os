import { createTRPCRouter } from "./trpc";
import { subscribersRouter } from "./routers/subscribers";
import { landingPagesRouter } from "./routers/landing-pages";
import { sequencesRouter } from "./routers/sequences";
import { repurposeRouter } from "./routers/repurpose";

export const appRouter = createTRPCRouter({
  subscribers: subscribersRouter,
  landingPages: landingPagesRouter,
  sequences: sequencesRouter,
  repurpose: repurposeRouter,
});

export type AppRouter = typeof appRouter;
