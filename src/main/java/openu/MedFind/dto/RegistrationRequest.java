package openu.MedFind.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistrationRequest {

    private final String usertype;
    private final String username;
    private final String firstname;
    private final String lastname;
    private final String email;
    private final String password;
}
