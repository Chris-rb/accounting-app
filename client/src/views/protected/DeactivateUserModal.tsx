import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { deactivateUser } from "../../api/service";


interface Props {
    open: boolean,
    userId: number,
    handleClose: () => void
}

const DeactivateUserModal = ({open, userId, handleClose}: Props): JSX.Element => {

    const handleDeactivateUser = async (): Promise<void> => {
        const resp = await deactivateUser(userId);
        if (resp) {
            console.log("Successfully deactivated user account");
            return;
        }
        console.log("An error occured trying to deactivate user account");
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{ 
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <Box
                sx={{
                    padding: "40px 0 20px 0",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#E2E8F0",
                    alignItems: "center",
                    justifyContent: 'center',
                    height: "200px",
                    minWidth: "550px",
                    borderWidth: "thick",
                    borderRadius: "15px",
                    boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
                }}
            >
                <Typography
                    sx={{
                        width: "375px",
                        paddingBottom: "40px"
                    }}
                >
                    Are you sure you want to deactivate this accout? Select "Confirm" to continue
                </Typography>
                <Box>
                    <Button
                        onClick={async () => await handleDeactivateUser()}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={() => handleClose()}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default DeactivateUserModal;