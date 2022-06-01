package openu.MedFind.repositories;

import openu.MedFind.dto.MedicineEntry;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MedicineEntryRepository extends CrudRepository<MedicineEntry, Integer> {

    boolean existsByIdAndUuid(Long id, String uuid);

    @Transactional
    void deleteById(Long id);

    MedicineEntry findByRegNumAndUuid(String regNum, String uuid);
    MedicineEntry findById(Long id);

    List<MedicineEntry> findAllByUuid(String uuid);

    List<MedicineEntry> findAllByUuidAndShared(String uuid, boolean shared);

    List<MedicineEntry> findAllByShared(boolean shared);
}
