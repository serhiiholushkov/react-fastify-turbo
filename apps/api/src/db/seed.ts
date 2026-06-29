import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { reset } from "drizzle-seed";
import { assignees, priorities, projects, statuses, tasks } from "./schema.js";

const tables = { assignees, priorities, projects, statuses, tasks };

const connectionString = process.env.DATABASE_URL ?? "";
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema: tables });

async function main() {
  await reset(db, tables);

  // Insert lookup tables directly to guarantee each row's columns stay in sync.
  // drizzle-seed's valuesFromArray uses an independent PRNG per column, which
  // causes slug/name/etc. to be picked from different indices for the same row.

  await db.insert(assignees).values([
    {
      slug: "lena-brightwood",
      name: "Lena Brightwood",
      email: "lena.brightwood@example.com",
    },
    {
      slug: "marcus-vane",
      name: "Marcus Vane",
      email: "marcus.vane@example.com",
    },
    {
      slug: "sofia-cresthaven",
      name: "Sofia Cresthaven",
      email: "sofia.cresthaven@example.com",
    },
    {
      slug: "orion-blackwell",
      name: "Orion Blackwell",
      email: "orion.blackwell@example.com",
    },
  ]);

  await db.insert(priorities).values([
    { slug: "no-priority", name: "No Priority", order: 0 },
    { slug: "critical", name: "Critical", order: 1 },
    { slug: "high", name: "High", order: 2 },
    { slug: "normal", name: "Normal", order: 3 },
    { slug: "low", name: "Low", order: 4 },
  ]);

  await db.insert(projects).values([
    {
      slug: "platform",
      key: "PLT",
      name: "Platform",
      description: "Core infrastructure, build tooling, and API services.",
    },
    {
      slug: "portal",
      key: "PRT",
      name: "Customer Portal",
      description: "Customer-facing web portal with dashboards and reports.",
    },
    {
      slug: "design-system",
      key: "DS",
      name: "Design System",
      description: "Shared component library built on Tailwind CSS.",
    },
  ]);

  await db.insert(statuses).values([
    { slug: "backlog", name: "Backlog", color: "#94a3b8" },
    { slug: "todo", name: "Todo", color: "#64748b" },
    { slug: "in-progress", name: "In Progress", color: "#3b82f6" },
    { slug: "in-review", name: "In Review", color: "#a855f7" },
    { slug: "blocked", name: "Blocked", color: "#ef4444" },
    { slug: "done", name: "Done", color: "#22c55e" },
  ]);

  // After reset, serial IDs are assigned sequentially from 1 in insertion order:
  //   projects:   1=Platform(PLT)  2=Portal(PRT)  3=DesignSystem(DS)
  //   statuses:   1=backlog  2=todo  3=in-progress  4=in-review  5=blocked  6=done
  //   priorities: 1=no-priority  2=critical  3=high  4=normal  5=low
  //   assignees:  1=lena  2=marcus  3=sofia  4=orion
  const descriptions: [string, string, string, string, string] = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt. Mollit anim id est laborum et dolorum fuga.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis. Praesentium voluptatum deleniti atque corrupti quos dolores.",
  ];

  await db.insert(tasks).values([
    // Platform (projectId 1)
    {
      slug: "PLT-1",
      projectId: 1,
      statusId: 3,
      priorityId: 2,
      assigneeId: 1,
      title: "Set up CI/CD pipeline with GitHub Actions",
      description: descriptions[0],
      createdAt: new Date("2026-01-05"),
    },
    {
      slug: "PLT-2",
      projectId: 1,
      statusId: 6,
      priorityId: 3,
      assigneeId: 2,
      title: "Configure Docker multi-stage build for API",
      description: descriptions[1],
      createdAt: new Date("2026-01-12"),
    },
    {
      slug: "PLT-3",
      projectId: 1,
      statusId: 2,
      priorityId: 3,
      assigneeId: 3,
      title: "Add rate limiting middleware to Fastify",
      description: descriptions[2],
      createdAt: new Date("2026-01-20"),
    },
    {
      slug: "PLT-4",
      projectId: 1,
      statusId: 6,
      priorityId: 4,
      assigneeId: 4,
      title: "Implement request logging with correlation IDs",
      description: descriptions[3],
      createdAt: new Date("2026-01-28"),
    },
    {
      slug: "PLT-5",
      projectId: 1,
      statusId: 1,
      priorityId: 4,
      assigneeId: 1,
      title: "Set up Redis caching layer",
      description: descriptions[4],
      createdAt: new Date("2026-02-04"),
    },
    {
      slug: "PLT-6",
      projectId: 1,
      statusId: 1,
      priorityId: 5,
      assigneeId: 2,
      title: "Add database backup automation",
      description: descriptions[0],
      createdAt: new Date("2026-02-11"),
    },
    {
      slug: "PLT-7",
      projectId: 1,
      statusId: 6,
      priorityId: 4,
      assigneeId: 3,
      title: "Configure health check endpoints",
      description: descriptions[1],
      createdAt: new Date("2026-02-18"),
    },
    {
      slug: "PLT-8",
      projectId: 1,
      statusId: 3,
      priorityId: 3,
      assigneeId: 4,
      title: "Implement graceful shutdown handling",
      description: descriptions[2],
      createdAt: new Date("2026-02-25"),
    },
    {
      slug: "PLT-9",
      projectId: 1,
      statusId: 2,
      priorityId: 4,
      assigneeId: 1,
      title: "Add API versioning strategy",
      description: descriptions[3],
      createdAt: new Date("2026-03-04"),
    },
    {
      slug: "PLT-10",
      projectId: 1,
      statusId: 1,
      priorityId: 5,
      assigneeId: 2,
      title: "Set up feature flag system",
      description: descriptions[4],
      createdAt: new Date("2026-03-11"),
    },
    {
      slug: "PLT-11",
      projectId: 1,
      statusId: 5,
      priorityId: 2,
      assigneeId: 3,
      title: "Configure load balancer settings",
      description: descriptions[0],
      createdAt: new Date("2026-03-18"),
    },
    {
      slug: "PLT-12",
      projectId: 1,
      statusId: 4,
      priorityId: 4,
      assigneeId: 4,
      title: "Add metrics collection with Prometheus",
      description: descriptions[1],
      createdAt: new Date("2026-03-25"),
    },
    // Customer Portal (projectId 2)
    {
      slug: "PRT-1",
      projectId: 2,
      statusId: 3,
      priorityId: 3,
      assigneeId: 1,
      title: "Build dashboard overview page",
      description: descriptions[2],
      createdAt: new Date("2026-04-01"),
    },
    {
      slug: "PRT-2",
      projectId: 2,
      statusId: 6,
      priorityId: 4,
      assigneeId: 2,
      title: "Implement data export to CSV",
      description: descriptions[3],
      createdAt: new Date("2026-04-08"),
    },
    {
      slug: "PRT-3",
      projectId: 2,
      statusId: 2,
      priorityId: 5,
      assigneeId: 3,
      title: "Add notification preferences UI",
      description: descriptions[4],
      createdAt: new Date("2026-04-15"),
    },
    {
      slug: "PRT-4",
      projectId: 2,
      statusId: 1,
      priorityId: 4,
      assigneeId: 4,
      title: "Create report scheduling feature",
      description: descriptions[0],
      createdAt: new Date("2026-04-22"),
    },
    {
      slug: "PRT-5",
      projectId: 2,
      statusId: 4,
      priorityId: 3,
      assigneeId: 1,
      title: "Add custom date range picker",
      description: descriptions[1],
      createdAt: new Date("2026-04-29"),
    },
    {
      slug: "PRT-6",
      projectId: 2,
      statusId: 3,
      priorityId: 4,
      assigneeId: 2,
      title: "Implement drag-and-drop kanban board",
      description: descriptions[2],
      createdAt: new Date("2026-05-06"),
    },
    {
      slug: "PRT-7",
      projectId: 2,
      statusId: 1,
      priorityId: 3,
      assigneeId: 3,
      title: "Build customer onboarding wizard",
      description: descriptions[3],
      createdAt: new Date("2026-05-13"),
    },
    // Design System (projectId 3)
    {
      slug: "DS-1",
      projectId: 3,
      statusId: 6,
      priorityId: 4,
      assigneeId: 4,
      title: "Create avatar upload component",
      description: descriptions[4],
      createdAt: new Date("2026-05-15"),
    },
    {
      slug: "DS-2",
      projectId: 3,
      statusId: 6,
      priorityId: 5,
      assigneeId: 1,
      title: "Add icon library integration",
      description: descriptions[0],
      createdAt: new Date("2026-05-19"),
    },
    {
      slug: "DS-3",
      projectId: 3,
      statusId: 3,
      priorityId: 3,
      assigneeId: 2,
      title: "Build data table with sorting and filters",
      description: descriptions[1],
      createdAt: new Date("2026-05-22"),
    },
    {
      slug: "DS-4",
      projectId: 3,
      statusId: 6,
      priorityId: 4,
      assigneeId: 3,
      title: "Implement dark mode toggle",
      description: descriptions[2],
      createdAt: new Date("2026-05-26"),
    },
    {
      slug: "DS-5",
      projectId: 3,
      statusId: 4,
      priorityId: 3,
      assigneeId: 4,
      title: "Create accessible modal component",
      description: descriptions[3],
      createdAt: new Date("2026-05-29"),
    },
    {
      slug: "DS-6",
      projectId: 3,
      statusId: 2,
      priorityId: 5,
      assigneeId: 1,
      title: "Add skeleton loading states",
      description: descriptions[4],
      createdAt: new Date("2026-06-01"),
    },
  ]);

  console.log("Database seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
