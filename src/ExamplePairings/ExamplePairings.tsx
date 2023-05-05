import React, { Component } from "react";
import ExamplePairing from "../ExamplePairing/ExamplePairing";
import { Typography, List, ListItem, ListItemText, Grid, MenuItem, Menu, withStyles, ExpansionPanelDetails } from "@material-ui/core";
import { MethodObject, ExamplePairingObject, ContentDescriptorObject, ReferenceObject, MethodObjectParamStructure } from "@open-rpc/meta-schema";

interface IProps {
  method?: MethodObject;
  examples?: ExamplePairingObject[];
  uiSchema?: any;
  reactJsonOptions?: any;
}

interface IState {
  anchorEl: Element | null;
  selectedIndex: number;
  currentExample?: ExamplePairingObject;
}

const getExamplesFromMethod = (method?: MethodObject): ExamplePairingObject[] => {
  if (!method) { return []; }
  if (!method.params) { return []; }
  const examples: ExamplePairingObject[] = [];

  (method.params as ContentDescriptorObject[]).forEach((param, index: number) => {
    if (param.schema && param.schema.examples && param.schema.examples.length > 0) {
      param.schema.examples.forEach((ex: any, i: number) => {
        const example = examples[i];
        if (example === undefined) {
          examples.push({
            name: "generated-example",
            params: [
              {
                name: param.name,
                value: ex,
              },
            ],
            result: {
              name: "example-result",
              value: null,
            },
          });
        } else {
          example.params.push({
            name: param.name,
            value: ex,
          });
        }
      });
    }
  });
  const methodResult = method.result as ContentDescriptorObject;
  if (methodResult && methodResult.schema && methodResult.schema.examples && methodResult.schema.examples.length > 0) {
    methodResult.schema.examples.forEach((ex: any, i: number) => {
      const example = examples[i];
      if (example === undefined) {
        examples.push({
          name: "generated-example",
          params: [],
          result: {
            name: methodResult.name,
            value: ex,
          },
        });
      } else {
        example.result = {
          name: methodResult.name,
          value: ex,
        };
      }
    });
  }
  return examples;
};

class ExamplePairings extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      anchorEl: null,
      selectedIndex: 0,
    };
  }
  public componentWillMount() {
    if (!this.props || !this.props.examples) {
      return;
    }
    const firstExample = this.props.examples[0];
    if (firstExample === undefined) {
      return;
    }
    this.setState({
      currentExample: firstExample,
    });
  }
  public handleClickListItem = (event: React.MouseEvent) => {
    this.setState({
      anchorEl: event.currentTarget as Element,
    });
  }
  public handleMenuItemClick = (event: React.MouseEvent, index: number) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  }
  public handleClose = () => {
    this.setState({ anchorEl: null });
  }
  public render() {
    let { examples } = this.props;
    const { method, uiSchema } = this.props;
    const { anchorEl } = this.state;
    examples = examples || getExamplesFromMethod(method);
    if (!examples || examples.length === 0) {
      return null;
    }
    const paramStructure = this.props.method && this.props.method.paramStructure as MethodObjectParamStructure || "either";

    const selectedExample = examples[this.state.selectedIndex];
    if (selectedExample === undefined) { return null; }
    return (
      <ExpansionPanelDetails key="examples">
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5">Examples</Typography>
          </Grid>
          <Grid item xs={12}>
            <List component="nav">
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="menu-menu"
                aria-label="Method Examples"
                onClick={this.handleClickListItem}>
                <ListItemText
                  primary={selectedExample.name}
                  secondary={selectedExample.summary} />
              </ListItem>
              <Menu
                id="menu-menu"
                anchorEl={anchorEl as HTMLElement}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                {examples.map((example, index) => (
                  <MenuItem
                    key={example.name}
                    selected={index === this.state.selectedIndex}
                    onClick={(event) => this.handleMenuItemClick(event, index)}
                  >
                    {example.name}
                  </MenuItem>
                ))}
              </Menu>
            </List>
          </Grid>
          <Grid item xs={12}>
            {examples &&
              <ExamplePairing
                uiSchema={uiSchema}
                paramStructure={paramStructure}
                examplePairing={examples[this.state.selectedIndex] as ExamplePairingObject}
                methodName={this.props.method && this.props.method.name as any}
                reactJsonOptions={this.props.reactJsonOptions} />}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    );
  }
}

export default ExamplePairings;
