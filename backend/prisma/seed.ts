import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_EMAIL = 'admin@test.com';
const DEFAULT_PASSWORD = '123456';

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: {},
    create: {
      email: DEFAULT_EMAIL,
      passwordHash,
      name: 'Admin',
    },
  });

  const existingTasks = await prisma.task.count({ where: { userId: user.id } });
  if (existingTasks > 0) {
    console.log(`User already has ${existingTasks} tasks. Skipping task seed.`);
    return;
  }

  const now = new Date();
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    data: [
      {
        title: 'Set up project repository',
        description: 'Initialize the repo, configure linting, and add CI checks.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        dueDate: daysFromNow(-6),
        userId: user.id,
      },
      {
        title: 'Design database schema',
        description: 'Model users and tasks, add indexes for common query patterns.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        dueDate: daysFromNow(-4),
        userId: user.id,
      },
      {
        title: 'Build authentication flow',
        description: 'JWT login, protected routes, logout handling on the client.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: daysFromNow(1),
        userId: user.id,
      },
      {
        title: 'Implement task CRUD endpoints',
        description: 'Create, read, update, delete with validation on both ends.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: daysFromNow(2),
        userId: user.id,
      },
      {
        title: 'Add search and filtering',
        description: 'Real-time title search plus status/priority filters.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: daysFromNow(4),
        userId: user.id,
      },
      {
        title: 'Wire up dashboard analytics',
        description: 'Totals, completion chart, upcoming deadlines widget.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: daysFromNow(5),
        userId: user.id,
      },
      {
        title: 'Write API documentation',
        description: 'Document every endpoint with request/response examples.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        dueDate: daysFromNow(7),
        userId: user.id,
      },
      {
        title: 'Review Q2 budget draft',
        description: 'This one slipped — good example of an overdue task.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        dueDate: daysFromNow(-2),
        userId: user.id,
      },
      {
        title: 'Prepare demo environment',
        description: 'Seed realistic data and double check environment variables.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        dueDate: daysFromNow(9),
        userId: user.id,
      },
      {
        title: 'Configure Docker Compose stack',
        description: 'App, API, and Postgres running together for local dev.',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        dueDate: daysFromNow(-1),
        userId: user.id,
      },
    ],
  });

  console.log('Seed complete.');
  console.log(`Login with ${DEFAULT_EMAIL} / ${DEFAULT_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
