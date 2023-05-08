import React, { Component } from "react";
import _ from "lodash";
import Params from "../Params/Params";
import ContentDescriptor from "../ContentDescriptor/ContentDescriptor";
import ExamplePairings from "../ExamplePairings/ExamplePairings";
import Errors from "../Errors/Errors";
import {
  OpenrpcDocument,
  MethodObject,
  ContentDescriptorObject,
  ErrorObject,
  ExamplePairingObject,
  LinkObject,
} from "@open-rpc/meta-schema";
import Links from "../Links/Links";
import Tags from "../Tags/Tags";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";

export interface IMethodPluginProps {
  openrpcMethodObject: MethodObject;
}
export type OnMethodToggle = (method: string, expanded: boolean) => void;

interface IProps {
  schema?: OpenrpcDocument;
  uiSchema?: any;
  reactJsonOptions?: object;
  methodPlugins?: Array<React.FC<IMethodPluginProps>>;
  disableTransitionProps?: boolean;
  onMethodToggle?: OnMethodToggle;
}

class Methods extends Component<IProps> {
  public render() {
    const { schema, uiSchema, onMethodToggle } = this.props;
    if (!schema) {
      return null;
    }
    const methods = schema.methods as MethodObject[];
    const methodsExist = methods && methods.length > 0;
    if (!schema || !schema.methods || !methodsExist) { return null; }
    return (
      <div className="methods-root">
        <h3>Methods</h3>
        {methods.map((method, i) => {
          const links = method.links as LinkObject[];
          return (
            <details
              id={method.name}
              key={i + method.name}
              onToggle={(event) => {
                if (onMethodToggle) {
                  onMethodToggle(method.name, event.currentTarget.open);
                }
              }}
              open={
              uiSchema &&
              uiSchema.methods &&
              (uiSchema.methods["ui:defaultExpanded"] === true ||
               (uiSchema.methods["ui:defaultExpanded"] && uiSchema.methods["ui:defaultExpanded"][method.name] === true)
              )
              }>
              <summary>
                <h4 key={method.name} className="method-name">{method.name}</h4>
                <span key={method.summary} className="method-summary">
                  {method.summary}
                </span>
              </summary>

              {method.tags && method.tags.length > 0 &&
               <section key="tags">
                 <Tags tags={method.tags as any} />
               </section>
              }
              {method.description &&
               <section key="description">
                 <MarkdownDescription
                   uiSchema={uiSchema}
                   source={method.description}
                   className="method-description"
                 />
               </section>
              }
              {method.params && method.params.length > 0 &&
               <section key="params-title">
                 <h5>Params</h5>
               </section>
              }
              {method.params &&
               <section key="params">
                 <Params params={method.params as ContentDescriptorObject[]} uiSchema={uiSchema} />
               </section>
              }
              {method.result &&
               <section key="result-title">
                 <h5>Result</h5>
               </section>
              }
              {method.result && (method.result as ContentDescriptorObject).schema &&
               <section key="result">
                 <ContentDescriptor
                   contentDescriptor={method.result as ContentDescriptorObject}
                   hideRequired={true} uiSchema={uiSchema} />
               </section>
              }
              {method.errors && method.errors.length > 0 &&
               <section key="errors">
                 <Errors errors={method.errors as ErrorObject[]} reactJsonOptions={this.props.reactJsonOptions} />
               </section>
              }
              <ExamplePairings
                uiSchema={uiSchema}
                examples={method.examples as ExamplePairingObject[]}
                method={method}
                reactJsonOptions={this.props.reactJsonOptions} />
              {links && links.length > 0 &&
               <section key="links-title">
                 <h5>Links</h5>
               </section>
              }
              {links && links.length > 0 &&
               <section key="links">
                 <Links links={links} reactJsonOptions={this.props.reactJsonOptions} />
               </section>
              }
              {this.props.methodPlugins && this.props.methodPlugins.length > 0 &&
               <section key="method-plugins">
                 {this.props.methodPlugins.map((CompDef: any) => {
                   return (
                     <CompDef openrpcMethodObject={method} />
                   );
                 })}
               </section>
              }
            </details>
          );
        })}
      </div>
    );
  }
}

export default Methods;
