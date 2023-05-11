import React from "react";
import validator from '@rjsf/validator-ajv8';
import { IconButtonProps,ArrayFieldTemplateProps, RJSFSchema, UiSchema, ArrayFieldTemplateItemType } from '@rjsf/utils';
import { ContentDescriptorObject, MethodObject} from '@open-rpc/meta-schema';
import traverse from "@json-schema-tools/traverse";
import Form from '@rjsf/core';
import ArrayFieldTemplate from '../ArrayFieldTemplate/ArrayFieldTemplate';
import ArrayFieldItemTemplate from '../ArrayFieldItemTemplate/ArrayFieldItemTemplate';

const log = (type: any) => console.log.bind(console, type);
const uiSchema: UiSchema = {
  'ui:description': '',
};

interface Props {
  method: MethodObject;
}


/* function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
 *   console.log(props);
 *   const ArrayFieldItemTemplateFromProps
 *   return (
 *     <div className="container">
 *       <div className="row">
 *         {props.title && <b className="col col--9">{props.title}</b>}
 *         {
 *           props.canAdd &&
 *           <div className="col col--3">
 *             <button className="button button--block button--outline button--primary" type='button' onClick={props.onAddClick}>+</button>
 *           </div>
 *         }
 *       </div>
 *
 *       <div className="row">
 *         <div className="col col--12">
 *           {props.items.map((element) => element.children)}
 *         </div>
 *       </div>
 *     </div>
 *   );
 * } */

function AddButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  console.log(btnProps);
  return (
    <button {...btnProps} className={btnProps.className + " button button--outline button--primary"} type='button'>+</button>
  );
}

function RemoveButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  console.log(btnProps);
  return (
    <button {...btnProps} className="button button--outline button--primary" type='button'>-</button>
  );
}
function MoveUpButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  console.log(btnProps);
  return (
    <button {...btnProps} className="button button--outline button--primary" type='button'>▲</button>
  );
}

function MoveDownButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  console.log(btnProps);
  return (
    <button {...btnProps} className="button button--outline button--primary" type='button'>▼</button>
  );
}

interface ParamProps {
  param: ContentDescriptorObject;
  onChange: (event: any) => void;
  formData: any;
}
const InteractiveMethodParam: React.FC<ParamProps> = (props) => {
  const {param} = props;

  const schema = traverse(
    param.schema,
    (s) => {
      s.description = undefined;
      s.summary = undefined;
      return s;
    },
    { mutable: false }
  );
  return (
    <Form
      schema={schema}
    formData={props.formData}
      uiSchema={uiSchema}
      validator={validator}
      templates={{ArrayFieldItemTemplate, ArrayFieldTemplate, ButtonTemplates:{ AddButton, RemoveButton, MoveUpButton, MoveDownButton } }}
      onChange={props.onChange}
      onError={log('errors')}
      liveValidate
    />
  );
}

const InteractiveMethod: React.FC<Props> = (props) => {
  const {method} = props;
  const [requestParams, setRequestParams] = React.useState<any>({});
  const [executionResult, setExecutionResult] = React.useState<any>();

  if (!method.params[0]) {
    return null;
  }

  const handleChange = (change: any, i: number) => {
    setRequestParams((val: any) => {
      return {
        ...val,
        [(method.params[i] as ContentDescriptorObject).name]: change.formData,
      };
    });
  };

  const methodCall = {
    method: method.name,
    params: requestParams
  };

  const handleExec = async () => {
    try {
      const response = await (window as any).ethereum.request(methodCall);
      setExecutionResult(response);
    } catch (e) {
      setExecutionResult(e);
    }
  };

  const jsCode = [
    `await window.ethereum.request(${JSON.stringify(methodCall, null, "  ")});`
  ]

  return (
    <>
      <div>
        {method.params.map((p, i) => (
          <InteractiveMethodParam
            formData={requestParams[(p as ContentDescriptorObject).name]}
            onChange={(change) => handleChange(change, i)}
            param={p as ContentDescriptorObject} />
        ))}
      </div>
      <pre><code>
        {jsCode}
      </code></pre>
      {executionResult && <div>
        <pre><code>
          {JSON.stringify(executionResult, null, '  ')}
        </code></pre>
      </div>}
      <div>
        <button onClick={handleExec}>Execute</button>
      </div>
    </>
  );

}

export default InteractiveMethod;
