import { UserRole, UserStatus } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";


const createVendor = async (req: any) => {
  const { file, body } = req;
  let shopLogoUrl: string | null = null;

  // Get user information
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: req.user?.email,
      status: UserStatus.Active,
    },
  });

  // Handle file upload if a file is provided
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    shopLogoUrl = uploadedFile?.secure_url || null;
  }

  // Construct vendor data
  const vendorData = {
    ...body,
    shopLogo: shopLogoUrl,
  };

  const result = prisma.$transaction(async (transactionClient) => {
    const vendor = await transactionClient.vendor.create({
      data: vendorData,
    });

    await transactionClient.user.update({
      where: { id: userInfo.id },
      data: { role: UserRole.Vendor },
    });

    return vendor;
  });

  return result;
};

export const vendorService = {
  createVendor,
};
