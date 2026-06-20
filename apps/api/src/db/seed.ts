import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { seed, reset } from "drizzle-seed";
import { assignees, priorities, projects, statuses, tasks } from "./schema.js";

const tables = { assignees, priorities, projects, statuses, tasks };

const connectionString = process.env.DATABASE_URL ?? "";
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema: tables });

async function main() {
  await reset(db, tables);

  await seed(db, tables).refine((f) => ({
    assignees: {
      count: 4,
      columns: {
        slug: f.valuesFromArray({
          values: [
            "lena-brightwood",
            "marcus-vane",
            "sofia-cresthaven",
            "orion-blackwell",
          ],
        }),
        name: f.valuesFromArray({
          values: [
            "Lena Brightwood",
            "Marcus Vane",
            "Sofia Cresthaven",
            "Orion Blackwell",
          ],
        }),
        email: f.valuesFromArray({
          values: [
            "lena.brightwood@example.com",
            "marcus.vane@example.com",
            "sofia.cresthaven@example.com",
            "orion.blackwell@example.com",
          ],
        }),
      },
    },

    priorities: {
      count: 5,
      columns: {
        slug: f.valuesFromArray({
          values: ["no-priority", "critical", "high", "normal", "low"],
        }),
        name: f.valuesFromArray({
          values: ["No Priority", "Critical", "High", "Normal", "Low"],
        }),
        order: f.valuesFromArray({ values: [0, 1, 2, 3, 4] }),
      },
    },

    projects: {
      count: 3,
      columns: {
        slug: f.valuesFromArray({
          values: ["platform", "portal", "design-system"],
        }),
        key: f.valuesFromArray({ values: ["PLT", "PRT", "DS"] }),
        name: f.valuesFromArray({
          values: ["Platform", "Customer Portal", "Design System"],
        }),
        description: f.valuesFromArray({
          values: [
            "Core infrastructure, build tooling, and API services.",
            "Customer-facing web portal with dashboards and reports.",
            "Shared component library built on Tailwind CSS.",
          ],
        }),
      },
    },

    statuses: {
      count: 6,
      columns: {
        slug: f.valuesFromArray({
          values: [
            "backlog",
            "todo",
            "in-progress",
            "in-review",
            "blocked",
            "done",
          ],
        }),
        name: f.valuesFromArray({
          values: [
            "Backlog",
            "Todo",
            "In Progress",
            "In Review",
            "Blocked",
            "Done",
          ],
        }),
        color: f.valuesFromArray({
          values: [
            "#94a3b8",
            "#64748b",
            "#3b82f6",
            "#a855f7",
            "#ef4444",
            "#22c55e",
          ],
        }),
      },
    },

    tasks: {
      count: 25,
      columns: {
        slug: f.valuesFromArray({
          values: [
            "PLT-1",
            "PLT-2",
            "PLT-3",
            "PLT-4",
            "PLT-5",
            "PLT-6",
            "PLT-7",
            "PLT-8",
            "PLT-9",
            "PLT-10",
            "PLT-11",
            "PLT-12",
            "PRT-1",
            "PRT-2",
            "PRT-3",
            "PRT-4",
            "PRT-5",
            "PRT-6",
            "PRT-7",
            "DS-1",
            "DS-2",
            "DS-3",
            "DS-4",
            "DS-5",
            "DS-6",
          ],
          isUnique: true,
        }),
        title: f.valuesFromArray({
          values: [
            "Set up CI/CD pipeline with GitHub Actions",
            "Configure Docker multi-stage build for API",
            "Add rate limiting middleware to Fastify",
            "Implement request logging with correlation IDs",
            "Set up Redis caching layer",
            "Add database backup automation",
            "Configure health check endpoints",
            "Implement graceful shutdown handling",
            "Add API versioning strategy",
            "Set up feature flag system",
            "Configure load balancer settings",
            "Add metrics collection with Prometheus",
            "Build dashboard overview page",
            "Implement data export to CSV",
            "Add notification preferences UI",
            "Create report scheduling feature",
            "Add custom date range picker",
            "Implement drag-and-drop kanban board",
            "Build customer onboarding wizard",
            "Create avatar upload component",
            "Add icon library integration",
            "Build data table with sorting and filters",
            "Implement dark mode toggle",
            "Create accessible modal component",
            "Add skeleton loading states",
          ],
        }),
        description: f.loremIpsum({ sentencesCount: 2 }),
        createdAt: f.date({ minDate: "2026-01-01", maxDate: "2026-06-01" }),
      },
    },
  }));

  console.log("Database seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
