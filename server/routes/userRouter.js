import express from "express";
import {
  profileBackroundUpload,
  profileImageUpload,
  portfolioImageUpload,
} from "../middleware/multerCloudinary.js";

import {
  emailConfirmation,
  handleRegister,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteConnection,
  signInHandling,
  changePasswordEmail,
  updateUser,
  updatePassword,
  loggedUser,
  getAllUsers,
  updateProfileImage,
  updateProfileBackground,
  addFavOffer,
  getUserById,
  uploadPortfolioImage,
  deletePortfolioImage,
  deleteLanguage,
  addLanguage,
} from "../controllers/userController.js";
import auth from "../middleware/user-auth.js";

const userRoutes = express.Router();

userRoutes.post("/register", handleRegister);
userRoutes.post("/emailconfirm/:token", emailConfirmation);
userRoutes.post("/send-connection-request", sendConnectionRequest);
userRoutes.post("/accept-connection-request", acceptConnectionRequest);
userRoutes.post("/reject-connection-request", rejectConnectionRequest);
userRoutes.post("/delete-connection", deleteConnection);

userRoutes.post("/signin", signInHandling);
userRoutes.put("/updatepassword/:token", updatePassword);
userRoutes.post("/changepassword", changePasswordEmail);
userRoutes.put("/update/:userId", updateUser);
userRoutes.get("/loggeduser", auth, loggedUser);

userRoutes.get("/all-the-users", getAllUsers);
userRoutes.get("/single-user/:userId", getUserById);


userRoutes.put("/update-profile-pic/:userId",  profileImageUpload.single("profileImage"),
updateProfileImage);



userRoutes.put(
  "/update-profile-back/:userId",
  profileBackroundUpload.single("profileBackground"),
  updateProfileBackground
);

userRoutes.post("/add-fav-offer/:offerId", addFavOffer);

userRoutes.post(
  "/upload-port-img/:userId",
  portfolioImageUpload.single("portfolioImage"),
  uploadPortfolioImage
);

userRoutes.delete("/delete-port-img/:userId", deletePortfolioImage);

userRoutes.post("/add-language/:userId", addLanguage);
userRoutes.delete("/delete-language/:userId", deleteLanguage);

export default userRoutes;
