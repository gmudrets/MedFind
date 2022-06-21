package openu.MedFind.repositories;

import lombok.NonNull;
import openu.MedFind.dto.AlertEntry;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface AlertEntryRepository extends CrudRepository<AlertEntry, Integer> {
    List<AlertEntry> findAllByUserUuid(String userUuid);
    @NonNull List<AlertEntry> findAll();

    @Transactional
    Long deleteById(Long Id);

    @Transactional
    Long deleteByAlertUuid(UUID uuid);

}
