import React, { useState, useEffect } from "react";
import axios from "axios";
import Feed from "../components/Feed";
import NewTweet from "../components/NewTweet";

const Dashboard = () => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    axios
      .get("/tweets")
      .then(({ data: { tweets } }) => setTweets(tweets))
      .catch((err) => console.log(err));

      
  }, []);
  const newTweet = (tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    console.log("Tweets updated:", tweets);
  }, [tweets]);

  //console.log(tweets)
  return (
    <>
      <NewTweet newTweet={newTweet} />
      <Feed tweets={tweets} />

      
    </>
  );
};

export default Dashboard;
