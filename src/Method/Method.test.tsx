import React from "react";
import ReactDOM from "react-dom";
import Method, { IMethodPluginProps } from "./Method";
import { OpenrpcDocument, MethodObject } from "@open-rpc/meta-schema";
import {
  cleanup,
  fireEvent,
  render,
} from "@testing-library/react";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Method method={{name: "foo", params: []}} uiSchema={{}}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders empty with no schema", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Method />, div);
  expect(div.innerHTML).toBe("");
  ReactDOM.unmountComponentAtNode(div);
});

it("renders empty with empty method", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Method method={{} as any} />, div);
  expect(div.innerHTML).toBe("");
  ReactDOM.unmountComponentAtNode(div);
});

it("renders schema methods name", () => {
  const div = document.createElement("div");
  const schema = {
    methods: [
      {
        name: "get_pet",
      },
    ],
  };
  ReactDOM.render(<Method method={schema.methods[0] as any} uiSchema={{}} />, div);
  expect(div.innerHTML.includes("get_pet")).toBe(true);
  ReactDOM.unmountComponentAtNode(div);
});
