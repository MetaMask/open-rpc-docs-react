"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var Documentation_1 = require("./Documentation");
it("renders without crashing", function () {
    var div = document.createElement("div");
    react_dom_1.default.render(<Documentation_1.default schema={{}}/>, div);
    react_dom_1.default.unmountComponentAtNode(div);
});
it("renders without crashing with no schema", function () {
    var div = document.createElement("div");
    react_dom_1.default.render(<Documentation_1.default />, div);
    react_dom_1.default.unmountComponentAtNode(div);
});
it("render contentDescriptors", function () {
    var div = document.createElement("div");
    react_dom_1.default.render(<Documentation_1.default schema={{ components: { contentDescriptors: { Foo: { name: "foo", schema: true } } } }}/>, div);
    expect(div.innerHTML.includes("ContentDescriptors")).toBe(true);
    react_dom_1.default.unmountComponentAtNode(div);
});
it("doesnt render contentDescriptors if uiSchema contentDescriptors hidden is passed", function () {
    var div = document.createElement("div");
    react_dom_1.default.render(<Documentation_1.default schema={{ components: { contentDescriptors: { Foo: { name: "foo", schema: true } } } }} uiSchema={{ contentDescriptors: { "ui:hidden": true } }}/>, div);
    expect(div.innerHTML.includes("ContentDescriptors")).toBe(false);
    react_dom_1.default.unmountComponentAtNode(div);
});
