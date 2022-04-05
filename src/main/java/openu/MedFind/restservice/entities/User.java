package openu.MedFind.restservice.entities;



import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String userType;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String password;

    public User(String userType,
                String userName,
                String firstName,
                String lastName,
                String email,
                String password){

        this.userType = userType;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

}
