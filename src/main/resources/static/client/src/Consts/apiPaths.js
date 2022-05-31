module.exports = {
    ServerConsts : {
        SEARCH_MEDICINE : "/api/SearchMedicine",
        SEARCH_GENERIC : "/api/SearchGeneric",
        AUTOCOMPLETE : "/api/Autocomplete",
        GET_BROCHURE: "/api/GetBrochure",
        REGISTER : "/api/User/Register",
        GET_SHARED_MEDICINE : "/api/GetAllSharedStockMedicine",
        GET_USER_SHARED_MEDICINE : "/api/GetAllUserSharedStockMedicine",
        GET_USER_MEDICINE : "/api/GetAllUserStockMedicine",
        UPDATE_MEDICINE_SHARING : "/api/ShareMedicineInStock",
        CREATE_NEW_USERTYPE_REQUEST : "/api/CreateNewUserTypeRequest",
        GET_PENDING_REQUESTS : "/api/GetAllUserTypeRequestsByStatus",
        CHANGE_REQUEST_STATUS : "/api/changeUserTypeRequestStatus",
    },
    External: {
        EXTERNAL_FILES_URL: "https://mohpublic.z6.web.core.windows.net/IsraelDrugs/"
    }
};