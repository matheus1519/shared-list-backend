const express = require("express");

const routes = express.Router();

let list = [];

routes.get("/list", (request, response) => {
  return response.json({ list });
});

routes.post("/item", (request, response) => {
  const { item } = request.body;

  if (item === undefined) {
    return response.status(404).json({ message: 'not found proprety "item"' });
  }

  const itemCapitalized = item.charAt(0).toUpperCase() + item.slice(1);

  list.push({
    name: itemCapitalized,
    checked: false,
  });

  request.io.emit("newList", list);

  return response.status(201).json({ message: "success" });
});

routes.put("/item", (request, response) => {
  const { index, checked } = request.body;

  list[index].checked = checked;

  request.io.emit("newList", list);

  return response.status(201).json({ message: "success" });
});

module.exports = routes;
