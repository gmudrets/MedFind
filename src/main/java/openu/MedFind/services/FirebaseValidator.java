package openu.MedFind.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FirebaseValidator {

    public static boolean isIdTokenValid(String idToken) {
        try {
            getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            log.error("Firebase error: ", e);
            return false;
        }

        return true;
    }

    public static String getUidFromIdToken(String idToken) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().verifyIdToken(idToken).getUid();
    }
}
