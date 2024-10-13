import { Request, Response } from "express";
import Task from "../model/task.model";
import paginationHelpers from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index = async (req: Request, res: Response) => {
  //Find
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
  }
  const find: Find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status.toString();
  }
  //END Find

  // //Sort
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  }
  // //END Sort

  //PAGINATION
  let initPagination = {
    currentPage: 1,
    limitPage: 3,
  };
  const countTask = await Task.countDocuments(find);
  const objectPagination = paginationHelpers(
    initPagination,
    req.query,
    countTask
  );
  //END PAGINATION

  //SEARCH
  const objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }

  //END SEARCH

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skip);
  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({
    deleted: false,
    _id: id,
  });
  res.json(task);
};

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const status: string = req.body.status;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi/
export const changeMulti = async (req, res) => {
  try {
    const ids: string[] = req.body.ids;
    const key: string = req.body.key; // any
    const value: string = req.body.value;

    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};
