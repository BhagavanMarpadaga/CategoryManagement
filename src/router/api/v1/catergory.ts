import express from "express";
import Catergoy from "../../../models/catergory";
import {
  validateCategory,
  validateCategoryForUpdate,
  validateCategoryId,
} from "../../../utils/validators";
import { ZodError } from "zod";
import { formatZodError } from "../../../utils/errorFormatter";
import mongoose from "mongoose";
import {
  getFormattedCategories,
  getFormattedCategoryReqBody,
} from "../../../utils/dataFormatter";

type MongoQueryFilter = {
  _id: {
    $eq: string;
  };
};
const categoryRouter = express.Router();

categoryRouter.post("/", async (req, res) => {
  try {
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
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
    } else if (err instanceof Error) {
      res.status(400).json({ error: `${err.message}` });
    } else {
      res.status(500).json({ error: "something went wrong", err: err });
    }
  }
});

categoryRouter.get("/byId", async (req, res) => {
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
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
    } else if (err instanceof Error) {
      res.status(400).json({ error: `${err.message}` });
    } else {
      res.status(500).json({ error: "something went wrong", err: err });
    }
  }
});

categoryRouter.get("/children", async (req, res) => {
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
      const descendants = data[0]["descendants"];

      data = getFormattedCategories(descendants);
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
      const descendants = data[0]["descendants"];
      delete data[0]["descendants"];
      data = [...data, ...descendants];
      data = getFormattedCategories(data, rootId);
    }

    res.json({ message: "", data: data });
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
    } else if (err instanceof Error) {
      res.status(400).json({ error: `${err.message}` });
    } else {
      res.status(500).json({ error: "something went wrong", err: err });
    }
  }
});
categoryRouter.patch("/", async (req, res) => {
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
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
    } else if (err instanceof Error) {
      res.status(400).json({ error: `${err.message}` });
    } else {
      res.status(500).json({ error: "something went wrong", err: err });
    }
  }
});

categoryRouter.delete("/", async (req, res) => {
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
    if (err instanceof ZodError) {
      res.status(400).json({ error: formatZodError(err) });
    } else if (err instanceof Error) {
      res.status(400).json({ error: `${err.message}` });
    } else {
      res.status(500).json({ error: "something went wrong", err: err });
    }
  }
});

export default categoryRouter;
