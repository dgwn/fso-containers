import React from "react";
import { render, screen } from "@testing-library/react";
import Todo from "../Todos/Todo";

test("renders todo", async () => {
  const todo = {
    text: "A task to do",
    done: true
  };

  render(<Todo todo={todo} />);

  const element = screen.getByRole("button");
  expect(element).toHaveTextContent("Delete");
});
