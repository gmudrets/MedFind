package openu.MedFind.restservice;

import com.google.firebase.auth.FirebaseAuthException;
import openu.MedFind.dto.AppAuthData;
import openu.MedFind.exceptions.TokenException;
import openu.MedFind.repositories.AppAuthDataRepository;
import openu.MedFind.services.FirebaseValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// To allow access to nodejs local instance for development purposes
@CrossOrigin(origins = "https://localhost:3000")
@RestController
public class AppAuth {

    @Autowired
    private AppAuthDataRepository appAuthDataRepository;

    @GetMapping("/api/GetAppData")
    public List<AppAuthData> GetAppData(@RequestHeader(name = "idToken") String idToken) throws TokenException
    {
        try {
            FirebaseValidator.getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new TokenException("User not found.", e);
        }

        return appAuthDataRepository.findAll();

    }

}
