import mongoose from "mongoose";
import AppError from "./AppError.js";

class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const excludedFields = ["page", "sort", "limit", "fields"];

    let filterObject = { ...this.queryString };

    console.log(filterObject);

    excludedFields.forEach((el) => delete filterObject[el]);

    this.query = this.query.find(filterObject);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    }
    return this;
  }

  pagination(totalDocumentCounts) {
    const limit = this.queryString.limit * 1 || 5;
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;

    if (skip >= totalDocumentCounts) {
      this.query = new Promise((resolve) => {
        resolve([]);
      });
    } else {
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

export default ApiFeature;
