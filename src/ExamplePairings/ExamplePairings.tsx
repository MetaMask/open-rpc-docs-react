import ExamplePairing from "../ExamplePairing/ExamplePairing";
import { MethodObject, ExamplePairingObject, ContentDescriptorObject, MethodObjectParamStructure, MethodObjectExamples } from "@open-rpc/meta-schema";
import React, { Component, useEffect} from "react";

interface IProps {
  method?: MethodObject;
  examples?: ExamplePairingObject[];
  onExamplePairingChange?: (examplePairing: ExamplePairingObject) => void;
  uiSchema?: any;
  reactJsonOptions?: any;
}




const ExamplePairings = ({method, examples, uiSchema, reactJsonOptions, onExamplePairingChange}: IProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const paramStructure = method && method.paramStructure as MethodObjectParamStructure || "either";

    const optionElements = examples?.map((example, i) => (
      <option key={example.name} value={i}>
        {example.name}
      </option>
    ));

    function handleOptionChange(event: React.ChangeEvent<HTMLSelectElement>) {
      const index = parseInt(event.target.value);
      setSelectedIndex(index);
      if (onExamplePairingChange && examples) {
        onExamplePairingChange(examples[index]);
      }
    }

    // useEffect(() => {
    //   if (onExamplePairingChange) {
    //     onExamplePairingChange(ex[selectedIndex]);
    //   }
    // }, []);

    return (
      <div>
        <select value={selectedIndex} onChange={handleOptionChange}>
          {optionElements}
        </select>
        {examples &&
         <ExamplePairing
           uiSchema={uiSchema}
           paramStructure={paramStructure}
           examplePairing={examples[selectedIndex] as ExamplePairingObject}
           methodName={method && method.name as any}
           reactJsonOptions={reactJsonOptions} />}
      </div>
    );
};

export default ExamplePairings;
