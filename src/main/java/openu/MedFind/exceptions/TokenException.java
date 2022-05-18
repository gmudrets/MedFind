package openu.MedFind.exceptions;

import lombok.experimental.StandardException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@StandardException
@ResponseStatus(value= HttpStatus.UNAUTHORIZED, reason="Bad authentication")
public class TokenException extends Exception{
}
