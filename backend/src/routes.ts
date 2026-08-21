import { Router } from "express";
import { register, login, logout, me as authMe, changePassword } from "./controllers/authController.js";
import * as course from "./controllers/courseController.js";
import * as user from "./controllers/userController.js";
import * as progress from "./controllers/progressController.js";
import * as simple from "./controllers/simpleController.js";
import { authMiddleware, requireRole } from "./middlewares/authMiddleware.js";

export const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", authMiddleware, logout);
router.get("/auth/me", authMiddleware, authMe);
router.put("/auth/password", authMiddleware, changePassword);

router.get("/users/me", authMiddleware, user.me);
router.put("/users/me", authMiddleware, user.updateMe);

router.get("/cursos", authMiddleware, course.listCourses);
router.get("/cursos/:id", authMiddleware, course.getCourse);
router.post("/cursos", authMiddleware, requireRole("admin"), course.createCourse);
router.put("/cursos/:id", authMiddleware, requireRole("admin"), course.updateCourse);
router.delete("/cursos/:id", authMiddleware, requireRole("admin"), course.deleteCourse);

router.get("/cursos/:cursoId/modulos", authMiddleware, course.listModules);
router.post("/cursos/:cursoId/modulos", authMiddleware, requireRole("admin"), course.createModule);
router.put("/modulos/:id", authMiddleware, requireRole("admin"), course.updateModule);
router.delete("/modulos/:id", authMiddleware, requireRole("admin"), course.deleteModule);

router.get("/modulos/:moduloId/aulas", authMiddleware, course.listLessons);
router.post("/modulos/:moduloId/aulas", authMiddleware, requireRole("admin"), course.createLesson);
router.get("/aulas/:id", authMiddleware, course.getLesson);
router.put("/aulas/:id", authMiddleware, requireRole("admin"), course.updateLesson);
router.delete("/aulas/:id", authMiddleware, requireRole("admin"), course.deleteLesson);
router.post("/aulas/:id/video", authMiddleware, requireRole("admin"), course.setVideo);

router.get("/progresso", authMiddleware, progress.listProgress);
router.get("/cursos/:cursoId/progresso", authMiddleware, progress.courseProgress);
router.put("/aulas/:aulaId/progresso", authMiddleware, progress.upsertProgress);
router.post("/aulas/:aulaId/concluir", authMiddleware, progress.complete);

router.get("/certificados", authMiddleware, simple.certificates);
router.get("/certificados/:id", authMiddleware, simple.certificate);
router.get("/certificados/:id/validar", simple.validateCertificate);

router.get("/atividades", authMiddleware, (req,res)=>simple.list("atividades",req,res));
router.get("/atividades/:id", authMiddleware, (req,res)=>simple.get("atividades",req,res));
router.post("/atividades", authMiddleware, requireRole("admin"), (req,res)=>simple.create("atividade",req,res));
router.put("/atividades/:id", authMiddleware, requireRole("admin"), (req,res)=>simple.update("atividade",req,res));

router.get("/eventos", authMiddleware, (req,res)=>simple.list("eventos",req,res));
router.get("/eventos/:id", authMiddleware, (req,res)=>simple.get("eventos",req,res));
router.post("/eventos", authMiddleware, requireRole("admin"), (req,res)=>simple.create("evento",req,res));
router.put("/eventos/:id", authMiddleware, requireRole("admin"), (req,res)=>simple.update("evento",req,res));
router.delete("/eventos/:id", authMiddleware, requireRole("admin"), (req,res)=>simple.remove("evento",req,res));

router.get("/notificacoes", authMiddleware, simple.notifications);
router.put("/notificacoes/:id/lida", authMiddleware, simple.markRead);
router.put("/notificacoes/marcar-todas-lidas", authMiddleware, simple.markAllRead);
router.delete("/notificacoes/:id", authMiddleware, simple.deleteNotification);

router.get("/faq", simple.list.bind(null,"faq"));
router.post("/faq", authMiddleware, requireRole("admin"), (req,res)=>simple.create("faq",req,res));
router.put("/faq/:id", authMiddleware, requireRole("admin"), (req,res)=>simple.update("faq",req,res));
router.delete("/faq/:id", authMiddleware, requireRole("admin"), (req,res)=>simple.remove("faq",req,res));

router.post("/contatos", (req,res)=>simple.createContact(req,res));
router.get("/dashboard", authMiddleware, (req,res)=>import("./controllers/dashboardController.js").then(m=>m.dashboard(req,res)));
