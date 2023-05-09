import React, { Component } from "react";
import MarkdownDescription from "../MarkdownDescription/MarkdownDescription";
import { OpenrpcDocument } from "@open-rpc/meta-schema";

interface IProps {
  schema?: OpenrpcDocument;
}

class Info extends Component<IProps> {
  public render() {
    const { schema} = this.props;
    if (!schema || !schema.info) { return null; }
    const info = schema.info;
    return (
      <>
        {info.title && <h2>{info.title}</h2>}
        {info.version && <span><strong>{info.version}</strong></span>}
        {info.license &&
         info.license.name &&
         info.license.url &&
         <a href={ info.licence.url }> { info.license.name }</a>
        }
        {info.description && <MarkdownDescription uiSchema={{}} className="info-description" source={info.description}/>}
        {info.termsOfService &&
         <a className="info-termsOfService" href={info.termsOfService}>
           Terms Of Service
         </a>
        }
        {info.contact &&
         info.contact.url &&
         info.contact.name &&
         <a className="info-contact-url" href={info.contact.url}>
           Contact {info.contact.name}
         </a>
        }
        {info.contact &&
         info.contact.email &&
         <a
           className="info-contact-email"
           href={`mailto:${info.contact.email}`}
         >
           Email {info.contact.email}
         </a>
        }
      </>
    );
  }
}

export default Info;
