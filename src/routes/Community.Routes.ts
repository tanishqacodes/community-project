import communityController from "../controllers/Community.Controller";
import { verifyJWTMiddleware } from "../utils/jwt";
import router from "./Auth.Routes";

router.post('/create',verifyJWTMiddleware,communityController.create);
router.get('/:id/members',communityController.getAllCommunityMembers);
router.get('/',verifyJWTMiddleware,communityController.getAllCommunity);
router.get('/me/owner',verifyJWTMiddleware,communityController.getOwnedCommunity);
router.get('/me/member',verifyJWTMiddleware,communityController.getJoinedCommunity);

export default router;