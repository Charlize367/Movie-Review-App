import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/authController.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});


const upload = multer({ storage : storage});
const authRouter = Router();

authRouter.post('/sign-up', upload.single('image'), signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', (req, res) => res.send("signout"));

export default authRouter;