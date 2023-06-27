import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
} from "@material-ui/core";
import moment from "moment";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import Tweet2 from "../routes/Tweet2";

const Feed = () => {
  const [sortType, setSortType] = useState("time");
  const [currentPage, setCurrentPage] = useState(1);
  const { token, user } = useContext(AuthContext);
  const [tweets, setTweets] = useState([]);
  const cachedSortedTweets = useMemo(() => new Map(), []);

  useEffect(() => {
    fetchTweets();
  }, [sortType]);

  const fetchTweets = async () => {
    try {
      if (cachedSortedTweets.has(sortType)) {
        setTweets(cachedSortedTweets.get(sortType));
      } else {
        const response = await axios.get(`/tweets?sort=${sortType}`);
        const sortedTweets = response.data.tweets;
        setTweets(sortedTweets);
        cachedSortedTweets.set(sortType, sortedTweets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortByTime = () => {
    setSortType("time");
  };

  const handleSortByLikes = () => {
    setSortType("likes");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tweetsPerPage = 10;

  // Display based on the current page
  const getTweetsRange = () => {
    const startIndex = (currentPage - 1) * tweetsPerPage;
    const endIndex = startIndex + tweetsPerPage;
    return [startIndex, endIndex];
  };

  // Get the range of tweets to display based on the current page
  const [startIndex, endIndex] = getTweetsRange();
  const tweetsToDisplay = tweets.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tweets.length / tweetsPerPage);

  return (
    <Box my={3}>
      <ButtonGroup orientation="horizontal" size="large" fullWidth={true}>
        <Button
          variant="outlined"
          onClick={handleSortByTime}
          color={sortType === "time" ? "primary" : "default"}
        >
          Recent
        </Button>
        <Button
          variant="outlined"
          onClick={handleSortByLikes}
          color={sortType === "likes" ? "primary" : "default"}
        >
          Popular
        </Button>
      </ButtonGroup>
      {tweetsToDisplay.map((tweet) => (
        <Box key={tweet._id}>
          <Tweet2 tweetID={tweet._id} />
        </Box>
      ))}

      <Box align="center">
        <ButtonGroup style={{ width: 200 }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              color={currentPage === index + 1 ? "primary" : "default"}
            >
              {index + 1}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default Feed;

