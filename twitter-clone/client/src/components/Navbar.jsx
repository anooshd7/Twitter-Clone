import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" >
      <Container maxWidth="sm">
        <Toolbar component={Box} display="flex" justifyContent="space-between">
          <Button
            color="inherit"
            size="large"
            component={Link}
            to="/"
            style={{ textTransform: "none" }}
          >
            <Typography variant="h6">Twitter Clone</Typography>
          </Button>
          <Box>
            {user ? (
              <>
                <Button
                  color="inherit"
                  size="large"
                  component={Link}
                  to={`/user/${user._id}`}
                >
                  {user.username}
                </Button>
                <Button color="inherit" size="large" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  size="large"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  size="large"
                  component={Link}
                  to="/SignUp"
                >
                  Sign Up
                </Button>
              </>
            )}
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;