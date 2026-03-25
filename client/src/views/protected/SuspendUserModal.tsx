import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { suspendUser } from "../../api/service";


interface Props {
    open: boolean,
    userId: number,
    handleClose: () => void
}

const SuspendUserModal = ({open, userId, handleClose}: Props): JSX.Element => {
    const [suspendStart, setSuspendStart] = useState<Date | undefined>(undefined);
    const [suspendEnd, setSuspendEnd] = useState<Date | undefined>(undefined);
    const [canSuspend, setCanSuspend] = useState<boolean>(false);


    const handleSuspendUser = async (): Promise<void> => {
        if (suspendStart != undefined && suspendEnd != undefined) {
            const resp = await suspendUser(userId, suspendStart, suspendEnd);
            if (resp) {
                console.log("Successfully suspended user account")
                return
            }
            console.log("An error occured trying to suspended user account")
        }
    }


    useEffect(() => {
        setCanSuspend(
            suspendStart != undefined && 
            suspendEnd != undefined &&
            suspendStart < suspendEnd

        );
        console.log(suspendStart);
        console.log(suspendEnd);
    }, [suspendStart, suspendEnd])

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
                    justifyContent: 'space-around',
                    height: "300px",
                    minWidth: "550px",
                    borderWidth: "thick",
                    borderRadius: "15px",
                    boxShadow: "5px 5px 10px 2px rgba(0, 0, 0, 0.3)"
                }}
            >
                <Typography
                    sx={{
                        width: "375px"
                    }}
                >
                    Choose the start and end of the suspension duration and select "Confirm" to continue
                </Typography>
                <DatePicker 
                    label="Suspension Start"
                    onChange={(e) => setSuspendStart(e?.toDate())}
                    sx={{
                        '& .MuiPickersInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                />
                <DatePicker 
                    label="Suspension End"
                    onChange={(e) => setSuspendEnd(e?.toDate())}
                    sx={{
                        '& .MuiPickersInputBase-root': {
                            backgroundColor: 'white',
                        },
                    }}
                />
                <Box>
                    <Button
                        disabled={!canSuspend}
                        onClick={async () => await handleSuspendUser()}
                        sx={{
                            paddingRight: "35px"
                        }}
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

export default SuspendUserModal;