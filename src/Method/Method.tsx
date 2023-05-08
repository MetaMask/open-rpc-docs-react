import {
  OpenrpcDocument,
  MethodObject,
  ContentDescriptorObject,
  ErrorObject,
  ExamplePairingObject,
  LinkObject,
} from "@open-rpc/meta-schema";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";
import React from "react";
import Links from "../Links/Links";
import Tags from "../Tags/Tags";
import Params from "../Params/Params";
import ContentDescriptor from "../ContentDescriptor/ContentDescriptor";
import ExamplePairings from "../ExamplePairings/ExamplePairings";
import Errors from "../Errors/Errors";
import _ from "lodash";

export interface IMethodPluginProps {
  openrpcMethodObject: MethodObject;
}

interface IProps {
  method?: MethodObject;
  methodPlugins?: Array<React.FC<IMethodPluginProps>>;
  reactJsonOptions?: object;
  uiSchema?: any;
  key?: string;
}

const Method = ({method, uiSchema, key, methodPlugins, reactJsonOptions}: IProps) => {
  if (!method) {
    return null;
  }
  if (_.isEmpty(method)) {
    return null;
  }
  const links = method.links as LinkObject[];
  return (
    <div
      id={method.name}
      key={key}
      className="alert alert--info margin-bottom--sm"
      >
      <summary style={{cursor: "pointer"}}>
        <h4 key={method.name} className="method-name" style={{display: "inline", marginRight: "3px"}}>{method.name}</h4>
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
           defaultExpanded={true}
           hideIcon={true}
           hideRequired={true} uiSchema={uiSchema} />
       </section>
      }
      {method.errors && method.errors.length > 0 &&
       <section key="errors">
         <Errors errors={method.errors as ErrorObject[]} reactJsonOptions={reactJsonOptions} />
       </section>
      }
      <ExamplePairings
        uiSchema={uiSchema}
        examples={method.examples as ExamplePairingObject[]}
        method={method}
        reactJsonOptions={reactJsonOptions} />
      {links && links.length > 0 &&
       <section key="links-title">
         <h5>Links</h5>
       </section>
      }
      {links && links.length > 0 &&
       <section key="links">
         <Links links={links} reactJsonOptions={reactJsonOptions} />
       </section>
      }
      {methodPlugins && methodPlugins.length > 0 &&
       <section key="method-plugins">
         {methodPlugins.map((CompDef: any) => {
           return (
             <CompDef openrpcMethodObject={method} />
           );
         })}
       </section>
      }
    </div>
  );

};

export default Method;
