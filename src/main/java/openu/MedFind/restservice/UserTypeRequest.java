package openu.MedFind.restservice;

import com.google.firebase.auth.FirebaseAuthException;
import openu.MedFind.dto.RequestStatus;
import openu.MedFind.dto.UserType;
import openu.MedFind.dto.UserTypeRequestEntry;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.repositories.UserTypeRequestEntryRepository;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class UserTypeRequest {

    @Autowired
    private UserTypeRequestEntryRepository userTypeRequestEntryRepository;

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

        userTypeRequestEntryRepository.save(
                UserTypeRequestEntry.builder()
                .uuid(uuid)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .requestedType(requestedType)
                .requestStatus(RequestStatus.PENDING)
                .certificateImage(certificateImage)
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

        if(entry != null){
            entry.setRequestStatus(requestStatus);
            userTypeRequestEntryRepository.save(entry);
        }
    }

    @GetMapping("/api/GetAllUserTypePendingRequestsByStatus")
    public List<UserTypeRequestEntry> getAllUserTypeRequestsByStatus(
            @RequestHeader(name = "idToken", required = false) String idToken,
            @RequestParam RequestStatus requestStatus)
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
