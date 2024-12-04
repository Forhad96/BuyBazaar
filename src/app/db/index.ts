import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import { generateHashedPassword } from "../../helpers/bcryptHelper";

async function seedSuperAdmin() {
  const superAdmin = await prisma.user.findFirst({
    where: { role: UserRole.SUPERADMIN },
  });
  const hashedPassword = await generateHashedPassword("password123", 12);
  if (!superAdmin && hashedPassword !== undefined) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: hashedPassword,
        role: "SUPERADMIN",
        status: "ACTIVE",
      },
    });
  }
}

export { seedSuperAdmin };
