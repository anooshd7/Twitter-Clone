import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, Card, CardContent, TextField, Button } from "@material-ui/core";
import DOMPurify from "dompurify";
import { AuthContext } from "../AuthContext";

const NewTweet = (props) => {
  const [tweet, setTweet] = useState("");
  const [msg, setMsg] = useState("");

  const { token } = useContext(AuthContext);

  const submit = (e) => {
    e.preventDefault();
    const sanitizedTweet = DOMPurify.sanitize(tweet); // Sanitize the tweet input
    axios
      .post(
        "/tweets",
        { tweet: sanitizedTweet },
        { headers: { Authorization: `Bearer: ${token}` } }
      )
      .then((res) => {
        props.newTweet(res.data.tweet);
        setTweet("");
      })
      .catch(({ response }) => {
        if (response.status === 400 || response.status === 401)
          setMsg(response.data.msg);
        if (response.status === 500) setMsg("Internal Server Error");
      });
  };
  
  return (
    <Box my={3}>
      <Card variant="outlined">
        <CardContent>
          <form onSubmit={submit}  autoComplete="off">
            <TextField
              name="tweet"
              label="Tweet"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)
              }
              error={msg}
              helperText={
                msg ||
                `${tweet.length} character${tweet.length === 1 ? "" : "s"}`
              }
              variant="outlined"
              margin="none"
              multiline
              rows={4}
              fullWidth
              required
              inputProps={{ maxLength: 140 }}
            />
            <Box textAlign="right">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewTweet;
