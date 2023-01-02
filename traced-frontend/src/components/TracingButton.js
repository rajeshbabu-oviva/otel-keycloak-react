import { Button } from "@mui/material";

import { traceSpan } from "../helpers/tracing";

const TracingButton = (props) => {
  const onClick = () =>
    traceSpan(`'${props.label}' button clicked`, props.onClick);

  return (
    <div>
      <Button
        id={props.id}
        variant={"contained"}
        color={props.secondary ? "secondary" : "primary"}
        onClick={onClick}
      >
        {props.label}
      </Button>
    </div>
  );
};

export default TracingButton;
