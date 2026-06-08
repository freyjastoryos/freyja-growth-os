import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "agency",
]);

export const subscriberStatusEnum = pgEnum("subscriber_status", [
  "active",
  "unsubscribed",
  "bounced",
  "complained",
]);

export const emailSendStatusEnum = pgEnum("email_send_status", [
  "queued",
  "sent",
  "opened",
  "clicked",
  "bounced",
  "failed",
]);

export const leadMagnetTypeEnum = pgEnum("lead_magnet_type", [
  "pdf",
  "video_url",
  "checklist",
  "link",
]);

export const sequenceTriggerEnum = pgEnum("sequence_trigger", [
  "on_subscribe",
]);

// ─── Creators (users) ────────────────────────────────────────────────────────

export const creators = pgTable("creators", {
  id: uuid("id").primaryKey(), // matches Supabase auth.users.id
  email: text("email").notNull().unique(),
  name: text("name"),
  senderName: text("sender_name"),
  replyToEmail: text("reply_to_email"),
  timezone: text("timezone").notNull().default("UTC"),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .notNull()
    .default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Lead Magnets ─────────────────────────────────────────────────────────────

export const leadMagnets = pgTable("lead_magnets", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  fileUrl: text("file_url"),
  fileType: leadMagnetTypeEnum("file_type").notNull().default("pdf"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Landing Pages ────────────────────────────────────────────────────────────

export const landingPages = pgTable("landing_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  bodyCopy: text("body_copy"),
  ctaText: text("cta_text").notNull().default("Get Free Access"),
  leadMagnetId: uuid("lead_magnet_id").references(() => leadMagnets.id, {
    onDelete: "set null",
  }),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Subscribers ──────────────────────────────────────────────────────────────

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  firstName: text("first_name"),
  source: text("source"), // e.g. landing page slug or "import"
  status: subscriberStatusEnum("status").notNull().default("active"),
  tags: text("tags").array().notNull().default([]),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

// ─── Email Sequences ──────────────────────────────────────────────────────────

export const emailSequences = pgTable("email_sequences", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  trigger: sequenceTriggerEnum("trigger").notNull().default("on_subscribe"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Sequence Emails ──────────────────────────────────────────────────────────

export const sequenceEmails = pgTable("sequence_emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  sequenceId: uuid("sequence_id")
    .notNull()
    .references(() => emailSequences.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  delayDays: integer("delay_days").notNull().default(0),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  bodyText: text("body_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Email Sends ──────────────────────────────────────────────────────────────

export const emailSends = pgTable("email_sends", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriberId: uuid("subscriber_id")
    .notNull()
    .references(() => subscribers.id, { onDelete: "cascade" }),
  sequenceEmailId: uuid("sequence_email_id")
    .notNull()
    .references(() => sequenceEmails.id, { onDelete: "cascade" }),
  status: emailSendStatusEnum("status").notNull().default("queued"),
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  resendId: text("resend_id"),
});

// ─── Repurposed Content ───────────────────────────────────────────────────────

export const repurposedContent = pgTable("repurposed_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.id, { onDelete: "cascade" }),
  sourceContent: text("source_content").notNull(),
  sourceType: text("source_type").notNull().default("essay"),
  generatedPosts: jsonb("generated_posts").$type<
    Array<{ platform: string; text: string; characterCount: number }>
  >(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const creatorsRelations = relations(creators, ({ many }) => ({
  landingPages: many(landingPages),
  leadMagnets: many(leadMagnets),
  subscribers: many(subscribers),
  emailSequences: many(emailSequences),
  repurposedContent: many(repurposedContent),
}));

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  creator: one(creators, {
    fields: [landingPages.creatorId],
    references: [creators.id],
  }),
  leadMagnet: one(leadMagnets, {
    fields: [landingPages.leadMagnetId],
    references: [leadMagnets.id],
  }),
}));

export const subscribersRelations = relations(subscribers, ({ one, many }) => ({
  creator: one(creators, {
    fields: [subscribers.creatorId],
    references: [creators.id],
  }),
  emailSends: many(emailSends),
}));

export const emailSequencesRelations = relations(
  emailSequences,
  ({ one, many }) => ({
    creator: one(creators, {
      fields: [emailSequences.creatorId],
      references: [creators.id],
    }),
    emails: many(sequenceEmails),
  })
);

export const sequenceEmailsRelations = relations(
  sequenceEmails,
  ({ one, many }) => ({
    sequence: one(emailSequences, {
      fields: [sequenceEmails.sequenceId],
      references: [emailSequences.id],
    }),
    sends: many(emailSends),
  })
);

export const emailSendsRelations = relations(emailSends, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [emailSends.subscriberId],
    references: [subscribers.id],
  }),
  sequenceEmail: one(sequenceEmails, {
    fields: [emailSends.sequenceEmailId],
    references: [sequenceEmails.id],
  }),
}));
