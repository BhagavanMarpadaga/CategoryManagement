import Catergoy from "../models/catergory";
import {
  getFormattedCategories,
  getFormattedCategoryReqBody,
} from "../utils/dataFormatter";
import {
  validateCategory,
  validateCategoryForUpdate,
  validateCategoryId,
  validateRoot,
} from "../utils/validators";
import { handleError } from "../utils/errorFormatter";
import { Request, Response } from "express";
import mongoose from "mongoose";
type MongoQueryFilter = {
  _id: {
    $eq: string;
  };
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    if (req.body.isRoot && (req.body.isRoot || req.body.isRoot === "true")) {
      const findRoot = await Catergoy.findOne({ isRoot: true });
      if (!findRoot) {
        const { categoryName } = req.body;
        validateRoot.parse(req.body);
        const createRoot = new Catergoy({
          name: categoryName,
          isRoot: true,
        });
        const createRootRes = await createRoot.save();
        res.json({
          message: "Category added succcessfully",
          data: createRootRes,
        });
      } else {
        throw new Error("You are not allowed to create root");
      }
      return;
    }

    validateCategory.parse(req.body);
    const { categoryParentId } = req.body;
    //validate parent exists in db before creating a new category
    const parentDoc = await Catergoy.findById(categoryParentId);
    if (!parentDoc) {
      throw new Error("Invalid Parent Category");
    }
    const newCategory = new Catergoy(getFormattedCategoryReqBody(req.body));
    const savedCategory = await newCategory.save();

    res.json({ message: "Category added succcessfully", data: savedCategory });
  } catch (err) {
    console.log(err);
    const formattedError = handleError(err);
    res.status(formattedError.statusCode).json({ error: formattedError.error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    validateCategoryId.parse(req.query);
    const { categoryId } = req.query;
    if (!categoryId) {
      throw new Error("Invalid Value provided for category");
    }
    const categoryData = await Catergoy.findById(categoryId);
    res.json({ message: "Category fetched succcessfully", data: categoryData });
  } catch (err) {
    console.log(err);
    const formattedError = handleError(err);
    res.status(formattedError.statusCode).json({ error: formattedError.error });
  }
};

export const getCategoryChildren = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;

    //if category id found then return only that category tree
    let data;
    if (!categoryId) {
      data = await Catergoy.aggregate([
        {
          $group: {
            _id: null,
            descendants: {
              $push: "$$ROOT",
            },
          },
        },
      ]);
      if(data.length!==0){
        const descendants = data[0]["descendants"];
        data = getFormattedCategories(descendants);
      }
      
    } else {
      const rootId = categoryId as string;
      //verfiy the the category providded is valid or not
      const curCategoryData = await Catergoy.findById(categoryId);
      if (!curCategoryData) {
        throw new Error("Invalid Category id provided");
      }
      data = await Catergoy.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(categoryId as string),
          },
        },
        {
          $graphLookup: {
            from: "categories",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent",
            as: "descendants",
          },
        },
      ]);
      if(data.length!==0){
        const descendants = data[0]["descendants"];
        delete data[0]["descendants"];
        data = [...data, ...descendants];
        data = getFormattedCategories(data, rootId);
      }
    }

    res.json({ message: "", data: data });
  } catch (err) {
    console.log(err);
    const formattedError = handleError(err);
    res.status(formattedError.statusCode).json({ error: formattedError.error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    validateCategoryForUpdate.parse(req.body);
    const { categoryId, categoryName } = req.body;
    const curCategoryData = await Catergoy.findById(categoryId);
    if (!curCategoryData) {
      throw new Error("Invalid value provided for catergoryId");
    }

    curCategoryData.name = categoryName;
    const UpdateCategoryData = await curCategoryData.save();
    res.json({
      message: "Category updated Successfully",
      data: UpdateCategoryData,
    });
  } catch (err) {
    
    console.log(err);
    const formattedError = handleError(err);
    res.status(formattedError.statusCode).json({ error: formattedError.error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    validateCategoryId.parse(req.query);
    const { categoryId } = req.query;
    const curCategoryData = await Catergoy.findById(categoryId);
    if (!curCategoryData) {
      throw new Error("Invalid value provided for catergoryId");
    }
    let catergoriesToDelete = await Catergoy.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(categoryId as string),
        },
      },
      {
        $graphLookup: {
          from: "categories",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "descendants",
        },
      },
      {
        $project: {
          _id: 0,
          descendantIds: {
            $concatArrays: [["$_id"], "$descendants._id"],
          },
        },
      },
    ]);
    catergoriesToDelete = catergoriesToDelete[0]["descendantIds"];
    const formattedFilter = { $or: [] as Array<MongoQueryFilter> };
    catergoriesToDelete.forEach((category: mongoose.Types.ObjectId) => {
      const curFilter = {
        _id: {
          $eq: category.toString(),
        },
      };
      formattedFilter["$or"].push(curFilter);
    });
    await Catergoy.deleteMany(formattedFilter);
    res.json({ message: "Category deleted Successfully" });
  } catch (err) {
    console.log(err);
    const formattedError = handleError(err);
    res.status(formattedError.statusCode).json({ error: formattedError.error });
  }
};
