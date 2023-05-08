import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import { LinkObject } from "@open-rpc/meta-schema";
import ExpansionTable from "../ExpansionTable/ExpansionTable";
import Servers from "../Servers/Servers";
import ReactJson from "react-json-view";

interface IProps {
  links?: LinkObject[];
  uiSchema?: any;
  reactJsonOptions?: any;
}

class Links extends Component<IProps> {
  public render() {
    const { links, uiSchema, reactJsonOptions } = this.props;
    if (!links || links.length === 0) { return null; }
    return (
      <ExpansionTable headers={["Method", "Summary"]}>
        <tr>
          <td colSpan={6}>
            {links.map((link, i) => (
              <div style={{ width: "100%" }} key={i}>
                <details
                  style={{ width: "100%" }} open={uiSchema && uiSchema.links["ui:defaultExpanded"]} key={i}>
                  <summary
                    style={{ justifyContent: "space-between" }}
                    key="links-header"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%" }}>
                      <h6 className="link-method">{link.method}</h6>
                      <span className="link-summary">{link.summary}</span>
                    </div>
                  </summary>
                  <section style={{ display: "block" }} key="links-body">
                    {link.description && <ReactMarkdown source={link.description} className="link-description" />}
                    {link.params && <h6>Params</h6>}
                    {link.params && <ReactJson src={link.params} {...reactJsonOptions} />}
                    {link.server && <h6 className="link-server">Server</h6>}
                    {link.server && <Servers servers={[link.server]} noTitle={true} reactJsonOptions={reactJsonOptions} />}
                  </section>
                </details>
              </div>
            ))}
          </td>
        </tr>
      </ExpansionTable>
    );
  }
}

export default Links;
