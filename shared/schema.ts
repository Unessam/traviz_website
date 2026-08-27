import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  legalHold: boolean("legal_hold").notNull().default(false),
  legalHoldReason: text("legal_hold_reason"),
  accessRemovedAt: timestamp("access_removed_at"),
  retentionActionAt: timestamp("retention_action_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content management tables
export const heroContent = pgTable("hero_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  primaryButtonText: varchar("primary_button_text").notNull(),
  secondaryButtonText: varchar("secondary_button_text").notNull(),
  heroImageUrl: text("hero_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  features: text("features").array(),
  useCases: text("use_cases"),
  imageUrl: text("image_url"),
  icon: varchar("icon"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  features: text("features").array(),
  imageUrl: text("image_url"),
  websiteUrl: text("website_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  client: varchar("client").notNull(),
  industry: varchar("industry").notNull(),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  testimonial: text("testimonial"),
  testimonialAuthor: varchar("testimonial_author"),
  testimonialRole: varchar("testimonial_role"),
  imageUrl: text("image_url"),
  metrics: jsonb("metrics"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  authorName: varchar("author_name").notNull(),
  authorRole: varchar("author_role").notNull(),
  authorCompany: varchar("author_company").notNull(),
  authorImageUrl: text("author_image_url"),
  rating: integer("rating").default(5),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  author: varchar("author").notNull(),
  imageUrl: text("image_url"),
  readTime: integer("read_time"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aboutContent = pgTable("about_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  story: text("story").notNull(),
  mission: text("mission").notNull(),
  philosophy: text("philosophy").notNull(),
  values: jsonb("values"),
  founderName: varchar("founder_name").notNull(),
  founderBio: text("founder_bio").notNull(),
  founderImageUrl: text("founder_image_url"),
  founderCredentials: text("founder_credentials").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  company: varchar("company"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  legalHold: boolean("legal_hold").notNull().default(false),
  legalHoldReason: text("legal_hold_reason"),
  notificationStatus: varchar("notification_status").notNull().default("pending"),
  notificationAttempts: integer("notification_attempts").notNull().default(0),
  notificationLastAttemptAt: timestamp("notification_last_attempt_at"),
  notificationFailureCode: varchar("notification_failure_code"),
  notificationClaimToken: varchar("notification_claim_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const retentionRuns = pgTable(
  "retention_runs",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    requestedBy: varchar("requested_by").notNull(),
    referenceTime: timestamp("reference_time").notNull(),
    dryRun: boolean("dry_run").notNull(),
    status: varchar("status").notNull(),
    candidateFingerprint: varchar("candidate_fingerprint").notNull(),
    contactEligible: integer("contact_eligible").notNull().default(0),
    usersEligible: integer("users_eligible").notNull().default(0),
    contactsDeleted: integer("contacts_deleted").notNull().default(0),
    usersAnonymized: integer("users_anonymized").notNull().default(0),
    blockedByLegalHold: integer("blocked_by_legal_hold").notNull().default(0),
    skipped: integer("skipped").notNull().default(0),
    failureCode: varchar("failure_code"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [index("IDX_retention_runs_created_at").on(table.createdAt)],
);

export const retentionAuditEvents = pgTable(
  "retention_audit_events",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    eventType: varchar("event_type").notNull(),
    targetType: varchar("target_type").notNull(),
    targetId: varchar("target_id"),
    actorId: varchar("actor_id").notNull(),
    runId: varchar("run_id"),
    dryRun: boolean("dry_run").notNull().default(false),
    details: jsonb("details").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("IDX_retention_audit_events_created_at").on(table.createdAt),
    index("IDX_retention_audit_events_target").on(table.targetType, table.targetId),
  ],
);

export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hoursSaved: integer("hours_saved"),
  clientsServed: integer("clients_served"),
  roiIncrease: integer("roi_increase"),
  projectsCompleted: integer("projects_completed"),
  yearsExperience: integer("years_experience").default(7),
  hoursSavedAnnually: integer("hours_saved_annually").default(1000),
  industryProjectsCount: varchar("industry_projects_count").default("Multiple"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // pdf, template, guide
  downloadUrl: text("download_url"),
  icon: varchar("icon"),
  isActive: boolean("is_active").default(true),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertHeroContentSchema = createInsertSchema(heroContent);
export const insertServiceSchema = createInsertSchema(services);
export const insertProductSchema = createInsertSchema(products);
export const insertCaseStudySchema = createInsertSchema(caseStudies);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertAboutContentSchema = createInsertSchema(aboutContent);
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const contactFormSubmissionSchema = insertContactSubmissionSchema
  .pick({
    name: true,
    email: true,
    company: true,
    message: true,
  })
  .strict();
export const insertStatsSchema = createInsertSchema(stats);
export const insertResourceSchema = createInsertSchema(resources);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type HeroContent = typeof heroContent.$inferSelect;
export type InsertHeroContent = z.infer<typeof insertHeroContentSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactFormSubmission = z.infer<typeof contactFormSubmissionSchema>;
export type RetentionRun = typeof retentionRuns.$inferSelect;
export type RetentionAuditEvent = typeof retentionAuditEvents.$inferSelect;
export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
