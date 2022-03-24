import { Box } from "@mui/material";
import { getThemeProps } from "@mui/system";
import React, {useState} from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function BarcodeScanner(props) {
  const [data, setData] = React.useState("Not Found");
  const [stopStream, setStopStream] = useState(false);

  const dismissBarcodeReader = () => {
    setStopStream(true)
    setTimeout(() => props.closeModal(), 50)
  }

  return (
    <Box            sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',}}>
      <BarcodeScannerComponent
        width={250}
        height={250}
        onUpdate={(err, result) => {
          if (result) {
              props.setScannedData(result.text);
              dismissBarcodeReader();
            }
          else setData("Not Found");
        }}
        stopStream={stopStream}
      />
      <p>{data}</p>
    </Box>
  );
}

export default BarcodeScanner;