import React, { Component } from "react";
import ReactJson from "react-json-view";
import ReactMarkdown from "react-markdown";
import { ExampleObject, ExamplePairingObject, MethodObjectParamStructure, ExamplePairingObjectResult } from "@open-rpc/meta-schema";
import _ from "lodash";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";

interface IProps {
  examplePairing?: ExamplePairingObject;
  paramStructure?: MethodObjectParamStructure;
  methodName?: string;
  uiSchema?: any;
  reactJsonOptions?: any;
}

class ExamplePairing extends Component<IProps, {}> {
  public render() {
    const { examplePairing, paramStructure, methodName, uiSchema } = this.props;
    if (_.isUndefined(examplePairing)) {
      return null;
    }
    if (_.isUndefined(methodName)) {
      return null;
    }
    const params = paramStructure === "by-name"
      ? (examplePairing.params as ExampleObject[]).reduce(((memo, p) => {
        memo[p.name] = p.value;
        return memo;
      }), {} as any)
      : (examplePairing.params as ExampleObject[]).map(((p) => p.value));

    return (
      <div>
        <div>
          <MarkdownDescription
            uiSchema={uiSchema}
            source={examplePairing.description || ""}
            className="example-pairing-description"
          />
        </div>
        <div>
          <div>
            <span>Request</span>
            <div>
              {examplePairing.params && <ReactJson src={{
                id: 1,
                jsonrpc: "2.0",
                method: methodName,
                params,
              }} {...this.props.reactJsonOptions} />}
            </div>
          </div>
        </div>
        <div>
          <div>
            <span>Result</span>
            <div>
              {examplePairing.result && <ReactJson src={{
                id: 1,
                jsonrpc: "2.0",
                result: (examplePairing.result as ExampleObject).value,
              }} {...this.props.reactJsonOptions} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExamplePairing;
