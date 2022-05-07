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

export default function TitlebarImageList(props) {
    const [img, setImg] = React.useState('https://images.unsplash.com/photo-1551963831-b3b1ca40c98e');//TODO

    return (
        <Grid container>
            <Grid item xs={12} textAlign={"center"} margin={"60px"}>
                <ImageList sx={{width: 450, height: 450}}>

                    <ImageListItem key={img}
                                   sx={{maxWidth: "150px", maxHeight: "150px", minWidth: "150px", minHeight: "150px",}}>
                        <img
                            src={`${img}?w=248&fit=crop&auto=format`}
                            srcSet={`${img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={"תמונת פרופיל"}
                            loading="lazy"

                            style={{
                                borderRadius: "50%",
                            }}
                        />
                        <ImageListItemBar

                            title={"תמונת פרופיל"}
                            actionIcon={
                                <Stack>
                                    <IconButton
                                        sx={{color: 'rgba(255, 255, 255, 0.8)'}}
                                        aria-label={`take picture`}
                                    >
                                        <AddAPhotoIcon sx={{fontSize:"13px"}}/>
                                    </IconButton>
                                    <IconButton
                                        sx={{color: 'rgba(255, 255, 255, 0.8)'}}
                                        aria-label={`take picture`}

                                    >
                                        <AddPhotoAlternateIcon sx={{fontSize:"15px"}}/>
                                    </IconButton>
                                </Stack>
                            }


                        />
                    </ImageListItem>

                </ImageList>
            </Grid>
        </Grid>
    );
}


