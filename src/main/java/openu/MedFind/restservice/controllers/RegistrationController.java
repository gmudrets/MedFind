package openu.MedFind.restservice.controllers;

import lombok.AllArgsConstructor;
import openu.MedFind.dto.RegistrationRequest;
import openu.MedFind.restservice.services.RegistrationService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping("/api/User/Register")
    public String UserRegistration(@RequestBody RegistrationRequest registerRequest){
        return registrationService.registerNewUser(registerRequest);
    }
}
