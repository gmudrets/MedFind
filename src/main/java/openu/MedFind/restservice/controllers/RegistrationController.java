package openu.MedFind.restservice.controllers;

import lombok.AllArgsConstructor;
import openu.MedFind.dto.RegistrationRequest;
import openu.MedFind.restservice.services.RegistrationService;
import org.springframework.web.bind.annotation.*;


// TO-DO list Server side:
// 1. validation of fields (?)
// 2. check if username or email already exists.
// 3. create new user object (DTO) and add it to the DB.
// To read about: WebRequest, Model, Firebase, Threads.
// 4. add threading (?)

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
public class RegistrationController {

    private RegistrationService registrationService;

    @PostMapping("/api/user/register")
    public String UserRegistration(@RequestBody RegistrationRequest registerRequest){
        System.out.println(registerRequest);
        return registrationService.registerNewUser(registerRequest);
    }
}
