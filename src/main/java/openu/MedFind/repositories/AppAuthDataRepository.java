package openu.MedFind.repositories;

import openu.MedFind.dto.AppAuthData;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AppAuthDataRepository extends CrudRepository<AppAuthData, Integer> {

    List<AppAuthData> findAll();
}
