package openu.MedFind.restservice;

import com.google.firebase.auth.FirebaseAuthException;
import openu.MedFind.dto.AppAuthData;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.repositories.AppAuthDataRepository;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// To allow access to nodejs local instance for development purposes
@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class AppAuth {

    @Autowired
    private AppAuthDataRepository appAuthDataRepository;


    @GetMapping("/api/AddAppData")
    public void AddAppData(@RequestHeader(name = "idToken") String idToken,
                              @RequestParam String appID,
                              @RequestParam String authToken
    ) throws TokenException {

        String uuid;

        try {
            uuid = FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        appAuthDataRepository.save(AppAuthData.builder()
                .userUuid(uuid)
                .authToken(authToken)
                .appID(appID)
                .build()
        );
    }

    @GetMapping("/api/GetAppData")
    public List<AppAuthData> GetAppData(@RequestHeader(name = "idToken") String idToken,
                                        @RequestParam String appID
    ) throws TokenException {

        try {
            FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        return appAuthDataRepository.findAllByAppID(appID);

    }

}
