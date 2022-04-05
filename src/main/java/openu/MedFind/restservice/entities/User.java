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
    private String usertype;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String password;

    public User(String usertype,
                String username,
                String firstname,
                String lastname,
                String email,
                String password){

        this.usertype = usertype;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

}
