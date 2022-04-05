package openu.MedFind.restservice.services;

import lombok.AllArgsConstructor;
import openu.MedFind.dto.RegistrationRequest;
import openu.MedFind.restservice.entities.User;
import openu.MedFind.restservice.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RegistrationService {

    private final UserRepository userRepo;

    public String registerNewUser(RegistrationRequest registerRequest) {

        // Add validations on fields + check if username/email doesn't already exist.
        // maybe in another function?
        // the if else - inside the controller or service?

        userRepo.save(new User(
                registerRequest.getUsertype(),
                registerRequest.getUsername(),
                registerRequest.getFirstname(),
                registerRequest.getLastname(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
        ));

        // prints all registered users after saving the latest one.
        for(User us : userRepo.findAll()){
            System.out.println(us);
        }

        return "OK";
    }
}
