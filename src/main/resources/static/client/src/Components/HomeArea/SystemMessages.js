import TypeAnimation from 'react-type-animation';
import Box from "@mui/material/Box";

function SystemMessages() {
        return (
            <Box
                marginTop='65px'
                marginBottom='45px'
                display='flex'
                flexDirection='column'
                justifyContent="center"
                alignItems='center'
            >
                <TypeAnimation
                    cursor={true}
                    sequence={[
                        'ניתן לחפש תרופה לפי שם, חומר פעיל או לסרוק ברקוד',
                        2000,
                        'ניתן להוסיף תרופה שנמצאה בחיפוש למאגר התרופות האישי ע"י לחיצה על כפתור + בתחתית כרטיס התרופה',
                        2000,
                        'ניתן לקבוע תזכורות לנטילת תרופות וכמו כן התראות לחידוש מלאי ופג תוקף',
                        2000,
                    ]}
                    wrapper="a"
                    repeat={3}
                />
            </Box>
    );
}

export default SystemMessages;