import React, { Component } from "react";
import ContentDescriptor from "../ContentDescriptor/ContentDescriptor";
import { ContentDescriptorObject } from "@open-rpc/meta-schema";
import ExpansionTable from "../ExpansionTable/ExpansionTable";

interface IProps {
  params?: ContentDescriptorObject[];
  disableTransitionProps?: boolean;
  uiSchema?: any;
}

class Params extends Component<IProps> {
  public render() {
    const { params, uiSchema } = this.props;
    if (!params || params.length === 0) {
      return null;
    }
    return (
      <ExpansionTable headers={["Name", "Summary", "Required"]}>
        <tr>
          <td colSpan={6}>
            {
              params.map((row) =>
                <ContentDescriptor
                  key={row.name}
                  contentDescriptor={row}
                  uiSchema={uiSchema}
                  disableTransitionProps={!!this.props.disableTransitionProps}
                />,
              )
            }
          </td>
        </tr>
      </ExpansionTable>
    );
  }
}

export default Params;
