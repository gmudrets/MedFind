import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {createRef} from "react";
import TransitionsModal from "../UI/Modal/Modal";
import Camera from 'react-html5-camera-photo';
import Webcam from "react-webcam";
import Box from "@mui/material/Box";


export default function TitlebarImageList(props) {
    const fileInput = createRef();
    const [img, setImg] = React.useState('https://images.unsplash.com/photo-1551963831-b3b1ca40c98e');//TODO
    const [pointerInUpload, setPointerInUpload] = React.useState(false);
    const [pointerInTake, setPointerInTake] = React.useState(false);
    const [cameraOpen, setCameraOpen] = React.useState(false);
    const [pointerInCameraTake, setPointerInCameraTake] = React.useState(false);


    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    const onSelectFile = (event) => {
        const picture = event.target.files[0];
        if (picture) {
            const src = URL.createObjectURL(picture);
            handleNewPicture(src);
        }

    }
    const handleNewPicture = (picture) => {
        if (picture) {
            // props.updateProfilePic(picture);
            setCameraOpen(false);
            setImg(picture);
            setPointerInCameraTake(false);
        }

    }

    const handleTakeClick = () => {
        setCameraOpen(true);
    }
    const toggleCamerOpen = () => {
        setCameraOpen(!cameraOpen);
    }
    const handlePointerEnterUpload = () => {
        setPointerInUpload(true);
    }
    const handlePointerLeaveUpload = () => {
        setPointerInUpload(false);
    }
    const handlePointerEnterTake = () => {
        setPointerInTake(true);
    }
    const handlePointerLeaveTake = () => {
        setPointerInTake(false);
    }
    const handlePointerEnterCameraTake = () => {
        setPointerInCameraTake(true);
    }
    const handlePointerLeaveCameraTake = () => {
        setPointerInCameraTake(false);
    }
    const handleTakePhoto = (datURI) => {
        setImg(datURI);
    }

    return (
        <>
            <TransitionsModal open={cameraOpen} toggleModal={toggleCamerOpen}>
                <Box
                    marginRight={"13%"}
                >
                    <Webcam
                        audio={false}
                        height={"200px"}
                        screenshotFormat="image/jpeg"
                        width={"280px"}
                        videoConstraints={videoConstraints}
                    >
                        {({getScreenshot}) => (
                            <>
                                <Box width="100%"/>
                                <Box
                                    marginRight={"35%"}
                                >
                                    <IconButton

                                        onClick={() => {
                                            const imageSrc = getScreenshot()
                                            handleNewPicture(imageSrc);
                                        }}
                                        onPointerEnter={handlePointerEnterCameraTake}
                                        onPointerLeave={handlePointerLeaveCameraTake}
                                        color={pointerInCameraTake ? "primary" : "default"}
                                    >
                                        <PhotoCameraIcon/>
                                    </IconButton>
                                </Box>
                            </>
                        )}
                    </Webcam>
                </Box>
            </TransitionsModal>
            <Grid container>
                <Grid item xs={12} textAlign={"center"} margin={"60px"}>
                    <ImageList sx={{width: 450, height: 450}}>

                        <ImageListItem key={img}
                                       sx={{
                                           maxWidth: "150px",
                                           maxHeight: "150px",
                                           minWidth: "150px",
                                           minHeight: "150px",
                                           objectFit: "cover"
                                       }}>
                            <img
                                src={`${img}`}
                                srcSet={`${img}`}
                                alt={"תמונת פרופיל"}
                                loading="lazy"

                                style={{
                                    borderRadius: "50%",
                                    maxWidth: "150px",
                                    maxHeight: "150px",
                                    minWidth: "150px",
                                    minHeight: "150px",
                                    objectFit: "cover"
                                }}
                            />
                            <ImageListItemBar

                                title={"תמונת פרופיל"}
                                actionIcon={
                                    <Stack>
                                        <IconButton
                                            sx={!pointerInTake ? {color: 'rgba(255, 255, 255, 0.8)'} : {color: 'rgba(33, 150, 243, 0.8)'}}
                                            aria-label={`take picture`}
                                            onPointerEnter={handlePointerEnterTake}
                                            onPointerLeave={handlePointerLeaveTake}
                                            onClick={handleTakeClick}
                                        >
                                            <AddAPhotoIcon sx={{fontSize: "14px"}}/>
                                        </IconButton>
                                        <IconButton
                                            sx={!pointerInUpload ? {color: 'rgba(255, 255, 255, 0.8)'} : {color: 'rgba(33, 150, 243, 0.8)'}}
                                            aria-label={`upload picture`}
                                            onPointerEnter={handlePointerEnterUpload}
                                            onPointerLeave={handlePointerLeaveUpload}
                                            onClick={() => fileInput.current.click()}

                                        >
                                            <AddPhotoAlternateIcon sx={{fontSize: "16px"}}/>
                                        </IconButton>
                                    </Stack>
                                }


                            />
                        </ImageListItem>

                    </ImageList>

                </Grid>
                <input
                    type="file"
                    ref={fileInput}
                    style={{display: "none"}}
                    onChange={onSelectFile}

                    multiple
                />


            </Grid>
        </>
    );
}


