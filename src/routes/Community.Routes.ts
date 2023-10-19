import communityController from "../controllers/Community.Controller";
import { verifyJWTMiddleware } from "../utils/jwt";
import router from "./Auth.Routes";

router.post('/create',verifyJWTMiddleware,communityController.create);

export default router;