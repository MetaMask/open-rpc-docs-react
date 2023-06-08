# @metamask/open-rpc-docs-react

OpenRPC documentation as a react component

#### What is this?

This is a react component that will render documentation for a given OpenRPC document.

#### How do I use this?

##### Installation:

```
npm install --save @metamask/open-rpc-docs-react
```

##### Usage:

```
import Method from "@metamask/open-rpc-docs-react";
```

and then use it somewhere in a project:

```
<Method method={method} />
```

## Development

### Linking

When linking this project with others, use `yarn link:setup` to avoid getting errors about hooks / multiple react versions.
