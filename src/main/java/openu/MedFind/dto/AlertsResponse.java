package openu.MedFind.dto;

public record AlertsResponse(Long id,
                             String alertName,
                             String regNum,
                             String user,
                             ActiveAlertType alertType
                                   ) {
}
