const adminController = require("../controllers/admin.controller");
const managerController = require("../controllers/manager.controller");
const generalController = require("../controllers/general.controller");
const customerController = require("../controllers/customer.controller");

const express = require("express");
const { append } = require("express/lib/response");
const router = express.Router();

const app = express()

router.post("/RegisterManager", adminController.RegisterManager);
router.post("/register", generalController.register);
router.post("/login", generalController.login);
router.get("/user-profile", generalController.userProfile);
router.delete("/logout", generalController.logout);
router.get("/getCategory", generalController.getCategory);





router.post("/CreateLibrary", adminController.CreateLibrary);
router.post("/CreateBook", managerController.CreateBook);

router.patch("/getOneBook", customerController.getOneBook);
router.get("/getBooks", customerController.getBooks);


router.post("/order", customerController.order);
router.get("/getOrdersCustomer", customerController.getOrdersCustomer);
router.patch("/getOrder_ItemsCustomer", customerController.getOrder_ItemsCustomer);
router.get("/getOrdersLibrary", managerController.getOrdersLibrary);

router.patch("/updateProfile", generalController.updateProfile);
router.patch("/updateBook", managerController.updateBook);

router.patch("/updateOrderStatusManager", managerController.updateOrderStatusManager)

router.post("/CustomerContact", customerController.CustomerContact);

router.get("/getUsers", adminController.viewUsers);
router.get("/getQueriesManager", adminController.getQueriesManager);
router.post("/createCategory", adminController.CreateCategory);
router.patch("/setQueryManager", adminController.statusQueryManager);

router.get("/getLibraries", adminController.viewLibraries);
router.patch("/setCustomerFlag", adminController.UpdateCustomerFlag);
router.patch("/setLibraryFlag", adminController.UpdateLibraryFlag);

router.patch("/setBookFlag", managerController.updateBookFlag);

router.patch("/updatePassword", generalController.updatePassword);

router.patch("/getOneBookLibrary", managerController.getOneBookLibrary);
router.get("/getBooksLibrary", managerController.getBooksLibrary);

router.post("/RequestCategory", managerController.RequestCategory);

router.patch("/getcartdetails", customerController.getCartDetails);
router.get("/getMyReviews", customerController.getMyReviews);
router.patch("/getreviewsinglebook", customerController.getReviews);
router.post("/giveReview",customerController.giveReview);
router.get("/seeReviewsLibrary", managerController.seeReviews);
router.delete("/deleteReviewLibrary", managerController.deleteReview);

router.delete("/deleteReview", customerController.deleteReview);

router.get("/getQueries", managerController.getQueries);
router.get("/getLibrary", managerController.getLibrary);
router.patch("/statusQuery", managerController.statusQuery);
router.patch("/getOrder_ItemsManager", managerController.getOrder_ItemsManager);
router.get("/getLibrariesGeneral", generalController.getLibraries);


router.get("/getEvents", customerController.getEvents);



module.exports = router;