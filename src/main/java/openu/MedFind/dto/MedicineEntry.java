package openu.MedFind.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Tolerate;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Getter
@Setter
@Entity
@Table(name = "medicine_store")
@Builder
@ToString
public class MedicineEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Tolerate
    public MedicineEntry() {
    }

    private String uuid;

    private String userEmail;

    private String regNum;

    private Date expiration;

    private String unitType;

    private boolean shared;

    private int count;

    private double dosage;

    private String engName;

    private String hebName;

    private String activeComponents;

    private String docBrochureUrl;

    private boolean healthBasket;

    private boolean prescription;

    private String treatment;

    private String imageUrl;

    private String brochureUrl;

    private boolean expirationAlertSent;
    public void addCount(int count) {
        this.count += count;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        MedicineEntry that = (MedicineEntry) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
