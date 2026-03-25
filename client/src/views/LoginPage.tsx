import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Box,
  Button,
  ButtonBase, 
  Container, 
  TextField, 
  Typography 
} from "@mui/material";

import { validatePassword } from '../helpers';
import { login } from '../api/service';
import { User } from '../types/userdata-types';
import { useAuth} from '../context/AuthContext';


const LoginPage = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
    // const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loginDisabled, setLoginDisabled] = useState<boolean>(true);
    const [invalidLogins, setInvalidLogins] = useState<number>(0);
    
    const authUser = useAuth();
    const navigate = useNavigate()
    

    const handleLogin = (resp: User | null) => {
      if (resp){
        console.log(resp)
        const authUserData = {...resp}
        authUserData.passwordExpiry = new Date(authUserData.passwordExpiry)
        authUserData.dateOfBirth = new Date(authUserData.dateOfBirth)
        authUserData.permissions = [""] // to update
        console.log(authUserData) // to remove
        authUser.setAuthUser(authUserData)
        console.log(authUser.user) // to remove
      }
      else {
        console.log("There was an error processing the request");
        setInvalidLogins(invalidLogins + 1);
        return;
      }
    }
  
    // Checks if password is valid anytime the input for the password updates
    useEffect(() => {
      const isValid = validatePassword(password);
      setIsValidPassword(isValid);
      setLoginDisabled(!isValid || username === "");
      // setErrorMessage("invalid pass")
    },[password, username]);

    useEffect(() => {
      if (authUser.user) {
        console.log(authUser.user);
        navigate("/chart-of-accounts");
      }
    }, [authUser.user, navigate]);

    useEffect(() => {
      if (invalidLogins >= 3) {
        console.log(`${invalidLogins} failed login attempts. Setting 5 miinute login timeout.`)
        setLoginDisabled(invalidLogins >= 3); //change to a timeout func
      }
    }, [invalidLogins]);
  
    return (
      <>
        <Box>
          <Container 
            className="login-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "#E2E8F0",
              height: "450px",
              width: "550px",
              borderWidth: "thick",
              borderRadius: "15px",
              paddingTop: "15px",
              paddingBottom: "10px",
              boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
            }}
          >
            <Typography sx={{color: "black"}} variant='h4'> Accounting App</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}
            >
              <TextField 
                label="username"
                required
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                  },
                }}
              />
              <TextField 
                label="password"
                type='password'
                required
                error={!isValidPassword && password !== "" }
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                  },
                }}
              />
            </Box>
            <ButtonBase
              sx={{
                textDecoration: "underline",
                color: "white",
                fontSize: "1rem"
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </ButtonBase>
            <Button
                disabled={loginDisabled}
                size="large"
                sx={{
                    color: "white",
                    backgroundColor: "#10B981",
                    '&.Mui-disabled': {
                      background: "#3f3f3f",
                      color: "#6a6a6a", 
                      opacity: 0.5
                    },
                }}
                onClick={async () => handleLogin(await login(username, password))}
            >
                Login
            </Button>
            <Typography
              sx={{
                color: "white",
              }}
            >
              Don't have an account? 
              <ButtonBase
                sx={{
                  marginLeft: "5px",
                  color: "white",
                  textDecoration: "underline",
                  fontSize: "1rem"
                }}
                onClick={() => navigate("/create-account")}
              >
                Signup
              </ButtonBase>
            </Typography>
          </Container>
        </Box>
      </>
    )
}

export default LoginPage