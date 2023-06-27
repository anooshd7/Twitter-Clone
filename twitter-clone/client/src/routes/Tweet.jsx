// import React, { useState, useEffect, useContext } from "react";
// import { Link as RouterLink } from "react-router-dom";
// import axios from "axios";
// import moment from "moment";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Link,
// } from "@material-ui/core";
// import {
//   Favorite as FavoriteIcon,
//   ArrowBack as ArrowBackIcon,
//   Delete as DeleteIcon
// } from "@material-ui/icons";

// import { AuthContext } from "../AuthContext";

// import Error from "../components/Error";

// const Tweet = ({ match: { params } }) => {

//   const [tweet, setTweet] = useState(null);
//   const [msg, setMsg] = useState("");

//   const { token, user } = useContext(AuthContext);
//   console.log(params.id);

//   useEffect(() => {
//     axios
//       .get(`/tweets/${params.id}`)
//       .then(({ data: { tweet } }) => setTweet(tweet))
//       .catch(({ response }) => {
//         if (response.status === 404) setMsg(response.data.msg);
//         if (response.status === 500) setMsg("Internal Server Error");
//       }); 

      
//   }, [params.id]);

//   if (!tweet) return <Error title="Tweet has been deleted" msg={msg} />;

//   const liked = user && tweet.likes.filter((x) => x._id === user._id).length;

//   const like = () => {
//     if (user)
//       (!liked
//         ? axios.post(
//             `/tweets/like`,
//             { id: tweet._id },
//             { headers: { Authorization: `Bearer ${token}` } }
//           )
//         : axios.delete(`/tweets/like`, {
//             data: { id: tweet._id },
//             headers: { Authorization: `Bearer ${token}` },
//           })
//       )
//         .then(({ data: { tweet } }) => setTweet(tweet))
//         .catch((err) => console.dir(err));
//   };

  
//   const deleteTweet = () => {
//       axios
//         .delete(`/tweets/${tweet._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then(() => {
//           // Tweet deleted successfully, you can redirect to another page or handle it as needed.
//           setTweet(null);
//           console.log("Tweet deleted successfully");
//         })
//         .catch((err) => {
//           console.error(err);
//           // Handle the error, display an error message, or perform any necessary actions.
//         });
//     };
    

//     return (
//       <>
//         <Box my={2}>
//           <Button
//             variant="contained"
//             size="small"
//             startIcon={<ArrowBackIcon />}
//             onClick={() => window.history.back()}
//           >
//             Back
//           </Button>
//         </Box>
//         <Box my={2}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography variant="h6" paragraph>
//                 <Link
//                   component={RouterLink}
//                   to={`/user/${tweet.user._id}`}
//                   color="inherit"
//                 >
//                   @{tweet.user.username}
//                 </Link>
//               </Typography>
//               <Typography variant="h5" paragraph>
//                 {tweet.tweet}
//               </Typography>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Typography variant="body2">
//                   {moment.unix(tweet.date).format("LLLL")}
//                   <br />
//                   {tweet.likes.length} Like
//                   {tweet.likes.length !== 1 && "s"}
//                 </Typography>
                
//                 {user && (
//                   <>
                    
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       startIcon={<FavoriteIcon />}
//                       onClick={like}
//                     >
//                       {liked ? "Liked" : "Like"}
//                     </Button>
//                     {user._id === tweet.user._id && (
//                       <Button
//                         variant="contained"
//                         color="secondary"
//                         startIcon={<DeleteIcon />}
//                         onClick={deleteTweet}
                        
//                       >
//                         Delete
//                       </Button>
                      
//                     )}
                    
//                   </>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Box>
//       </>
//     );
// };

// export default Tweet;