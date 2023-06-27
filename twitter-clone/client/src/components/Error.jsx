import React from "react";
import { Box, Card, CardContent, Typography } from "@material-ui/core";

const Error = ({ title, msg }) => (
  <Box my={3}>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography>{msg}</Typography>
      </CardContent>
    </Card>
  </Box>
);

export default Error;
