import React, { useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText, 
    Table,
    TableContainer,
    TableRow, 
    TableCell,
    TableBody,
    TableHead,
    Toolbar,
    Typography
} from "@mui/material";
import { useLoaderData } from "react-router-dom";
import OutgoingMailIcon from '@mui/icons-material/OutgoingMail';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from "react-router-dom";
import { User } from "../../types/userdata-types";
import AddAccountModal from "./AddAccountModal";
import EmailMessageModal from "./EmailModal";



const AdminViews = () => {
    const { activeUserData, pendingUserData } = useLoaderData();

    const [userData] = useState<User[] | null>(activeUserData);
    const [pendingUsers] = useState<User[] | null>(pendingUserData);
    const [openAddAcctModal, setOpenAddAcctModal] = useState<boolean>(false);
    const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleCloseAddAcctModal = () => {
        setOpenAddAcctModal(false);
    }

    const handleCloseMessageModal = () => {
        setOpenMessageModal(false);
    }

    const handleOpenUserDetails = (userDetails: User) => {

        navigate(`user-details/${userDetails.id}`, {state: {user: userDetails}})
    }

    const userTableData = (): JSX.Element[] => {
        if (userData) {
            const userTableBody = userData.map((user, idx): JSX.Element => {
                return (
                    <TableRow 
                        key={idx}
                        hover
                        onClick={() => handleOpenUserDetails(user)}
                    >
                        <TableCell >{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.firstname}</TableCell>
                        <TableCell>{user.lastname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.accountStatus}</TableCell>
                    </TableRow>
                );
            });
            return userTableBody;
        }
        return [];
    };


    const pendingApprovalsView = (): JSX.Element => {
        if (userData) {
            // const pendingUsers = userData.filter((user: User) => {
            //    return user.accountStatus == AccountStatus.PENDING;
            // });

            if (pendingUsers && pendingUsers.length > 0) {
                const pendingList = pendingUsers.map((pendingUser: User) => {
                    return (
                        <ListItem>
                            <ListItemText primary={`${pendingUser.username}`}/>
                            <ListItemButton>
                                <ListItemText primary={"Approve"} />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText primary={"Reject"} />
                            </ListItemButton>
                        </ListItem>
                    )
                })

                return (
                    <List>
                        {pendingList}
                    </List>
                )
            }

            return (
                <Typography>No pending approvals</Typography>
            );
        }
        return (
            <Typography>Unable to retrieve pending user info</Typography>
        )
    };

    const passwordAlerts = (): JSX.Element => {
        if (userData) {
            const expiryPasswordsHist = {
                "expired": 0,
                "upcoming": 0
            };
            userData.reduce((acc, currentUser) => {
                const today = new Date();
                const threeDaysFromToday = new Date(today);
                threeDaysFromToday.setDate(today.getDate() + 3)
                if (new Date(currentUser.passwordExpiry) <= threeDaysFromToday
                    && new Date(currentUser.passwordExpiry) > today) {
                    acc.upcoming += 1
                }
                else if (new Date(currentUser.passwordExpiry) <= today) {
                    acc.expired += 1
                }
                return acc;
            }, expiryPasswordsHist);

            if (expiryPasswordsHist.expired > 0 || expiryPasswordsHist.upcoming > 0) {
                return (
                    <>
                        <Chip
                            label={`Expired: ${expiryPasswordsHist.expired}`}
                            color="error"
                        />
                        <Chip
                            label={`Upcoming: ${expiryPasswordsHist.upcoming}`}
                            color="warning"
                        />
                    </>
                )
            }
            return (
                <Typography>
                    No upcoming expired passwords
                </Typography>
            )
        }
        return (
            <Typography>
                Unable to retrieve password history
            </Typography>
        )
    };


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%"
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    padding: "10px 0 20px 20px"
                }}
            >
                User Management
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: "100%"
                }}
            >
                <Box
                    sx={{
                        display:"flex",
                        flexDirection: "column",
                        paddingRight: "15px"
                    }}
                >
                    <Box>
                        <Button
                            onClick={() => setOpenAddAcctModal(true)}
                            startIcon={<PersonAddIcon />}
                        >
                            Add Account
                        </Button>
                        <AddAccountModal 
                            open={openAddAcctModal}
                            handleClose={handleCloseAddAcctModal}
                        />
                        <Button
                            onClick={() => setOpenMessageModal(true)}
                            startIcon={<OutgoingMailIcon />}
                        >
                            Email User
                        </Button>
                        <EmailMessageModal
                            open={openMessageModal}
                            users={userData ?? []}
                            handleClose={handleCloseMessageModal}
                        />
                    </Box>
                    <Box
                        sx={{
                            padding: "10px",
                            paddigRight: "15px",
                            border: "1px solid",
                            borderRadius: "15px",
                            boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        <Toolbar
                            sx={{
                                minHeight: "40px !important",
                                padding: "0px 15px !important",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="h6"
                            >
                                Active Users
                            </Typography>
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Toolbar>
                        {/* <Divider></Divider> */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User ID</TableCell>
                                        <TableCell>Username</TableCell>
                                        <TableCell>First name</TableCell>
                                        <TableCell>Last name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Account Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userTableData()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around"
                    }}
                >
                    <Box
                        sx={{
                            minHeight: 150,
                            padding: "10px",
                            border: "1px solid",
                            borderRadius: "15px",
                            boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        <Typography
                            variant="h6"
                        >
                            Password Alerts
                        </Typography>
                        <Divider />
                        {passwordAlerts()}
                    </Box>
                    <Box
                        sx={{
                            minHeight: 150,
                            minWidth: 200,
                            padding: "10px",
                            border: "1px solid",
                            borderRadius: "15px",
                            boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        <Typography
                            variant="h6"
                        >
                            Pending Approvals
                        </Typography>
                        <Divider />
                        {pendingApprovalsView()}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default AdminViews