import * as React from 'react';
import {createRef, useState} from 'react';

import IconButton from '@mui/material/IconButton';
import {Alert, Snackbar, Stack} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import TransitionsModal from "../UI/Modal/Modal";
import Webcam from "react-webcam";
import defualtProfPic from '../../Assets/Images/defualt_profile_picture.png'
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";


export default function PicturePicker(props) {
	const fileInput = createRef();
	const [img, setImg] = React.useState(props.initPic);
	const [pointerInUpload, setPointerInUpload] = React.useState(false);
	const [pointerInTake, setPointerInTake] = React.useState(false);
	const [cameraOpen, setCameraOpen] = React.useState(false);
	const [pointerInCameraTake, setPointerInCameraTake] = React.useState(false);
	const webcamRef = React.useRef(null);

	const IMAGE_MAX_SIZE = 2000000; // for maximum of 1MB~
	const [overMaxSizeError, setOverMaxSizeError] = useState(false);

	const videoConstraints = {
		width: props.widthResultion,
		height: props.heightResultion,
		facingMode: props.facingMode
	};

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	const onSelectFile = (event) => {
		const picture = event.target.files[0];
		if (picture && picture['type'].split('/')[0] === 'image') {
			getBase64(picture).then(
				data => {
					if(data.length <= IMAGE_MAX_SIZE){
						handleNewPicture(data);
					}
					else{
						setOverMaxSizeError(true);
					}
				}
			);
		}
	}

	const handleOverMaxSizeError = () =>{
		setOverMaxSizeError(false);
	}

	const handleNewPicture = (picture) => {
		if (picture) {
			props.onUpdateProfilePic(picture);
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
	const capture = React.useCallback(
		() => {
			const imageSrc = webcamRef.current.getScreenshot();
			if(imageSrc !== null && imageSrc.length <= IMAGE_MAX_SIZE){
				handleNewPicture(imageSrc);
			}
			else{
				setOverMaxSizeError(true);
			}
		},
		[webcamRef]
	);
	return (
		<>
			<Snackbar open={overMaxSizeError}
					  autoHideDuration={2000}
					  onClose={handleOverMaxSizeError}
					  anchorOrigin={{vertical: 'top', horizontal: 'center'}}
			>
				<Alert severity="error">
					גודל התמונה שנבחרה גדול מהמותר. אנא בחר/י תמונה עד לגודל של 2MB.
				</Alert>
			</Snackbar>

			<TransitionsModal open={cameraOpen} toggleModal={toggleCamerOpen}>
				<Stack style={{width: "fit-content"}}>
					<Webcam
						audio={false}
						height={props.cameraHeight}
						screenshotFormat="image/jpeg"
						width={props.width}
						videoConstraints={videoConstraints}
						ref={webcamRef}
					/>


					<IconButton
						onClick={capture}
						onPointerEnter={handlePointerEnterCameraTake}
						onPointerLeave={handlePointerLeaveCameraTake}
						color={pointerInCameraTake ? "primary" : "default"}

					>
						<PhotoCameraIcon/>
					</IconButton>
				</Stack>
			</TransitionsModal>
			<ImageList>
				<ImageListItem key={img}
							   sx={{
								   maxWidth: props.imageWidth,
								   maxHeight: props.imageHeight,
								   minWidth: props.imageWidth,
								   minHeight: props.imageHeight,
								   objectFit: "cover"
							   }}>
					<img
						src={`${img}`}
						srcSet={`${img}`}
						alt={props.title}
						loading= {props.loading}

						style={props.circleImage ? {
							borderRadius: "50%",
							maxWidth: props.imageWidth,
							maxHeight: props.imageHeight,
							minWidth: props.imageWidth,
							minHeight: props.imageHeight,
							objectFit: "cover"
						} : {
							maxWidth: props.imageWidth,
							maxHeight: props.imageHeight,
							minWidth: props.imageWidth,
							minHeight: props.imageHeight,
							objectFit: "cover"
						}}
					/>
					<ImageListItemBar

						title={props.title}
						actionIcon={
							<Stack>
								<IconButton
									sx={!pointerInTake ? {color: 'rgba(255, 255, 255, 0.8)'} : {color: 'rgba(33, 150, 243, 0.8)'}}
									aria-label={`take picture`}
									onPointerEnter={handlePointerEnterTake}
									onPointerLeave={handlePointerLeaveTake}
									onClick={handleTakeClick}
								>
									<AddAPhotoIcon sx={{fontSize: props.takePicIconSize}}/>
								</IconButton>
								<IconButton
									sx={!pointerInUpload ? {color: 'rgba(255, 255, 255, 0.8)'} : {color: 'rgba(33, 150, 243, 0.8)'}}
									aria-label={`upload picture`}
									onPointerEnter={handlePointerEnterUpload}
									onPointerLeave={handlePointerLeaveUpload}
									onClick={() => fileInput.current.click()}

								>
									<AddPhotoAlternateIcon sx={{fontSize: props.uploadPicIconSize}}/>
								</IconButton>
							</Stack>
						}


					/>
				</ImageListItem>
			</ImageList>
			<input
				type="file"
				ref={fileInput}
				style={{display: "none"}}
				onChange={onSelectFile}
				accept="image/*" name="image"
				multiple
			/>
		</>

	)
		;
}
PicturePicker.defaultProps = {
	onUpdateProfilePic: (src) => {
		return true;
	},
	cameraHeight: '200px',
	cameraWidth: '280px',
	imageHeight: '150px',
	imageWidth: '150px',
	circleImage: true,
	title: "תמונת פרופיל",
	initPic: defualtProfPic,
	facingMode: 'user',
	widthResultion: 1280,
	heightResultion:720,
	loading: 'lazy',
	takePicIconSize:'14px',
	uploadPicIconSize:'16px'

}


