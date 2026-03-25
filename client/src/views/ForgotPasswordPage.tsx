import React, { useState } from "react";
import { 
    Box, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton, 
    Typography, 
    TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { SecurityQA, SecurityQuestions } from "../types/auth-types";
import { sendForgotPassReq } from "../api/service";

const ForgotPasswordPage = () => {
    const baseSecurityQA: SecurityQA = {
            securityQues1: SecurityQuestions.QUESTION1,
            securityAns1: "",
            securityQues2: SecurityQuestions.QUESTION1,
            securityAns2: ""
        }

    const [email, setEmail] = useState<string>("");
    const [securityQA, setSecurityQA] = useState<SecurityQA>(baseSecurityQA);

    const navigate = useNavigate();


    // Security QA changes
    const changeSecurityQues1 = (securityQues1: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityQues1: securityQues1 as SecurityQuestions
        }));
    }

    const changeSecurityQues2 = (securityQues2: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityQues2: securityQues2 as SecurityQuestions
        }));
    }

    const changeSecurityAns1 = (securityAns1: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityAns1: securityAns1
        }));
    }

    const changeSecurityAns2 = (securityAns2: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityAns2: securityAns2
        }));
    }

    const securityQuestionOptions = (): JSX.Element[] => {
        const securityQuestions = Object.values(SecurityQuestions).map((securityQues, idx) => {
            return (
                <MenuItem
                    key={idx}
                    value={securityQues}
                >
                    {securityQues}
                </MenuItem>
            );
        })
        return securityQuestions;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#E2E8F0",
                height: "550px",
                width: "675px",
                borderWidth: "thick",
                borderRadius: "15px",
                paddingTop: "15px",
                paddingBottom: "10px",
                boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    paddingBottom: "20px"
                }}
            >
                <IconButton
                    onClick={() => navigate("/")}
                >
                    <ChevronLeftOutlinedIcon />
                </IconButton>
                <Typography
                    variant="h5"
                    sx={{
                        alignContent: "center",
                    }}
                >
                    Forgot Password
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5
                }}
            >
                <Typography>Enter your email</Typography>
                <TextField
                    required
                    label="Email"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    sx={{
                        minWidth: 400
                    }}
                />
                <Typography>Answer the security questions to verify your identity</Typography>
                <FormControl
                    required
                >
                    <InputLabel id="security-question-1">Security Question 1</InputLabel>
                    <Select 
                        labelId="security-question-1"
                        label="Security Question 1"
                        defaultValue={""}
                        onChange={(e) => changeSecurityQues1(e.target.value)}
                        sx={{
                            minWidth: 400
                        }}
                    >
                        {securityQuestionOptions()}
                    </Select>
                </FormControl>

                {/* security ans 1 */}
                <TextField
                    label="Answer"
                    required
                    value={securityQA.securityAns1}
                    onChange={(e) => changeSecurityAns1(e.target.value)}
                    sx={{
                        minWidth: 400
                    }}
                />
                <FormControl
                    required
                >
                    <InputLabel id="security-question-2">Security Question 2</InputLabel>
                    <Select 
                        labelId="security-question-2"
                        label="Security Question 2"
                        defaultValue={""}
                        onChange={(e) => changeSecurityQues2(e.target.value)}
                        sx={{
                            minWidth: 400
                        }}
                    >
                        {securityQuestionOptions()}
                    </Select>
                </FormControl>
                
                {/* security ans 2 */}
                <TextField 
                    label="Answer"
                    required
                    value={securityQA.securityAns2}
                    onChange={(e) => changeSecurityAns2(e.target.value)}
                    sx={{
                        minWidth: 400
                    }}
                />
            </Box>
            <Button
                size="large"
                onClick={() => sendForgotPassReq(email)}
                sx={{
                    alignSelf: "center",
                    width: "250px",
                    color: "white",
                    backgroundColor: "#10B981",
                    margin: "20px 0 20px 0"
                }}
            >
                Sumbit
            </Button>
        </Box>
    )
}

export default ForgotPasswordPage;