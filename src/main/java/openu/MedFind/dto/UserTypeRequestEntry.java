package openu.MedFind.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Tolerate;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "usertype_requests")
@Builder
@ToString
public class UserTypeRequestEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Tolerate
    public UserTypeRequestEntry() {
    }

    private String uuid;

    private String email;

    private String firstName;

    private String lastName;

    private UserType requestedType;

    private RequestStatus requestStatus;

    private String certificateImage;
}
