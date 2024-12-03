import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createVendor = async (req: any) => {
  const { file, body } = req;
  let shopLogoUrl: string | null = null;

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

  const result = await prisma.vendor.create({
    data: vendorData,
  });
  return result;
};

export const vendorService = {
  createVendor,
};
