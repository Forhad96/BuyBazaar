import prisma from "../../../shared/prisma";

const createCategory = async(payload: any) => {
    const result =await prisma.category.create({
        data: payload
    })
return result
};

const updateCategory =async (id: string, payload: any) => {
    const result = await prisma.category.update({
        where: {id},
        data: payload
    })
    return result
};

export const CategoryServices = {
    createCategory,
    updateCategory
}