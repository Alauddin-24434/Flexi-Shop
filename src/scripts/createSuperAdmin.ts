import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = "superadmin@gmail.com";
  const password = "123456";
  const role = "SUPER_ADMIN";

  // Check if the super admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("Super admin already exists");
    return;
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create the super admin user
  const superAdmin = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
      role,
    },
  });

  console.log("Super admin created successfully:", superAdmin);
}

createSuperAdmin()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

//   npx ts-node src/scripts/createSuperAdmin.ts