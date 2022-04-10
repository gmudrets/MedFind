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

        userRepo.save(new User(
                registerRequest.getUserType(),
                registerRequest.getUserName(),
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
        ));
        
        return "OK";
    }
}
