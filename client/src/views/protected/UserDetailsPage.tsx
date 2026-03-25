import React, { useState } from "react";
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
    Button
} from "@mui/material";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useLocation } from "react-router-dom";
import SuspendUserModal from "./SuspendUserModal";
import DeactivateUserModal from "./DeactivateUserModal";
import { Address, State } from "../../types/userdata-types";
import { Roles } from "../../types/auth-types";
import { User } from "../../types/userdata-types";
import { updateUser } from "../../api/service";
import dayjs from 'dayjs';



const UserDetailsPage = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state || {}

    const [editable, setEditable] = useState<boolean>(false);
    const [suspendUser, setSuspendUser] = useState<boolean>(false);
    const [deactivateUser, setDeactivateUser] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<User>(user);
    const [address, setAddress] = useState<Address>(user.address);

    const handleCloseSuspendModal = () => {
        setSuspendUser(false)
    }

    const handleCloseDeactModal = () => {
        setDeactivateUser(false);
    }

    const toggleEditUser = () => {
        setEditable(!editable)
    }

    // User changes
    const changeFirstname = (firstname: string) => {
        setUserDetails(() => ({
            ...userDetails,
            firstname: firstname
        }));
    };

    const changeLastname = (lastname: string) => {
        setUserDetails(() => ({
            ...userDetails,
            lastname: lastname
        }));
    };

    const changeDateOfBirth = (dob: Date | undefined) => {
        if (dob) {
            setUserDetails(() => ({
                ...userDetails,
                dateOfBirth: dob
            }));
        }
    };

    const changeEmail = (email: string) => {
        setUserDetails(() => ({
            ...userDetails,
            email: email
        }));
    };

    // const changePassword = (password: string) => {
    //     setUserDetails(() => ({
    //         ...userDetails,
    //         password: password
    //     }));
    // };

    const changeRole = (role: string) => {
        setUserDetails(() => ({
            ...userDetails,
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

    const stateSelections = (): JSX.Element[] => {
            const states = Object.values(State).map((state, idx) => {
                return <MenuItem key={idx} value={state}>{state}</MenuItem>;
            })
            return states;
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: "25px",
                height: "100%",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <IconButton
                    onClick={() => navigate("/dashboard/admin-view")}
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
                    User Details
                </Typography>
            </Box>
            <Box>
                <Button
                    onClick={() => toggleEditUser()}
                >
                    Edit User
                </Button>
                <Button
                    onClick={() => setSuspendUser(true)}
                >
                    Suspend User
                </Button>
                <SuspendUserModal 
                    open={suspendUser}
                    userId={userDetails.id}
                    handleClose={handleCloseSuspendModal}
                />
                <Button
                    onClick={() => setDeactivateUser(true)}
                >
                    Deactivate User
                </Button>
                <DeactivateUserModal 
                    open={deactivateUser}
                    userId={userDetails.id}
                    handleClose={handleCloseDeactModal}
                />
            </Box>
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
                    disabled={!editable}
                    value={userDetails.firstname}
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
                    disabled={!editable}
                    value={userDetails.lastname}
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
                    disabled={!editable}
                    value={userDetails.email}
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
                    disabled={!editable}
                    defaultValue={dayjs(user.dateOfBirth)}
                    onChange={(e) => changeDateOfBirth(e?.toDate())}
                    sx={{
                        gridArea: "grid-item-4",
                        '& .MuiPickersInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                />
                {/* password
                <TextField
                    label="Password"
                    type="password"
                    required
                    value={userDetails.password}
                    error={!isValid && userDetails.password !== ""}
                    onChange={(e) => changePassword(e.currentTarget.value)}
                    sx={{
                        gridArea: "grid-item-5",
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                        },
                    }}
                /> */}
                <FormControl
                    disabled={!editable}
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
                        defaultValue={user.role}
                        onChange={(e) => changeRole(e.target.value)}
                    >
                        {roleOptions()}
                    </Select>
                </FormControl>
            </Container>
            <Divider sx={{backgroundColor: "white"}}/>
            <Container
                className="grid-container-2"
                sx={{
                    paddingTop: "20px",
                    paddingBottom: "25px",
                    display: "grid",
                    gridGap: 10,
                    gridTemplateColumns: "200px",
                    gridTemplateAreas: 
                    `"grid-item-7 grid-item-7 grid-item-7 grid-item-7"
                    "grid-item-8 grid-item-8 grid-item-8 grid-item-8"
                    "grid-item-9 grid-item-9 grid-item-10 grid-item-11"`,
                }}
            >
                {/* address
                    street address
                    city
                    state
                    zipcode */}

                <TextField 
                    label="Address Line 1"
                    disabled={!editable}
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
                    disabled={!editable}
                    value={address.addressLine2 ?? ""}
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
                    disabled={!editable}
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
                    disabled={!editable}
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
                    disabled={!editable}
                    value={address.zipcode}
                    onChange={(e) => changeZipcode(parseInt(e.target.value))}
                    sx={{
                        gridArea: "grid-item-11",
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                        },
                    }}
                />
            </Container>
            {/* create_account/ submit button */}
            {editable && <Button
                size="large"
                onClick={() => updateUser(userDetails, address)}
                sx={{
                    alignSelf: "center",
                    width: "250px",
                    color: "white",
                    backgroundColor: "#10B981",
                    margin: "25px 0 20px 0",
                }}
            >
                Submit
            </Button>}
        </Box>
    )
}

export default UserDetailsPage;