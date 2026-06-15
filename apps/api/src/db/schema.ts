import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---- Assignees ----

export const assignees = pgTable("assignees", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const assigneesRelations = relations(assignees, ({ many }) => ({
  tasks: many(tasks),
}));

// ---- Priorities ----

export const priorities = pgTable("priorities", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order").notNull(),
});

export const prioritiesRelations = relations(priorities, ({ many }) => ({
  tasks: many(tasks),
}));

// ---- Projects ----

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

// ---- Statuses ----

export const statuses = pgTable("statuses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
});

export const statusesRelations = relations(statuses, ({ many }) => ({
  tasks: many(tasks),
}));

// ---- Tasks ----

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  statusId: integer("status_id")
    .notNull()
    .references(() => statuses.id),
  priorityId: integer("priority_id")
    .notNull()
    .references(() => priorities.id),
  assigneeId: integer("assignee_id").references(() => assignees.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  status: one(statuses, {
    fields: [tasks.statusId],
    references: [statuses.id],
  }),
  priority: one(priorities, {
    fields: [tasks.priorityId],
    references: [priorities.id],
  }),
  assignee: one(assignees, {
    fields: [tasks.assigneeId],
    references: [assignees.id],
  }),
}));
