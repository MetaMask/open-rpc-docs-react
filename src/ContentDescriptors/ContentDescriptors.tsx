import React, { Component } from "react";
import ContentDescriptor from "../ContentDescriptor/ContentDescriptor";
import { OpenrpcDocument, ContentDescriptorObject } from "@open-rpc/meta-schema";

interface IProps {
  schema?: OpenrpcDocument;
  disableTransitionProps?: boolean;
  uiSchema?: any;
}

export default class ContentDescriptors extends Component<IProps> {
  public render() {
    const { schema, disableTransitionProps } = this.props;
    if (!schema || !schema.components  || !schema.components.contentDescriptors) { return null; }
    const entries = Object.entries(schema.components.contentDescriptors);
    if (entries.length === 0) { return null; }
    return (
      <>
        <h3>ContentDescriptors</h3>
        {entries.map(([key, val]) => {
          return <ContentDescriptor
            key={key}
            contentDescriptor={val as ContentDescriptorObject}
            disableTransitionProps={disableTransitionProps || false}
            uiSchema={this.props.uiSchema}
            hideRequired={true} />;
        })}
      </>
    );
  }
}
