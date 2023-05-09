import React, { Component } from "react";
import JSONSchema from "../JSONSchema/JSONSchema";
import ReactMarkdown from "react-markdown";
import { ContentDescriptorObject } from "@open-rpc/meta-schema";
import "./ContentDescriptor.css";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";
import { JsonSchemaViewer } from "@stoplight/json-schema-viewer";


interface IProps {
  contentDescriptor?: ContentDescriptorObject;
  hideRequired?: boolean;
  uiSchema?: any;
}

class ContentDescriptor extends Component<IProps> {
  public render() {
    const { contentDescriptor, hideRequired, uiSchema} = this.props;
    if (!contentDescriptor) { return null; }
    const entries = Object.entries(contentDescriptor);
    if (entries.length === 0) { return null; }
    return (
      <>
        <span>
          <i>{contentDescriptor.name}</i>
          {hideRequired && contentDescriptor.required === true && <span className="content-descriptor-summary">
            <strong> (required)</strong>
          </span>}
        </span>
        {contentDescriptor.description &&
         <MarkdownDescription
           uiSchema={uiSchema}
           source={contentDescriptor.description}
           className="content-descriptor-description"
         />
        }
        {contentDescriptor.schema &&
         <JsonSchemaViewer
           schema={contentDescriptor.schema}
         />
        }
      </>
    );

    /* return (
     *   <details
     *     style={{ width: "100%" }}
     *     open={typeof defaultExpanded === "undefined"  ? uiSchema && uiSchema.params["ui:defaultExpanded"] : defaultExpanded}
     *   >
     *     <summary style={{ justifyContent: "space-between", listStyleType: hideIcon ? "none" : undefined }}>
     *         <h6 className="content-descriptor-name" style={{display: "inline", marginRight: "3px", cursor: "pointer"}}>{contentDescriptor.name}</h6>
     *         <span className="content-descriptor-summary">{contentDescriptor.summary}</span>
     *         {hideRequired ? null : <span className="content-descriptor-summary">
     *           {contentDescriptor.required ? "true" : "false"}
     *         </span>}
     *     </summary>
     *     <>
     *       {contentDescriptor.description &&
     *        <MarkdownDescription
     *          uiSchema={uiSchema}
     *          source={contentDescriptor.description}
     *          className="content-descriptor-description"
     *        />
     *       }
     *       {contentDescriptor.schema &&
     *        <>
     *          <span>schema</span>
     *          <JsonSchemaViewer
     *            schema={contentDescriptor.schema}
     *          />
     *        </>
     *       }
     *     </>
     *   </details>
     * ); */
  }
}
export default ContentDescriptor;
