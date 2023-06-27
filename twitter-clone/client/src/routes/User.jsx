import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Card, CardContent, Typography } from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import Feed from "../components/Feed";
import Error from "../components/Error";

const User = ({ match: { params } }) => {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`/users/${params.id}`)
      .then(({ data: { user } }) => setUser(user))
      .catch(({ response }) => {
        if (response.status === 404) setMsg(response.data.msg);
        if (response.status === 500) setMsg("Internal Server Error");
      });
    axios
      .get(`/tweets/user/${params.id}`)
      .then(({ data: { tweets } }) => setTweets(tweets))
      .catch((err) => console.log(err));
  }, [params.id]);

  if (!user) return <Error title="Error" msg={msg} />;

  return (
    <>
      <Box my={2}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </Box>

      <Box color="primary" my={2} marginLeft={-60} position={'absolute'} width={300}
      justifyContent="center" alignItems="center">
        <Card variant="outlined" style={{height:700, backgroundColor:'#6495ED'}}>
          <CardContent align="center">
            <Typography variant="h5" align="center" style={{color:'white'}}>
              @{user.username}
            </Typography>
            <Typography variant="body1" style={{color:'white',paddingTop:20}} align="center">
              {tweets.length} Tweet{tweets.length !== 1 && "s"}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Feed tweets={tweets} />
    </>
  );
};

export default User;
