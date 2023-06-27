import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [msg, setMsg] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { login } = useContext(AuthContext);

  const reset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setCpassword("");
    setMsg("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password should contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setMsg("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      setMsg(
        "Password should contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit"
      );
      return;
    }
    if (password !== cpassword) {
      setMsg("Passwords do not match");
      return;
    }
    axios
      .post("/users", { username, email, password })
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
    <Box marginTop={8} color="primary">
      <Card variant="outlined" style={{ backgroundColor: "#6495ED", padding: 20 }}>
        <CardContent>
          <Typography variant="h4" align="center" style={{ color: "white" }}>
            Sign Up
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
              style={{ backgroundColor: "white", borderRadius: 5 }}
            />
            <TextField
              name="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={msg}
              variant="outlined"
              margin="normal"
              fullWidth
              style={{ backgroundColor: "white", borderRadius: 5 }}
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
              style={{ backgroundColor: "white", borderRadius: 5 }}
            />
            <TextField
              name="cpassword"
              type="password"
              label="Confirm Password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              error={msg}
              variant="outlined"
              margin="normal"
              fullWidth
              style={{ backgroundColor: "white", borderRadius: 5 }}
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Typography color="error">{msg}</Typography>
              <span>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "black" }}
                  color="primary"
                >
                  Sign Up
                </Button>
              </span>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Box marginTop={4} align="center">
        <Typography display="inline">Already have an account? </Typography>
        <Typography
          variant="h7"
          component={Link}
          to={`/login`}
          style={{ color: "black", fontWeight: "bold" }}
          display="inline"
        >
          Log In
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
