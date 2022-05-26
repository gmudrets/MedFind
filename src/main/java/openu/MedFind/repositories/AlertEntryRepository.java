package openu.MedFind.repositories;

import openu.MedFind.dto.AlertEntry;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AlertEntryRepository extends CrudRepository<AlertEntry, Integer>  {

    List<AlertEntry> findAllByUserUuid(String userUuid);

    Long deleteById(Long Id);

}
