import React, { Component } from "react";
import { withStyles, WithStyles, Theme } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ReactMarkdown from "react-markdown";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Typography, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanel, Grid } from "@material-ui/core";
import { ServerObject } from "@open-rpc/meta-schema";
import ReactJson from "react-json-view";
import ExpansionTable from "../ExpansionTable/ExpansionTable";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";

interface IProps {
  servers?: ServerObject[];
  uiSchema?: any;
  reactJsonOptions?: any;
  noTitle?: boolean;
}

class Servers extends Component<IProps> {
  public render() {
    const { servers, noTitle, reactJsonOptions, uiSchema } = this.props;
    if (!servers || servers.length === 0) {
      return null;
    }
    return (
      <>
        {noTitle ? null : <h2>Servers</h2>}
        <ExpansionTable headers={["Name", "Url", "Summary"]}>
          <tr>
            <td colSpan={6}>
              {servers.map((server, i) => (
                <div style={{ width: "100%" }} key={i}>
                  <details open={uiSchema && uiSchema.servers["ui:defaultExpanded"]}>
                    <summary style={{ justifyContent: "space-between" }}>
                      <span>{server.name}</span>
                      <span>{server.url}</span>
                      <span>{server.summary}</span>
                    </summary>
                    <div style={{ display: "block" }}>
                      {server.description &&
                        <MarkdownDescription
                          uiSchema={uiSchema}
                          source={server.description}
                        />
                      }
                      {server.variables && <>
                        <h6>Variables</h6>
                        <br />
                      </>
                      }
                      {server.variables && <ReactJson src={server.variables} {...reactJsonOptions} />}
                    </div>
                  </details>
                </div>
              ))}
            </td>
          </tr>
        </ExpansionTable>
      </>
    );
  }
}

export default Servers;
