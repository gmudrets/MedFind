package openu.MedFind.services;

import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.ErrorCode;
import com.google.firebase.FirebaseException;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.cloud.FirestoreClient;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.ExecutionException;

@Slf4j
public class FirebaseValidator {

    private static String DoctorType = "רופא";


    public static boolean isIdTokenValid(String idToken) {
        try {
            getUidFromIdToken(idToken);
        } catch (FirebaseAuthException e) {
            log.error("Firebase error: ", e);
        }

        return true;
    }

    public static String getUidFromIdToken(String idToken) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().verifyIdToken(idToken).getUid();
    }

    public static String getEmailFromIdToken(String idToken) throws FirebaseAuthException {
        return FirebaseAuth.getInstance().verifyIdToken(idToken).getEmail();
    }

    public static boolean isDoctor(String idToken) throws FirebaseAuthException {
        var uuid = getUidFromIdToken(idToken);
        var query = FirestoreClient.getFirestore().collection("users").get();
        QuerySnapshot querySnapshot = null;
        try {
            querySnapshot = query.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new FirebaseAuthException(new FirebaseException(ErrorCode.ABORTED, e.getMessage(), e));
        }

        for (var document : querySnapshot.getDocuments()) {
            if (document.getData().get("uid").equals(uuid) && document.getData().get("userType").equals(DoctorType)) {
                return true;
            }
        }

        return false;
    }

}