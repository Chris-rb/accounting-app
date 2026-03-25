import React, { useState } from "react";
import { Box, IconButton, Modal, TextField, Typography, Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { User } from "../../types/userdata-types";
import { sendEmail } from "../../api/service";


interface Props {
    open: boolean,
    users: User[];
    handleClose: () => void,
}

const EmailMessageModal = ({ open, users, handleClose }: Props): JSX.Element => {
    const [recipient, setRecipient] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [messageBody, setMessageBody] = useState<string>("");

    const sendMessage = async () => {
        const recipientUser = users.find((user) => user.email === recipient);
        console.log("recipient", recipientUser)

        if (recipientUser) {
            const resp = await sendEmail(recipientUser.id, subject, messageBody);
            if (resp) {
                console.log(resp.statusText)
            }
        }
        else {
            console.log(`Could not find user with email ${recipient}`)
        }
    };

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
                    display: 'flex',
                    flexDirection: "column", 
                    gap: 1,
                    backgroundColor: "#E2E8F0",
                    borderRadius: "15px",
                    padding: "20px",
                    minhHeight: 400,
                    minWidth: 550,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography
                        sx={{
                            alignSelf: "center"
                        }}
                    >
                        New Message
                    </Typography>
                    <IconButton
                        onClick={() => handleClose()}
                    >
                        <CancelIcon />
                    </IconButton>
                </div>
                <TextField
                    label="To"
                    variant="standard"
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <TextField
                    label="Subject"
                    variant="standard"
                    onChange={(e) => setSubject(e.target.value)}
                />
                <TextField
                    multiline
                    rows={6}
                    onChange={(e) => setMessageBody(e.target.value)}
                />
                <Button
                    onClick={() => sendMessage()}
                >
                    Send
                </Button>
            </Box>
        </Modal>
    )
}

export default EmailMessageModal