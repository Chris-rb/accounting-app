import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { validatePassword } from '../helpers';
import { resetPassReq } from "../api/service";


const ResetPasswordPage = (): JSX.Element => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isValidPassword, setIsValidPassword] = useState<boolean>(false);

    const { token } = useParams();
    const jwtToken: string = token ?? "";

    useEffect(() => {
        setIsValidPassword(validatePassword(newPassword) && newPassword === confirmPassword);
    }, [newPassword, confirmPassword])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#E2E8F0",
                alignItems: "center",
                justifyContent: "center",
                height: "450px",
                width: "550px",
                paddingTop: "15px",
                paddingBottom: "10px",
                borderWidth: "thick",
                borderRadius: "15px",
                boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
            }}
        >
            <Typography>
                Reset Password
            </Typography>
            <TextField 
                label="New Password"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField 
                label="Confirm New Password"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
                disabled={!isValidPassword}
                onClick={() => resetPassReq(newPassword, jwtToken)}
            >
                Sumbit
            </Button>
        </Box>
    )
};

export default ResetPasswordPage;