import http from "k6/http";
import { check, sleep } from "k6";
import * as faker from "https://raw.githubusercontent.com/Marak/faker.js/9c65e5dd4902dbdf12088c36c098a9d7958afe09/dist/faker.min.js";

export let options = {
  stages: [
    { duration: "30s", target: 1 },
    { duration: "2m30s", target: 10 },
    { duration: "30s", target: 0 },
  ],
};

const CREATED_TODO_COUNT = 10; // 5000;

export function setup() {
  const todoIds = [];

  for (let i = 0; i < CREATED_TODO_COUNT; i++) {
    const id = createTodo();
    todoIds.push(id);
  }

  return todoIds;
}

export default function (todoIds) {
  //  console.log("vu", JSON.stringify({ data }));
  todoIds.forEach((id) => {
    getTodo(id);
  });
  sleep(0.25);
  // temporary
  const newId = createTodo();
  sleep(0.25);
  getTodo(newId);
  sleep(0.25);
  deleteTodo(newId);
}

export function teardown(todoIds) {
  todoIds.forEach((id) => {
    deleteTodo(id);
  });
}

/**
 * Helpers
 */
const random = () => {
  return {
    text: faker.lorem.sentence(),
  };
};

const url = "http://localhost/api/todos";

const createTodo = () => {
  const payload = JSON.stringify(random());

  const result = http.post(url, payload, {
    tags: { name: "Post" },
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(result, { "status was 201": (r) => r.status == 201 });

  const created = JSON.parse(result.body);
  return created.id;
};

const getTodo = (id) => {
  const res = http.get(url + "/" + id, { tags: { name: "Get" } });
  check(res, { "status was 200": (r) => r.status == 200 });
  return res;
};

const deleteTodo = (id) => {
  const res = http.del(url + "/" + id, { tags: { name: "Delete" } });
  check(res, { "status was 200": (r) => r.status == 204 });
};
