package openu.MedFind.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class RegistrationRequest {

    private final String userType;
    private final String userName;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String password;
}
