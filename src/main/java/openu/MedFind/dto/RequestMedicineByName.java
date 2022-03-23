package openu.MedFind.dto;

public record RequestMedicineByName(String val,
                                    boolean prescription,
                                    boolean healthServices,
                                    int pageIndex,
                                    int orderBy)
{
}
