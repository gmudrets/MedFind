package openu.MedFind.repositories;

import openu.MedFind.dto.MedicineEntry;
import openu.MedFind.dto.RequestStatus;
import openu.MedFind.dto.UserTypeRequestEntry;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserTypeRequestEntryRepository extends CrudRepository<UserTypeRequestEntry, Integer> {

    UserTypeRequestEntry findByUuid(String uuid);
    List<UserTypeRequestEntry> findAllUserTypeRequestsByStatus(RequestStatus status);

}
