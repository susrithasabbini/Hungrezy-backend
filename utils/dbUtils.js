import mongoose from "mongoose";

const stringToObjectId = (string) => {
  return new mongoose.Types.ObjectId(string);
};

const getDateQuery = (date) => {
  let query = {};
  const today = new Date();
  if (date === "all") {
    return query;
  }
  if (date === "today") {
    query = {
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    };
  }
  if (date === "last-week") {
    query = {
      createdAt: {
        $gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        ),
      },
    };
  }
  if (date === "last-month") {
    query = {
      createdAt: {
        $gte: new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        ),
      },
    };
  }
  if (date === "last-year") {
    query = {
      createdAt: {
        $gte: new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        ),
      },
    };
  }
  return query;
};

export { stringToObjectId, getDateQuery };
