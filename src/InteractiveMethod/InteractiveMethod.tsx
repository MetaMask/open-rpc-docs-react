import React, { createRef, useEffect, useState } from 'react';
import validator from '@rjsf/validator-ajv8';
import {
  IconButtonProps,
  ArrayFieldTemplateProps,
  RJSFSchema,
  UiSchema,
  ArrayFieldTemplateItemType,
} from '@rjsf/utils';
import {
  ContentDescriptorObject,
  ExampleObject,
  ExamplePairingObject,
  MethodObject,
  OpenrpcDocument,
} from '@open-rpc/meta-schema';
import traverse from '@json-schema-tools/traverse';
import Form from '@rjsf/core';
import ArrayFieldTemplate from '../ArrayFieldTemplate/ArrayFieldTemplate';
import ArrayFieldItemTemplate from '../ArrayFieldItemTemplate/ArrayFieldItemTemplate';
import FieldErrorTemplate from '../FieldErrorTemplate/FieldErrorTemplate';
import FieldTemplate from '../FieldTemplate/FieldTemplate';
import ObjectFieldTemplate from '../ObjectFieldTemplate/ObjectFieldTemplate';
const qs = require('qs');
const openapiUrlResolver = require('openapi-url-resolver');
const { useHistory, useLocation } = require('@docusaurus/router');

const uiSchema: UiSchema = {
  'ui:description': '',
  'ui:submitButtonOptions': {
    norender: true,
  },
};

interface Props {
  method: MethodObject;
  openrpcDocument: OpenrpcDocument;
  selectedExamplePairing?: ExamplePairingObject;
  requestTemplate: Record<string, string>;
  components?: {
    CodeBlock: React.FC<{
      children: JSX.Element | JSX.Element[] | string | undefined;
      className?: string;
    }>;
  };
}

function AddButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  return (
    <button
      {...btnProps}
      className={btnProps.className + ' button button--primary'}
      type="button"
    >
      +
    </button>
  );
}

function RemoveButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  const style = {
    ...btnProps.style,
    minWidth: '35px',
    maxWidth: '36px',
    border: undefined,
  };
  return (
    <button
      {...btnProps}
      style={style}
      className="button button--outline button--primary"
      type="button"
    >
      -
    </button>
  );
}
function MoveUpButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  const style = {
    ...btnProps.style,
    minWidth: '35px',
    maxWidth: '36px',
  };
  return (
    <button
      {...btnProps}
      style={style}
      className="button button--outline button--primary"
      type="button"
    >
      ▲
    </button>
  );
}

function MoveDownButton(props: IconButtonProps) {
  const { icon, iconType, ...btnProps } = props;
  const style = {
    ...btnProps.style,
    minWidth: '35px',
    maxWidth: '36px',
  };
  return (
    <button
      {...btnProps}
      style={style}
      className="button button--outline button--primary"
      type="button"
    >
      ▼
    </button>
  );
}

interface ParamProps {
  param: ContentDescriptorObject;
  onChange: (event: any) => void;
  refref: any;
  formData: any;
}
const InteractiveMethodParam: React.FC<ParamProps> = (props) => {
  const { param, refref } = props;
  const [metamaskInstalled, setMetamaskInstalled] =
    React.useState<boolean>(false);

  const schema = traverse(
    param.schema,
    (s) => {
      if (typeof s === 'boolean') {
        return s;
      }
      s.description = undefined;
      s.summary = undefined;
      return s;
    },
    { mutable: false },
  );
  schema.title = undefined;
  useEffect(() => {
    const installed = !!(window as any)?.ethereum;
    setMetamaskInstalled(installed);
  }, []);
  return (
    <Form
      schema={schema}
      formData={props.formData}
      showErrorList={false}
      uiSchema={uiSchema}
      validator={validator}
      ref={refref}
      disabled={!metamaskInstalled}
      templates={{
        ArrayFieldItemTemplate,
        ArrayFieldTemplate,
        FieldErrorTemplate,
        FieldTemplate,
        ButtonTemplates: {
          AddButton,
          RemoveButton,
          MoveUpButton,
          MoveDownButton,
        },
        ObjectFieldTemplate,
      }}
      onChange={props.onChange}
      liveValidate={metamaskInstalled}
    />
  );
};

const InteractiveMethod: React.FC<Props> = (props) => {
  const history = useHistory();
  const queryString = qs.parse(history.location.search, {
    ignoreQueryPrefix: true,
    decoder: (
      value: string,
      defaultEncoder: any,
      _: string,
      type: 'key' | 'value',
    ) => {
      if (type === 'key') {
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
  });
  const { method, components, selectedExamplePairing } = props;
  const [requestParams, setRequestParams] = useState<any>(queryString || {});
  const [executionResult, setExecutionResult] = useState<any>();
  const [metamaskInstalled, setMetamaskInstalled] =
    React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('js');
  const [selectedServer, setSelectedServer] = useState<string | undefined>(
    undefined,
  );
  const formRefs = method.params.map(() => createRef());
  props.openrpcDocument.servers = [
    {
      name: 'foo',
      url: 'https://foo.bar',
    },
    {
      name: 'bar',
      url: 'https://bar.foo',
    },
  ];
  const [servers, setServers] = useState<string[]>(
    openapiUrlResolver.resolve(props.openrpcDocument),
  );
  const [newServer, setNewServer] = useState('');

  const handleAddServer = () => {
    setServers((val) => [...val, newServer]);
    setSelectedServer(newServer);
    setNewServer('');
  };

  useEffect(() => {
    if (!selectedExamplePairing || Object.keys(queryString).length > 0) {
      return;
    }
    const defaultFormData = selectedExamplePairing?.params.reduce(
      (memo: any, exampleObject, i) => {
        const ex = exampleObject as ExampleObject;
        memo[(method.params[i] as ContentDescriptorObject).name] = ex.value;
        return memo;
      },
      {},
    );
    setRequestParams(defaultFormData);
  }, [selectedExamplePairing]);

  const handleChange = (change: any, i: number) => {
    setRequestParams((val: any) => {
      const newVal = {
        ...val,
        [(method.params[i] as ContentDescriptorObject).name]: change.formData,
      };
      history.replace({
        search: qs.stringify(newVal, { encode: false }),
      });
      return newVal;
    });
  };

  const methodCall = {
    jsonrpc: '2.0',
    id: 1,
    method: method.name,
    params:
      method.paramStructure === 'by-name'
        ? requestParams
        : method.params.map(
            (p, i) =>
              requestParams[(p as ContentDescriptorObject).name] || undefined,
          ),
  };

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

  async function awaitFromString(handler: string) {
    return new Promise((resolve, reject) => {
      new AsyncFunction(
        'resolve',
        'reject',
        `try {
          const res = await ${handler};
          resolve(res);
        } catch (e) { reject(e); }`,
      )(resolve, reject);
    });
  }

  const handleExec = async () => {
    // loop over refs
    formRefs.forEach((formRef) => {
      (formRef as any).current.validateForm();
    });

    try {
      const req = processTemplateRequest(props.requestTemplate.js);
      console.log('req', req);
      const response = await awaitFromString(req);
      console.log('response', response);
      setExecutionResult(response);
    } catch (e) {
      if ((e as unknown as any).code) {
        setExecutionResult(e);
      } else {
        setExecutionResult((e as unknown as any).message);
      }
    }
  };

  useEffect(() => {
    const installed = !!(window as any)?.ethereum;
    setMetamaskInstalled(installed);
  }, []);

  const addIndent = (str: string, indentLevel: number, skipFirst = true) => {
    return str
      .split('\n')
      .map((line, index: number) => {
        if (index === 0 && skipFirst) {
          return line;
        }
        return ' '.repeat(indentLevel) + line;
      })
      .join('\n');
  };

  const processTemplateRequest = (template: string | undefined) => {
    if (template === undefined) {
      return '';
    }
    let returns = '';
    returns = template.replace(
      '${jsonRpcRequest}',
      addIndent(JSON.stringify(methodCall, null, 2), 4),
    );
    returns = returns.replace('${serverUrl}', selectedServer || '');
    return returns;
  };

  return (
    <div className="container">
      {servers && servers.length > 0 && (
        <div className="row">
          <h3>Servers</h3>
          <input
            type="text"
            value={newServer}
            onChange={(e) => setNewServer(e.target.value)}
            placeholder="Add a new server"
          />
          <button onClick={handleAddServer}>Add Server</button>
          <div className="col col--12">
            <select onChange={(e) => setSelectedServer(e.target.value)}>
              <option value="">Select a server</option>
              {servers.map((server: any) => (
                <option value={server}>{server}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {!metamaskInstalled && (
        <div className="row">
          <div className="alert alert--danger" role="alert">
            Install MetaMask for your platform and refresh the page. The
            interactive features in this documentation require installing{' '}
            <a target="_blank" href="https://metamask.io/download/">
              MetaMask
            </a>
            .
          </div>
          <br />
        </div>
      )}
      {method.params.length > 0 && (
        <>
          <div className="row">
            <h3>Params</h3>
            <div className="col col--12">
              {method.params.map((p, i) => (
                <>
                  <h4>{(p as ContentDescriptorObject).name}</h4>
                  <InteractiveMethodParam
                    refref={formRefs[i]}
                    formData={
                      requestParams[(p as ContentDescriptorObject).name]
                    }
                    onChange={(change) => handleChange(change, i)}
                    param={p as ContentDescriptorObject}
                  />
                </>
              ))}
            </div>
          </div>
          <br />
        </>
      )}
      <div className="row">
        <h3>Request</h3>
        <div className="col col--12">
          {Object.keys(props.requestTemplate).length !== 1 && (
            <ul className="tabs">
              {Object.keys(props.requestTemplate).map((key) => {
                return (
                  <li
                    id={key}
                    className={
                      'tabs__item' +
                      (selectedTab === key ? ' tabs__item--active' : '')
                    }
                    onClick={() => setSelectedTab(key)}
                  >
                    {key}
                  </li>
                );
              })}
            </ul>
          )}
          <>
            {components && components.CodeBlock && (
              <components.CodeBlock className={`language-${selectedTab}`}>
                {processTemplateRequest(props.requestTemplate[selectedTab])}
              </components.CodeBlock>
            )}
          </>
        </div>
      </div>
      {executionResult !== undefined && (
        <div className="row">
          <h3>Response</h3>
          <div className="col col--12">
            {components && components.CodeBlock && (
              <components.CodeBlock className="language-json">
                {JSON.stringify(executionResult, null, '  ')}
              </components.CodeBlock>
            )}
            {!components?.CodeBlock && (
              <pre>
                <code>{JSON.stringify(executionResult, null, '  ')}</code>
              </pre>
            )}
          </div>
        </div>
      )}
      <div className="row">
        <button
          className="button button--primary button--block"
          onClick={handleExec}
          disabled={!metamaskInstalled}
        >
          Send Request
        </button>
      </div>
    </div>
  );
};

export default InteractiveMethod;
