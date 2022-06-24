package openu.MedFind.restservice;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.cloud.FirestoreClient;
import openu.MedFind.dto.RequestStatus;
import openu.MedFind.dto.UserType;
import openu.MedFind.dto.UserTypeRequestEntry;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.repositories.UserTypeRequestEntryRepository;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class UserTypeRequest {

    @Autowired
    private UserTypeRequestEntryRepository userTypeRequestEntryRepository;

    private final String DOCTOR_TYPE = "רופא";
    private final String MEDICAL_STAFF_MEMBER_TYPE = "צוות רפואי";
    private static final String FROM_EMAIL = "medfind.alerts@gmail.com";

    private static final String EMAIL_SUBJECT = "MEDFIND ALERT";

    @Autowired
    private JavaMailSender emailSender;

    @GetMapping("/api/CreateNewUserTypeRequest")
    public void createNewUserTypeRequest(@RequestHeader(name = "idToken", required = false) String idToken,
                                 @RequestParam String email,
                                 @RequestParam String firstName,
                                 @RequestParam String lastName,
                                 @RequestParam UserType requestedType,
                                 @RequestParam String certificateImage)
                                 throws TokenException {

        String uuid;
        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        String fixedCertImage = certificateImage.replace(" ", "+");

        userTypeRequestEntryRepository.save(
                UserTypeRequestEntry.builder()
                .uuid(uuid)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .requestedType(requestedType)
                .requestStatus(RequestStatus.PENDING)
                .certificateImage(fixedCertImage)
                .build());
    }

    @GetMapping("/api/changeUserTypeRequestStatus")
    public void changeUserTypeRequestStatus(@RequestHeader(name = "idToken", required = false) String idToken,
                                            @RequestParam String uuid,
                                            @RequestParam RequestStatus requestStatus)
                                            throws TokenException {

        try {
            FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        var entry = userTypeRequestEntryRepository.findByUuid(uuid);

        if(entry != null) {
            entry.setRequestStatus(requestStatus);
            userTypeRequestEntryRepository.save(entry);

            if(requestStatus == RequestStatus.APPROVED) {
                var newUserType = MEDICAL_STAFF_MEMBER_TYPE;
                if(entry.getRequestedType() == UserType.DOCTOR){
                    newUserType = DOCTOR_TYPE;
                }

                var docRef = FirestoreClient.getFirestore().collection("users").document(uuid);
                docRef.update("userType",newUserType);
            }

            var message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(entry.getEmail());

            if(requestStatus == RequestStatus.APPROVED){
                message.setSubject("Your user status request has approved");
                message.setText("Please reconnect to the system for updating your new features !");
            }
            else{
                message.setSubject("Your user status request has denied");
                message.setText("We sorry to inform you the request of user status had been denied by administrator");
            }
            emailSender.send(message);
        }
    }

    @GetMapping("/api/GetAllUserTypeRequestsByStatus")
    public List<UserTypeRequestEntry> getAllUserTypeRequestsByStatus(
            @RequestHeader(name = "idToken", required = false) String idToken,
            @RequestParam(name="requestStatus",required = true) RequestStatus requestStatus)
            throws TokenException {

        try {
            FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        if(requestStatus == RequestStatus.APPROVED){
            return userTypeRequestEntryRepository.findAllByRequestStatus(RequestStatus.APPROVED);
        }
        else if(requestStatus == RequestStatus.DENIED){
            return userTypeRequestEntryRepository.findAllByRequestStatus(RequestStatus.DENIED);
        }
        else {
            return userTypeRequestEntryRepository.findAllByRequestStatus(RequestStatus.PENDING);
        }
    }
}