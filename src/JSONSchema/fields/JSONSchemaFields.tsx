import React, { Component } from "react";
import _ from "lodash";
import { JSONSchema4 } from "json-schema";
import SchemaRenderer from "../SchemaRenderer";

interface IProps {
  schema?: JSONSchema4;
  name?: string;
  required?: boolean;
  hideHeader?: boolean;
}

class JSONSchemaFields extends Component<IProps> {
  public render() {
    const { schema, name, required, hideHeader } = this.props;
    if (!schema) { return null; }
    if (_.isEmpty(schema)) { return null; }
    return null;
    /* return (
     *   <>
     *     {!hideHeader &&
     *       <Table className={classes.table}>
     *         <TableHead>
     *           <TableRow>
     *             <TableCell>Name</TableCell>
     *             <TableCell>Title</TableCell>
     *             <TableCell>Type</TableCell>
     *             <TableCell>Pattern</TableCell>
     *             <TableCell>Required</TableCell>
     *             <TableCell>Description</TableCell>
     *           </TableRow>
     *         </TableHead>
     *         <TableBody>
     *           <SchemaRenderer schema={schema || {}} required={!!required} name={name || ""} />
     *         </TableBody>
     *       </Table>
     *     }
     *     {hideHeader &&
     *      <SchemaRenderer schema={schema || {}} required={!!required} name={name || ""} />
     *     }
     *   </>
     * ); */
  }
}
const WrappedJSONSchemaFields = JSONSchemaFields;

export default WrappedJSONSchemaFields;
