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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UserTypeRequestEntry that = (UserTypeRequestEntry) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
