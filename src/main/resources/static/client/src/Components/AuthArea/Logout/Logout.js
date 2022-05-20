import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Actions } from "../../../Redux/Auth";
import { useNavigate } from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Alert, Snackbar} from "@mui/material";
import {getSafe} from "../../../Utils/Utils";
import * as STATE_PATHS from "../../../Consts/StatePaths";
import { auth } from "../../../Configs/FirebaseConfig";
import {signOut} from "firebase/auth";

function Logout() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = createTheme({direction: 'rtl'});
	const currentUser = useSelector((state) => getSafe(STATE_PATHS.USERNAME, state));

	useEffect(() => {
		if (currentUser === ''){
			navigate("/login");
		}
	}, [currentUser]);

	const handleLogout = () => {
		signOut(auth).then();
		dispatch(Actions.logUserOut());
		navigate("/login");
	};

	return (
		<ThemeProvider theme={theme}>
			<Snackbar open={true}
					  autoHideDuration={1000}
					  onClose={handleLogout}
					  anchorOrigin = {{vertical: 'top', horizontal: 'center'}}
			>
				<Alert severity="success">
					התנתקת בהצלחה מהמערכת !
				</Alert>
			</Snackbar>
		</ThemeProvider>
		);
}

export default Logout;
