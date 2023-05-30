import React from "react";
import ReactDOM from "react-dom";
import ExamplePairings from "./ExamplePairings";
import examples from "@open-rpc/examples";
import refParser from "json-schema-ref-parser";
import { OpenrpcDocument, ExamplePairingObject, MethodObject } from "@open-rpc/meta-schema";
import {
  cleanup,
  fireEvent,
  render,
} from "@testing-library/react";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExamplePairings />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders empty with no example", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExamplePairings />, div);
  expect(div.innerHTML).toBe("");
  ReactDOM.unmountComponentAtNode(div);
});

it("renders empty with empty example", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExamplePairings examples={[]} />, div);
  expect(div.innerHTML).toBe("");
  ReactDOM.unmountComponentAtNode(div);
});

it("renders examples", async () => {
  const div = document.createElement("div");
  const simpleMath = await refParser.dereference(examples.simpleMath as any) as OpenrpcDocument;

  const method = simpleMath.methods[0] as MethodObject;
  ReactDOM.render(
    <ExamplePairings
      method={method}
      examples={method.examples as ExamplePairingObject[]
      } />
    , div);
  expect(div.innerHTML.includes("simpleMathAdditionTwo")).toBe(true);
  expect(div.innerHTML.includes("2")).toBe(true);
  expect(div.innerHTML.includes("4")).toBe(true);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders examples with only schema examples and no method with multiple number examples", async () => {
  const div = document.createElement("div");
  const testDoc: OpenrpcDocument = {
    info: {
      title: "test",
      version: "0.0.0",
    },
    methods: [
      {
        name: "test-method",
        params: [{
          name: "testparam1",
          schema: {
            examples: [10101, 102],
            type: "number",
          },
        }],
        result: {
          name: "test-method-result",
          schema: {
            examples: ["potato", "bar"],
            type: "string",
          },
        },
      },
    ],
    openrpc: "1.0.0",
  };

  const method = testDoc.methods[0] as MethodObject;
  ReactDOM.render(
    <ExamplePairings
      examples={method.examples as ExamplePairingObject[]
      } />
    , div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders examples and can switch between them", async () => {
  const simpleMath = await refParser.dereference(examples.simpleMath as any) as OpenrpcDocument;
  const method = simpleMath.methods[0] as MethodObject;
  const { getByText, getByTestId, getAllByTestId } = render(
    <ExamplePairings
      method={method}
      examples={method.examples as ExamplePairingObject[]
      } />,
  );
  const node = getByTestId('example-pairing-select');
  fireEvent.change(node, { target: { value: '1' } });
  let options = getAllByTestId('example-pairing-option');
  if (!options || !options[1]) {
    throw new Error("Expected two options");
  }
  expect((options[1] as HTMLOptionElement).selected).toBeTruthy();
  cleanup();
});

it("renders examples by-name", async () => {
  const div = document.createElement("div");
  const petstoreByName = await refParser.dereference(examples.petstoreByName as any) as OpenrpcDocument;
  const method = petstoreByName.methods[0] as MethodObject;
  ReactDOM.render(
    <ExamplePairings
      method={method}
      examples={method.examples as ExamplePairingObject[]
    } />, div);
  expect(div.innerHTML).toContain("limit");
  expect(div.innerHTML).toContain("1");
});
