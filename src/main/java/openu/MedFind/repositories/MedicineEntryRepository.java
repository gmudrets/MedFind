package openu.MedFind.repositories;

import openu.MedFind.dto.MedicineEntry;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MedicineEntryRepository extends CrudRepository<MedicineEntry, Integer> {

    boolean existsByIdAndUuid(Long id, String uuid);

    void deleteById(Long id);

    MedicineEntry findByRegNumAndUuid(String regNum, String uuid);

    List<MedicineEntry> findAllByUuid(String uuid);

    List<MedicineEntry> findAllByShared(boolean shared);
}
