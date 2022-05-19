package openu.MedFind.dto;

public record RequestGenericMedicine(String val,
                                     String name,
                                     String matanId,
                                     String packageId,
                                     String atcId,
                                     int pageIndex,
                                     int orderBy)
{
}
