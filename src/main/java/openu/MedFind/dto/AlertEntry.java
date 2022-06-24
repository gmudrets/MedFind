package openu.MedFind.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Tolerate;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "alerts")
@Builder
@ToString
public class AlertEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    private String userUuid;

    private String userEmail;

    private String alertName;

    @Column(length = 1000)
    private String alertDescription;

    private String regNum;

    private String medicineHebName;

    @Type(type="uuid-char")
    private UUID alertUuid;

    private LocalDateTime alertExpiration;

    private AlertType alertType;

    private LocalDateTime fixedDate;

    private int day;

    private int hour;

    private int minute;

    private int week;

    private LocalDateTime lastTriggered;
    private int timesTriggered = 0;

    public void triggered() {
        timesTriggered++;
    }

    @Tolerate
    public AlertEntry() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AlertEntry that = (AlertEntry) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
