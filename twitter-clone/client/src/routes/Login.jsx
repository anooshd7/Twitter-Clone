import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

import { AuthContext } from "../AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { login } = useContext(AuthContext);

  const reset = () => {
    setUsername("");
    setPassword("");
    setMsg("");
  };

  const validateUsername = (username) => {
    // Your username validation regex
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    // Your password validation regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateUsername(username)) {
      setMsg(
        "Username should be 3 to 20 characters long and can only contain letters, numbers, and underscores"
      );
      return;
    }
    if (!validatePassword(password)) {
      setMsg(
        "Password should contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit"
      );
      return;
    }
    axios
      .post("/auth", { username, password })
      .then(({ data: { token, user } }) => {
        login(token, user);
        setRedirect(true);
      })
      .catch(({ response }) => {
        if (response.status === 400) setMsg(response.data.msg);
        if (response.status === 500) setMsg("Internal Server Error");
      });
  };

  if (redirect) return <Redirect to="/" />;

  return (
    <Box my={3} marginTop={8} height={30} align="center" style={{ padding: 30 }}>
      <Card variant="outlined" style={{ backgroundColor: "#6495ED", padding: 20 }}>
        <CardContent>
          <Typography variant="h4" align="center" style={{ color: "white" }}>
            Login
          </Typography>
          <form onSubmit={submit} onReset={reset}>
            <TextField
              name="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={msg}
              variant="outlined"
              margin="normal"
              fullWidth
              autoFocus
              style={{ backgroundColor: "white" }}
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={msg}
              variant="outlined"
              margin="normal"
              fullWidth
              style={{ backgroundColor: "white" }}
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Typography color="error">{msg}</Typography>
              <span>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "black" }}
                  color="primary"
                >
                  Log In
                </Button>
              </span>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Box marginTop={5} align="center">
        <Typography display="inline">Don't have an account? </Typography>
        <Typography
          variant="h7"
          component={Link}
          to={`/SignUp`}
          style={{ color: "black", fontWeight: "bold" }}
          display="inline"
        >
          Sign up here
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
