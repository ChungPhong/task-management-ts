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
