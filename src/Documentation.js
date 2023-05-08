"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Info_1 = require("./Info/Info");
var Servers_1 = require("./Servers/Servers");
var Methods_1 = require("./Methods/Methods");
var ContentDescriptors_1 = require("./ContentDescriptors/ContentDescriptors");
var Documentation = /** @class */ (function (_super) {
    __extends(Documentation, _super);
    function Documentation(props) {
        return _super.call(this, props) || this;
    }
    Documentation.prototype.render = function () {
        var _a = this.props, schema = _a.schema, uiSchema = _a.uiSchema, reactJsonOptions = _a.reactJsonOptions, onMethodToggle = _a.onMethodToggle;
        if (!schema) {
            return null;
        }
        var shouldShowContentDescriptors = !(uiSchema && uiSchema.contentDescriptors && uiSchema.contentDescriptors["ui:hidden"] === true);
        return (<>
        <Info_1.default schema={schema}/>
        <Servers_1.default servers={schema.servers || []} reactJsonOptions={reactJsonOptions}/>
        <Methods_1.default onMethodToggle={onMethodToggle} schema={schema} uiSchema={uiSchema} reactJsonOptions={reactJsonOptions} methodPlugins={this.props.methodPlugins || []}/>
        {shouldShowContentDescriptors &&
                <ContentDescriptors_1.default schema={schema} uiSchema={uiSchema}></ContentDescriptors_1.default>}
      </>);
    };
    return Documentation;
}(react_1.default.Component));
exports.default = Documentation;
