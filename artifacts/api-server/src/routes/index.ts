import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import translateRouter from "./translate";
import translationsRouter from "./translations";
import billingRouter from "./billing";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(translateRouter);
router.use(translationsRouter);
router.use(billingRouter);
router.use(adminRouter);

export default router;
