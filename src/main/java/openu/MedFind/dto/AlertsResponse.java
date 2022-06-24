package openu.MedFind.dto;

public record AlertsResponse(Long id,
                             String alertName,
                             String regNum,
                             String medicineHebName,
                             String user,
                             String userEmail,
                             ActiveAlertType alertType
                                   ) {
}
