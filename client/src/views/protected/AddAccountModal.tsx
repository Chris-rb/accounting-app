import React, { useState, useEffect } from "react"
import {
    Box, 
    Container, 
    Divider,
    TextField, 
    Typography, 
    FormControl,
    InputLabel,
    IconButton,
    Select, 
    MenuItem,
    Modal,
    Button
} from "@mui/material";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { validatePassword } from "../../helpers";
import { Address, State } from "../../types/userdata-types";
import { SecurityQA, SecurityQuestions, Roles } from "../../types/auth-types";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createUser } from "../../api/service";
import { useAuth } from "../../context/AuthContext";

interface Props {
    open: boolean,
    handleClose: () => void
}

interface BaseUser {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    dateOfBirth: Date | undefined,
    role?: string,
} 

const AddAccountModal = ({ open, handleClose }: Props): JSX.Element => {
    const baseUser: BaseUser = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        dateOfBirth: undefined
    }

    const baseAddress: Address = {
        addressLine1: "",
        addressLine2: null,
        city: "",
        state: "",
        zipcode: 0
    }

    const baseSecurityQA: SecurityQA = {
        securityQues1: SecurityQuestions.QUESTION1,
        securityAns1: "",
        securityQues2: SecurityQuestions.QUESTION1,
        securityAns2: ""
    }

    const [newUser, setNewUser] = useState<BaseUser>(baseUser);
    const [address, setAddress] = useState<Address>(baseAddress);
    const [securityQA, setSecurityQA] = useState<SecurityQA>(baseSecurityQA);
    const [reconfirmedPass, setReconfirmedPass] = useState<string>("");
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const { user } = useAuth();

    // User changes
    const changeFirstname = (firstname: string) => {
        setNewUser(() => ({
            ...newUser,
            firstname: firstname
        }));
    };

    const changeLastname = (lastname: string) => {
        setNewUser(() => ({
            ...newUser,
            lastname: lastname
        }));
    };

    const changeDateOfBirth = (dob: Date | undefined) => {
        if (dob) {
            setNewUser(() => ({
                ...newUser,
                dateOfBirth: dob
            }));
        }
    };

    const changeEmail = (email: string) => {
        setNewUser(() => ({
            ...newUser,
            email: email
        }));
    };

    const changePassword = (password: string) => {
        setNewUser(() => ({
            ...newUser,
            password: password
        }));
    };

    const changeRole = (role: string) => {
        setNewUser(() => ({
            ...newUser,
            role: role as Roles
        }));
    };


    // Address changes
    const changeAddressLine1 = (addressLine1: string) => {
        setAddress(() => ({
            ...address,
            addressLine1: addressLine1
        }));
    };

    const changeAddressLine2 = (addressLine2: string) => {
        setAddress(() => ({
            ...address,
            addressLine2: addressLine2
        }));
    };

    const changeCity = (city: string) => {
        setAddress(() => ({
            ...address,
            city: city
        }));
    };

    const changeState = (state: string) => {
        setAddress(() => ({
            ...address,
            state: state as State
        }));
    };

    const changeZipcode = (zipcode: number) => {
        setAddress(() => ({
            ...address,
            zipcode: zipcode
        }));
    };


    // Security QA changes
    const changeSecurityQues1 = (securityQues1: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityQues1: securityQues1 as SecurityQuestions
        }));
    };

    const changeSecurityAns1 = (securityAns1: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityAns1: securityAns1
        }));
    };

    const changeSecurityQues2 = (securityQues2: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityQues2: securityQues2 as SecurityQuestions
        }));
    };
    
    const changeSecurityAns2 = (securityAns2: string) => {
        setSecurityQA(() => ({
            ...securityQA,
            securityAns2: securityAns2
        }));
    };

    const stateSelections = (): JSX.Element[] => {
        const states = Object.values(State).map((state, idx) => {
            return <MenuItem key={idx} value={state}>{state}</MenuItem>;
        })
        return states;
    };

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
    };

    const roleOptions = (): JSX.Element[] => {
        const roleSelections = Object.values(Roles).map((role, idx) => {
            return (
                <MenuItem
                    key={idx}
                    value={role}
                >
                    {role}
                </MenuItem>
            );
        })
        return roleSelections;
    };

    useEffect (() => {
        setPasswordsMatch(reconfirmedPass === newUser.password)
    }, [reconfirmedPass, newUser.password])

    useEffect(() => {
        setIsValid(validatePassword(newUser.password));
    }, [newUser.password]);

    useEffect(() => {
        console.log(newUser);
        console.log(address);
        console.log(securityQA);
        setCanSubmit(() => {
            const userDetailsComplete =  Object.values(newUser).every((value): boolean => {
                return value !== "" && value !== 0 && value !== undefined && value !== null
            });

            const addrDetailsComplete = Object.entries(address).every(([key, value]): boolean => {
                return (
                    key === "addressLine2" || value !== "" && value !== 0 && value !== undefined && value !== null
                );
            });

            const securityDetailsComplete = Object.values(securityQA).every((value): boolean => {
                return value !== "" && value !== 0 && value !== undefined && value !== null
            });

            console.log(userDetailsComplete);
            console.log(addrDetailsComplete);
            console.log(securityDetailsComplete);
            return userDetailsComplete && addrDetailsComplete && securityDetailsComplete;
        });
    }, [newUser, address, securityQA])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                overflowY: "scroll",
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "25px",
                            margin: "65px",
                            width: "600px",
                            maxWidth: "750px",
                            backgroundColor: "#E2E8F0",
                            borderRadius: "15px",
                            boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <IconButton
                                onClick={() => handleClose()}
                            >
                                <ChevronLeftOutlinedIcon
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            </IconButton>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: "white",
                                    alignSelf: "center"
                                }}
                            >
                                Create Account
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                color: "white",
                                padding: "25px 25px 0 25px",
                            }}
                        >
                            Enter the user's personal information and assign them a role:
                        </Typography>
                        <Container
                            className="grid-container"
                            sx={{
                                paddingTop: "20px",
                                paddingBottom: "25px",
                                display: "grid",
                                gridGap: 10,
                                gridTemplateColumns: "200px",
                                gridTemplateAreas: 
                                `"grid-item-1 grid-item-1 grid-item-1 grid-item-2 grid-item-2"
                                "grid-item-3 grid-item-3 grid-item-3 grid-item-4 grid-item-4"
                                "grid-item-5 grid-item-5 grid-item-5 grid-item-5 grid-item-5"
                                "grid-item-6 grid-item-6 grid-item-6 grid-item-6 grid-item-6"
                                "grid-item-7 grid-item-7 grid-item-7 grid-item-7 grid-item-7"`,
                            }}
                        >
                            {/* Enter information summary/process text */}
                            {/* firstname */} {/* lastname */}
                            <TextField
                                label="Fisrtname"
                                required
                                value={newUser.firstname}
                                color="info"
                                onChange={(e) => changeFirstname(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-1",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            <TextField
                                label="Lastname"
                                required
                                value={newUser.lastname}
                                onChange={(e) => changeLastname(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-2",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            {/* email */}
                            <TextField
                                label="Email"
                                type="email"
                                required
                                value={newUser.email}
                                onChange={(e) => changeEmail(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-3",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            {/* date of birth calendar */}
                            <DatePicker 
                                label="Date of Birth"
                                onChange={(e) => changeDateOfBirth(e?.toDate())}
                                sx={{
                                    gridArea: "grid-item-4",
                                    '& .MuiPickersInputBase-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            {/* password */}
                            <TextField
                                label="Password"
                                type="password"
                                required
                                value={newUser.password}
                                error={!isValid && newUser.password !== ""}
                                onChange={(e) => changePassword(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-5",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            {/* password */}
                            <TextField
                                label="Re-enter Password"
                                type="password"
                                required
                                error={!passwordsMatch && reconfirmedPass !== ""}
                                onChange={(e) => setReconfirmedPass(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-6",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            {user?.role === Roles.ADMIN && 
                            <FormControl
                                required
                                sx={{
                                    gridArea: "grid-item-7",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            >
                                <InputLabel id="role">Role</InputLabel>
                                <Select 
                                    labelId="role"
                                    label="Role"
                                    defaultValue={""}
                                    onChange={(e) => changeRole(e.target.value)}
                                >
                                    {roleOptions()}
                                </Select>
                            </FormControl>}
                        </Container>
                        <Divider sx={{backgroundColor: "white"}}/>
                        <Typography
                            sx={{
                                color: "white",
                                padding: "25px 25px 0 25px",
                            }}
                        >
                            Enter the user's address:
                        </Typography>
                        <Container
                            className="grid-container-2"
                            sx={{
                                paddingTop: "20px",
                                paddingBottom: "25px",
                                display: "grid",
                                gridGap: 10,
                                gridTemplateColumns: "200px",
                                gridTemplateAreas: 
                                `"grid-item-7 grid-item-7 grid-item-7"
                                "grid-item-8 grid-item-8 grid-item-8"
                                "grid-item-9 grid-item-10 grid-item-11"`,
                            }}
                        >
                            {/* address
                                street address
                                city
                                state
                                zipcode */}

                            <TextField 
                                label="Address Line 1"
                                required
                                value={address.addressLine1}
                                onChange={(e) => changeAddressLine1(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-7",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            <TextField 
                                label="Address Line 2"
                                value={address.addressLine2 || ""}
                                onChange={(e) => changeAddressLine2(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-8",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            <TextField 
                                label="City"
                                required
                                value={address.city}
                                onChange={(e) => changeCity(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-9",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                            <FormControl
                                required
                                sx={{
                                    gridArea: "grid-item-10",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            >
                                <InputLabel id="state-option">State</InputLabel>
                                <Select 
                                    labelId="state-option"
                                    label="state"
                                    onChange={(e) => changeState(e.target.value)}
                                    value={address.state}
                                    defaultValue={""}
                                >
                                    {stateSelections()}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Zipcode"
                                type="number"
                                required
                                onChange={(e) => changeZipcode(parseInt(e.target.value))}
                                sx={{
                                    gridArea: "grid-item-11",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                        </Container>
                        <Divider sx={{backgroundColor: "white"}}/>
                        <Typography
                            sx={{
                                color: "white",
                                padding: "25px 25px 0 25px",
                            }}
                        >
                            Select from and answer security questions:
                        </Typography>
                        <Container
                            className="grid-container-3"
                            sx={{
                                paddingTop: "20px",
                                paddingBottom: "25px",
                                display: "grid",
                                gridGap: 10,
                                gridTemplateColumns: "200px",
                                gridTemplateAreas: 
                                `"grid-item-12 grid-item-12 grid-item-12 grid-item-12"
                                "grid-item-13 grid-item-13 grid-item-13 grid-item-13"
                                "grid-item-14 grid-item-14 grid-item-14 grid-item-14"
                                "grid-item-15 grid-item-15 grid-item-15 grid-item-15"`,
                            }}
                        >
                            {/* security ques 1 dropdown */}
                            <FormControl
                                required
                                sx={{
                                    gridArea: "grid-item-12",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            >
                                <InputLabel id="security-question-1">Security Question 1</InputLabel>
                                <Select 
                                    labelId="security-question-1"
                                    label="Security Question 1"
                                    defaultValue={""}
                                    onChange={(e) => changeSecurityQues1(e.target.value)}
                                >
                                    {securityQuestionOptions()}
                                </Select>
                            </FormControl>

                            {/* security ans 1 */}
                            <TextField
                                label="Answer"
                                required
                                value={securityQA.securityAns1}
                                onChange={(e) => changeSecurityAns1(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-13",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />

                            {/* security ques 2 dropdown */}
                            <FormControl
                                required
                                sx={{
                                    gridArea: "grid-item-14",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            >
                                <InputLabel id="security-question-2">Security Question 2</InputLabel>
                                <Select 
                                    labelId="security-question-2"
                                    label="Security Question 2"
                                    defaultValue={""}
                                    onChange={(e) => changeSecurityQues2(e.target.value)}
                                >
                                    {securityQuestionOptions()}
                                </Select>
                            </FormControl>
                            
                            {/* security ans 2 */}
                            <TextField 
                                label="Answer"
                                required
                                value={securityQA.securityAns2}
                                onChange={(e) => changeSecurityAns2(e.currentTarget.value)}
                                sx={{
                                    gridArea: "grid-item-15",
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                    },
                                }}
                            />
                        </Container>
                        {/* create_account/ submit button */}
                        <Button
                            disabled={!canSubmit}
                            size="large"
                            onClick={() => createUser(newUser, address, securityQA)}
                            sx={{
                                alignSelf: "center",
                                width: "250px",
                                color: "white",
                                backgroundColor: "#10B981",
                                margin: "25px 0 20px 0"
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </div>
            </LocalizationProvider>
        </Modal>
    )
}

export default AddAccountModal;