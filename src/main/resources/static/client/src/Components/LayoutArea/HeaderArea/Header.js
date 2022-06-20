import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../../Assets/Images/logo.png'
import {getSafe} from '../../../Utils/Utils'
import * as STATE_PATHS from '../../../Consts/StatePaths'
import {Actions} from "../../../Redux/UI";
import ReadSocket from "./ReadSocket";
import {USER_PROFILE} from "../../../Consts/StatePaths";
import * as ProfileFields from "../../../Consts/ProfileFields";
import ReadSocket from "./ReadSocket";


function Header() {
//   const navigate = useNavigate();
    const dispatch = useDispatch();
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const currentUser = useSelector((state) => getSafe(STATE_PATHS.USER_DETAILS, state));
    const isMenuOpen = useSelector((state) => getSafe(STATE_PATHS.SIDE_MENU_OPEN, state));

    const profile = useSelector((state) => getSafe(USER_PROFILE, state));
    const fullName = profile[ProfileFields.FIRST_NAME] + " " + profile[ProfileFields.LAST_NAME];
    const profilePicture = profile[ProfileFields.PROFILE_PICTURE];

    useEffect(() => {
        if (currentUser === '') {
            setAuth(false);
        } else {
            setAuth(true);
        }

    }, [currentUser])

    const toggleMenu = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (!isMenuOpen) {
            dispatch(Actions.openMenu());
        } else {
            dispatch(Actions.closeMenu())
        }
    };
    const readSocket = (data) => {
        if (data !== []) {

        }
    }

    return (
        <Box sx={{flexGrow: 1}}>
            {auth &&
                <ReadSocket readSocket={readSocket}/>
            }
            <AppBar position="fixed" color="grey">
                <Toolbar>
                    {auth && <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        onClick={toggleMenu()}
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>}

                    <Typography component="div" sx={{flexGrow: 1}}>
                        <a href="/"><img src={logo} className="Logo" alt="logo" style={{maxWidth: '115px'}}/></a>
                    </Typography>

                    {auth && (
                        <Typography align={"center"} variant="subtitle2">
                            שלום, {fullName}
                            &nbsp;
                        </Typography>)}

                    {auth && (
                        <a href="/#/settings"><img alt="profilePicture" src={profilePicture}
                                                   style={{
                                                       borderRadius: "50%",
                                                       maxWidth: "50px",
                                                       maxHeight: "75px",
                                                       minWidth: "30px",
                                                       minHeight: "45px",
                                                       objectFit: "cover"
                                                   }}/></a>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
