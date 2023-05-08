import ExamplePairing from "../ExamplePairing/ExamplePairing";
import { MethodObject, ExamplePairingObject, ContentDescriptorObject, MethodObjectParamStructure } from "@open-rpc/meta-schema";
import React, { Component} from "react";

interface IProps {
  method?: MethodObject;
  examples?: ExamplePairingObject[];
  uiSchema?: any;
  reactJsonOptions?: any;
}

const getExamplesFromMethod = (method?: MethodObject): ExamplePairingObject[] => {
  if (!method) { return []; }
  if (!method.params) { return []; }
  const examples: ExamplePairingObject[] = [];

  (method.params as ContentDescriptorObject[]).forEach((param, index: number) => {
    if (param.schema && param.schema.examples && param.schema.examples.length > 0) {
      param.schema.examples.forEach((ex: any, i: number) => {
        const example = examples[i];
        if (example === undefined) {
          examples.push({
            name: "generated-example",
            params: [
              {
                name: param.name,
                value: ex,
              },
            ],
            result: {
              name: "example-result",
              value: null,
            },
          });
        } else {
          example.params.push({
            name: param.name,
            value: ex,
          });
        }
      });
    }
  });
  const methodResult = method.result as ContentDescriptorObject;
  if (methodResult && methodResult.schema && methodResult.schema.examples && methodResult.schema.examples.length > 0) {
    methodResult.schema.examples.forEach((ex: any, i: number) => {
      const example = examples[i];
      if (example === undefined) {
        examples.push({
          name: "generated-example",
          params: [],
          result: {
            name: methodResult.name,
            value: ex,
          },
        });
      } else {
        example.result = {
          name: methodResult.name,
          value: ex,
        };
      }
    });
  }
  return examples;
};

class ExamplePairings extends Component<IProps, {selectedIndex: number }> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  public render() {
    let { method, examples, uiSchema, reactJsonOptions } = this.props;
    examples = examples || getExamplesFromMethod(method);
    if (!examples || examples.length === 0) {
      return null;
    }
    const paramStructure = method && method.paramStructure as MethodObjectParamStructure || "either";

    const selectedExample = examples[this.state.selectedIndex];
    if (selectedExample === undefined) { return null; }

    const optionElements = examples.map((example, i) => (
      <option key={example.name} value={i}>
        {example.name}
      </option>
    ));

    return (
      <div>
        <select value={this.state.selectedIndex} onChange={this.handleOptionChange.bind(this)}>
          {optionElements}
        </select>
        {examples &&
         <ExamplePairing
           uiSchema={uiSchema}
           paramStructure={paramStructure}
           examplePairing={examples[this.state.selectedIndex] as ExamplePairingObject}
           methodName={method && method.name as any}
           reactJsonOptions={reactJsonOptions} />}
      </div>
    );
  }

  private handleOptionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ selectedIndex: parseInt(event.target.value) });
  }}

export default ExamplePairings;
