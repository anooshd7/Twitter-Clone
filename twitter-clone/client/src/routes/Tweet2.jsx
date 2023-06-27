import React, { useState, useEffect, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Link,
} from "@material-ui/core";
import {
  FavoriteBorder as FavoriteIcon,
  Favorite,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  
} from "@material-ui/icons";
import {FavoriteIcon as Like} from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { AuthContext } from "../AuthContext";

import Error from "../components/Error";

const Tweet2 = ({tweetID}) => {
  const [tweet, setTweet] = useState(null);
  const [msg, setMsg] = useState("");
  const [flag, setFlag] = useState(false);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/tweets/${tweetID}`)
      .then(({ data: { tweet } }) => setTweet(tweet))
      .catch(({ response }) => {
        if (response.status === 404) setMsg(response.data.msg);
        if (response.status === 500) setMsg("Internal Server Error");
      }); 

    // console.log({tweet});
      
  }, []);

  //console.log({tweet});

  if (!tweet) return <></>;

  const liked = user && tweet.likes.filter((x) => x._id === user._id).length;
  //console.log(liked);

  const like = () => {
    if (user)
      (!liked
        ? axios.post(
            `/tweets/like`,
            { id: tweet._id },
            { headers: { Authorization: `Bearer ${token}` } },
            setFlag(true)
          
          )
        : axios.delete(`/tweets/like`, {
            data: { id: tweet._id },
            headers: { Authorization: `Bearer ${token}` }},
          setFlag(false)
          )
      )
        .then(({ data: { tweet } }) => setTweet(tweet))
        .catch((err) => console.dir(err));

    
  };

  
  const deleteTweet = () => {
      axios
        .delete(`/tweets/${tweet._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setTweet(null);
          //console.log("Tweet deleted successfully");
        })
        .catch((err) => {
          console.error(err);
        });

        // return (
        //    <Error title="Tweet has been deleted" msg={msg} />
        // );
    };
    

    return (
      <>
        <Box my={2}>
          <Card variant="outlined">
            <CardContent>
              <Box style={{display:'flex' , flexDirection:'row',
          m: 1}}>
              <Typography style={{fontSize:16}} paragraph>
                <Link
                  component={RouterLink}
                  to={`/user/${tweet.user._id}`}
                  color="inherit"
                >
                  @{tweet.user.username}
                </Link>
              </Typography>
              <Typography variant="body2" style={{paddingLeft:10, paddingTop:3,fontSize:13}}>
                  {moment.unix(tweet.date).format("LLL")}
                  <br />
                  
              </Typography>
              </Box>
              <Typography style={{fontSize:21}} paragraph>
                {tweet.tweet}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                
                {user && (
                  <>
                    
                    <Button
                      variant="text"
                      color={flag ? "primary":"default"}
                      
                      startIcon={liked? <Favorite/>:<FavoriteIcon />}
                      onClick={like}
                    >
                      {tweet.likes.length} Like
                      {tweet.likes.length !== 1 && "s"}
                      
                    </Button>
                    {user._id === tweet.user._id && (
                      <Button
                        variant="contained"
                        style={{color:"red",backgroundColor:"#FFA8B5"}}
                        startIcon={<DeleteIcon />}
                        onClick={deleteTweet}
                        
                      >
                        Delete
                      </Button>
                      
                    )}
                    
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </>
    );
};

export default Tweet2;