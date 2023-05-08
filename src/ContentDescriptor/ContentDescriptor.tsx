import React, { Component } from "react";
import JSONSchema from "../JSONSchema/JSONSchema";
import ReactMarkdown from "react-markdown";
import { ContentDescriptorObject } from "@open-rpc/meta-schema";
import "./ContentDescriptor.css";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";

interface IProps {
  contentDescriptor?: ContentDescriptorObject;
  hideIcon?: boolean;
  hideRequired?: boolean;
  disableTransitionProps?: boolean;
  uiSchema?: any;
}

class ContentDescriptor extends Component<IProps> {
  public render() {
    const { contentDescriptor, hideIcon, hideRequired, uiSchema, disableTransitionProps } = this.props;
    if (!contentDescriptor) { return null; }
    const entries = Object.entries(contentDescriptor);
    if (entries.length === 0) { return null; }
    return (
      <details
        style={{ width: "100%" }}
        open={uiSchema && uiSchema.params["ui:defaultExpanded"]}
      >
        <summary style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%", alignItems: "center" }}>
            <h6 className="content-descriptor-name">{contentDescriptor.name}</h6>
            <span className="content-descriptor-summary">{contentDescriptor.summary}</span>
      {hideRequired ? null : <span className="content-descriptor-summary">
              {contentDescriptor.required ? "true" : "false"}
            </span>}
          </div>
        </summary>
        <>
          {contentDescriptor.description &&
           <MarkdownDescription
             uiSchema={uiSchema}
             source={contentDescriptor.description}
             className="content-descriptor-description"
           />
          }
          {contentDescriptor.schema &&
           <>
             <span>schema</span>
             <code>{JSON.stringify(contentDescriptor.schema, null, 4)}</code>
           </>
          }
        </>
      </details>
    );
  }
}
export default ContentDescriptor;
