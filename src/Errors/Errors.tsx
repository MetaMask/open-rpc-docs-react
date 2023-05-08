import React, { Component } from "react";
import _ from "lodash";
import ReactJson from "react-json-view";
import { ErrorObject } from "@open-rpc/meta-schema";
import ExpansionTable from "../ExpansionTable/ExpansionTable";

interface IProps {
  errors?: ErrorObject[];
  reactJsonOptions?: any;
}

class Errors extends Component<IProps> {
  public render() {
    const { errors} = this.props;
    if (!errors || errors.length === 0) {
      return null;
    }
    return (
      <div>
        <div>
          <h5>Errors</h5>
        </div>
        <div>
          <ExpansionTable headers={["Code", "Message", "Data"]}>
            {errors.map((row) => (
              <tr>
                <td>
                  {row.code}
                </td>
                <td>{row.message}</td>
                <td className="error-data">
                  {_.isObject(row.data) ?
                   <ReactJson src={row.data} {...this.props.reactJsonOptions} enableClipboard={false} /> : row.data}
                </td>
              </tr>
              ))}
          </ExpansionTable>
        </div>
      </div>
    );
  }
}

export default Errors;
