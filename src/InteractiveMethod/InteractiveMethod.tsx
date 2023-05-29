import React, {createRef, useEffect} from "react";
import validator from '@rjsf/validator-ajv8';
import { IconButtonProps,ArrayFieldTemplateProps, RJSFSchema, UiSchema, ArrayFieldTemplateItemType } from '@rjsf/utils';
import { ContentDescriptorObject, ExampleObject, ExamplePairingObject, MethodObject} from '@open-rpc/meta-schema';
import traverse from "@json-schema-tools/traverse";
import Form from '@rjsf/core';
import ArrayFieldTemplate from '../ArrayFieldTemplate/ArrayFieldTemplate';
import ArrayFieldItemTemplate from '../ArrayFieldItemTemplate/ArrayFieldItemTemplate';
import FieldErrorTemplate from "../FieldErrorTemplate/FieldErrorTemplate";
import FieldTemplate from "../FieldTemplate/FieldTemplate";
const qs = require('qs');
const { useHistory, useLocation } = require('@docusaurus/router');

const log = (type: any) => console.log.bind(console, type);
const uiSchema: UiSchema = {
  'ui:description': '',
  "ui:submitButtonOptions": {
    "norender": true,
  }
};

interface Props {
  method: MethodObject;
  selectedExamplePairing?: ExamplePairingObject;
  components?: {
    CodeBlock: React.FC<{children: string, className?: string}>;
  };
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
  return (
    <button {...btnProps} className={btnProps.className + " button button--outline button--primary"} type='button'>+</button>
  );
}

function RemoveButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  return (
    <button {...btnProps} className="button button--outline button--primary" type='button'>-</button>
  );
}
function MoveUpButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  return (
    <button {...btnProps} className="button button--outline button--primary" type='button'>▲</button>
  );
}

function MoveDownButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  return (
    <button {...btnProps} className="button button--outline button--primary" type='button'>▼</button>
  );
}

interface ParamProps {
  param: ContentDescriptorObject;
  onChange: (event: any) => void;
  refref: any;
  formData: any;
}
const InteractiveMethodParam: React.FC<ParamProps> = (props) => {

  const {param, refref} = props;

  const schema = traverse(
    param.schema,
    (s ) => {
      s.description = undefined;
      s.summary = undefined;
      return s;
    },
    { mutable: false }
  );
  schema.title = undefined;
  return (
    <Form
      schema={schema}
      formData={props.formData}
      showErrorList={false}
      uiSchema={uiSchema}
      validator={validator}
      ref={refref}
      templates={{ArrayFieldItemTemplate, ArrayFieldTemplate, FieldErrorTemplate, FieldTemplate, ButtonTemplates:{ AddButton, RemoveButton, MoveUpButton, MoveDownButton } }}
      onChange={props.onChange}
      onError={log('errors')}
      liveValidate
    />
  );
}

const InteractiveMethod: React.FC<Props> = (props) => {
  const history = useHistory();
  const queryString = qs.parse(history.location.search, {
    ignoreQueryPrefix: true,
    decoder: (
      value: string,
      defaultEncoder: any,
      _: string,
      type: "key" | "value",
    ) => {
      if (type === "key") {
        return defaultEncoder(value);
      }
      if (/^(\d+|\d*\.\d+)$/.test(value)) {
        return parseFloat(value);
      }
      const keywords: any = {
        true: true,
        false: false,
        null: null,
        undefined,
      };
      if (value in keywords) {
        return keywords[value];
      }

      try {
        return decodeURIComponent(value);
      } catch (e) {
        return value;
      }
    },
  })
  const {method, components, selectedExamplePairing} = props;
  const [requestParams, setRequestParams] = React.useState<any>(queryString || {});
  const [executionResult, setExecutionResult] = React.useState<any>();
  const formRefs = method.params.map(() => createRef());

  useEffect(() => {
    if (!selectedExamplePairing || Object.keys(queryString).length > 0) {
      return;
    }
    const defaultFormData = selectedExamplePairing?.params.reduce((memo: any, exampleObject, i) => {
      const ex = exampleObject as ExampleObject;
      memo[(method.params[i] as ContentDescriptorObject).name] = ex.value;
      return memo;
    }, {})
    setRequestParams(defaultFormData);
  }, [selectedExamplePairing]);


  const handleChange = (change: any, i: number) => {
    setRequestParams((val: any) => {
      const newVal = {
        ...val,
        [(method.params[i] as ContentDescriptorObject).name]: change.formData,
      }
      history.replace({
        search: qs.stringify(newVal, { encode: false }),
      });
      return newVal;
    });
  };

  const methodCall = {
    method: method.name,
    params: method.paramStructure === "by-name" ? requestParams : method.params.map((p, i) => requestParams[(p as ContentDescriptorObject).name] || undefined),
  };


  const handleExec = async () => {
    // loop over refs
    formRefs.forEach((formRef) => {
      (formRef as any).current.validateForm();
    });

    try {
      const response = await (window as any).ethereum.request(methodCall);
      setExecutionResult(response);
    } catch (e) {
      setExecutionResult(e);
    }
  };

  const jsCode = `await window.ethereum.request(${JSON.stringify(methodCall, null, "  ")});`;

  return (
    <>
      {method.params.length > 0 &&
      <>
        <div>
          <h3>Params</h3>
          {method.params.map((p, i) => (
            <>
              <h4>{(p as ContentDescriptorObject).name}</h4>
              <InteractiveMethodParam
                refref={formRefs[i]}
                formData={requestParams[(p as ContentDescriptorObject).name]}
                onChange={(change) => handleChange(change, i)}
                param={p as ContentDescriptorObject} />
            </>
          ))}
        </div>
        <br />
      </>
      }
      <div>
        <h3>Request</h3>
        {components && components.CodeBlock && <components.CodeBlock className="language-js">{jsCode}</components.CodeBlock>}
        {!components?.CodeBlock &&
          <pre>
            <code>
              {jsCode}
            </code>
          </pre>
        }
      </div>
      {executionResult !== undefined && <div>
        <h3>Response</h3>
        {components && components.CodeBlock && <components.CodeBlock className="language-json">{JSON.stringify(executionResult, null, '  ')}</components.CodeBlock>}
        {!components?.CodeBlock &&
          <pre>
              <code>
              {JSON.stringify(executionResult, null, '  ')}
            </code>
          </pre>
        }
      </div>}
      <div>
        <button className="button button--primary button--block" onClick={handleExec}>
          Send Request
        </button>
      </div>
    </>
  );

}

export default InteractiveMethod;
