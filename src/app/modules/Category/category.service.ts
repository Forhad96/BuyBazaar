import prisma from "../../../shared/prisma";

//get all categories
const getAllCategories =async () => {
    const result = await prisma.category.findMany()
    return result
}

// create a new category
const createCategory = async(payload: any) => {
    const result =await prisma.category.createMany({
        data: payload
    })
return result
};

// update a category
const updateCategory =async (id: string, payload: any) => {
    const result = await prisma.category.update({
        where: {id},
        data: payload
    })
    return result
};

// delete a category
const deleteCategory =async (id: string) => {
    const result = await prisma.category.delete({
        where: {id}
    })
    return result   
}
export const CategoryServices = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
}