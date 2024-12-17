import mongoose from "mongoose";
import { CategoryCreateBody, ICategory } from "../types";

interface SubCategory extends ICategory {
  children: Array<SubCategory>;
}

export const getFormattedCategories = (
  data: Array<ICategory>,
  rootId?: string
) => {
  //build object where doc id is key and all of its children as array of value

  const dataObj: { [key: string]: Array<ICategory> } = {};
  // maintain map to store docs agains its keys
  const map: Map<string, ICategory> = new Map();
  // if root passed consider to build the complete tree
  let root: string;
  for (const doc of data) {
    const parentId: string = doc["parent"] as unknown as string;
    map.set((doc["_id"] as string).toString(), doc);
    if (!Object.prototype.hasOwnProperty.call(dataObj, doc["_id"] as string)) {
      dataObj[doc["_id"] as string] = [];
    }
    if (
      !Object.prototype.hasOwnProperty.call(dataObj, parentId) &&
      parentId !== null
    ) {
      dataObj[parentId as string] = [];
    }
    if (parentId != null) dataObj[parentId].push(doc);
    
    if (doc?.isRoot) {
      root = (doc._id as string).toString();
    }
    console.log((doc._id as mongoose.Types.ObjectId).toString());
  }

  // @ts-expect-error ignored

  rootId = rootId ? rootId : root;
  console.log("root  id is ", rootId);
  const tree = buildTree(dataObj, map, rootId as string);

  return tree;
};
//perform DFS to build tree structred json
const buildTree = (
  dataObj: { [key: string]: Array<ICategory> },
  map: Map<string, ICategory>,
  rootId: string
): SubCategory => {
  const curCategoryId = rootId.toString();
  if (dataObj[curCategoryId].length == 0) {
    return {
      ...map.get(rootId),
      children: [],
    } as unknown as SubCategory;
  }

  console.log(map.get(rootId));
  // @ts-expect-error ignored

  const curCategory: SubCategory = {
    ...map.get(rootId),
    children: [],
  };
  for (const doc of dataObj[curCategoryId]) {
    const subCategory: SubCategory = buildTree(
      dataObj,
      map,
      (doc._id as string).toString()
    );
    curCategory.children.push(subCategory);
  }
  return curCategory;
};

export const getFormattedCategoryReqBody=(data:CategoryCreateBody)=>{
    return {
        name:data.categoryName,
        parent:data.categoryParentId
    }
}

// export const getFormattedUpdateReqBody=(data:CategoryUpdateBody)=>{
//     return {
//         name:data.categoryName
//     }
// }

