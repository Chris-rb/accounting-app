import React, { useState } from "react"
import { 
    AppBar,
    Box,
    ButtonBase,
    Drawer, 
    IconButton,
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    ListItemIcon, 
    Popover,
    Toolbar,
    Typography, 
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import { logout } from "../../api/service";
import { AxiosResponse } from "axios";



const Dashboard = () => {
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [openProfilePopover, setOpenProfilePopover] = useState<boolean>(false);

    const { user, clearAuthUser } = useAuth();
    const navigate = useNavigate();

    const id = openProfilePopover ? 'simple-popover' : undefined;
    const drawWidth: number = openSidebar ? 60 : 240;

    const handleOpenProfilePop = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenProfilePopover(true);
    };

    const handleCloseProfilePop = () => {
        setAnchorEl(null);
        setOpenProfilePopover(false);
    };    

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar);
    }

    const handleLogout = async () => {
        const resp: AxiosResponse | null = await logout();
        if (resp) {
            clearAuthUser();
            console.log(resp.statusText);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                transition: "flex-grow 0.5s ease-in-out",
            }}
        >
            <AppBar>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        backgroundColor: "#E2E8F0",
                    }}
                >
                     <Typography>Hello, {user?.username}</Typography>
                    <IconButton
                        onClick={(e) => handleOpenProfilePop(e)}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={openProfilePopover}
                        anchorEl={anchorEl}
                        onClose={handleCloseProfilePop}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                    >
                        <Box>
                            <ButtonBase
                                onClick={() => handleLogout()}
                            >
                                <Typography>
                                    logout
                                </Typography>
                            </ButtonBase>
                        </Box>
                    </Popover>
                </Toolbar>
            </AppBar>
            <Drawer
                open={openSidebar}
                variant="permanent"
                anchor="left"
                sx={{
                    width: openSidebar ? 60 : 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        backgroundColor: "#E2E8F0",
                        transition: "width 0.5s ease-in-out",
                        overflowX: "hidden",
                        width: openSidebar ? 60 : 240,
                        boxSizing: 'border-box',
                    }
                }}
            >
                <Box
                    sx={{
                        height: 63,
                        display: "flex",
                        justifyContent: openSidebar ? "center" : "end"
                    }}
                >
                    <IconButton
                        onClick={() => toggleSidebar()}
                    >
                        {openSidebar 
                        ? <ChevronRightOutlinedIcon /> 
                        : <ChevronLeftOutlinedIcon />}
                    </IconButton>
                </Box>
                <List>
                    <ListItem
                        disablePadding
                        sx={{
                            height: 48,
                            alignItems: "center"
                        }}
                    >
                        <ListItemButton
                            onClick={() => {navigate("chart-of-accounts")}}
                        >
                            <ListItemIcon>
                                <HomeOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Chart of Accounts"
                                sx={{
                                    whiteSpace: "nowrap",
                                    transition: "opacity 0.5s ease-in-out",
                                    opacity: openSidebar ? 0 : 1 
                                }} 
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        disablePadding
                        sx={{
                            height: 48,
                            alignItems: "center"
                        }}
                    >
                        <ListItemButton
                            onClick={() => {navigate("admin-view")}}
                        >
                            <ListItemIcon>
                                <BuildIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Admin Tools" 
                                sx={{
                                    textWrap: "nowrap",
                                    transition: "opacity 0.5s ease-in-out",
                                    opacity: openSidebar ? 0 : 1 
                                }} 
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        disablePadding
                        sx={{
                            height: 48,
                            alignItems: "center"
                        }}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Settings" 
                                sx={{
                                    transition: "opacity 0.5s ease-in-out",
                                    opacity: openSidebar ? 0 : 1 
                                }} 
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box
                sx={{
                    display: "flex",
                    flexGrow: 1,
                    p: 3,
                    flexDirection: "row",
                    backgroundColor: "#E2E8F0",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100vh - 150px)",
                    margin: "70px 10px 10px 10px",
                    width: `calc(100vw - ${drawWidth + 100}px)`,
                    overflow: "auto",
                    borderRadius: "15px",
                    boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
                    // transition: "width 0.5s ease-in-out",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )

}

export default Dashboard