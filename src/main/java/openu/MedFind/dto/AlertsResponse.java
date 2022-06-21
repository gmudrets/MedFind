package openu.MedFind.dto;

public record AlertsResponse(Long id,
                             String alertName,
                             String regNum,
                             ActiveAlertType alertType
                                   ) {
}
