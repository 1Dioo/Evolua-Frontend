import { api } from "./api"; import type { Course, Lesson, Module } from "@/types";
const mapLesson=(x:any):Lesson=>({id:Number(x.id),courseId:Number(x.course_id??x.courseId),moduleId:Number(x.modulo_id??x.moduleId),title:x.titulo??x.title,description:x.descricao??x.description,content:x.conteudo??x.content,videoUrl:x.video_url??x.videoUrl??null,thumbnailUrl:x.thumbnail_url??x.thumbnailUrl??null,duration:Number(x.duracao??x.duration??0),order:Number(x.ordem??x.order??1),status:"em-andamento"});
const mapCourse=(x:any):Course=>{const modules:Module[]=(x.modulos??x.modules??[]).map((m:any):Module=>({id:Number(m.id),courseId:Number(m.curso_id??m.courseId??x.id),title:m.titulo??m.title,order:Number(m.ordem??m.order??1),lessons:(m.aulas??m.lessons??[]).map(mapLesson)}));const lessons=modules.flatMap((m:Module)=>m.lessons);const completed=lessons.filter(l=>l.status==="concluida").length;return {id:Number(x.id),slug:x.slug,title:x.titulo??x.title,description:x.descricao??x.description,category:x.categoria??x.category,status:completed===lessons.length&&lessons.length?"Concluído":completed?"Em andamento":"Disponível",progress:lessons.length?Math.round(completed/lessons.length*100):0,totalLessons:lessons.length,completedLessons:completed,hours:x.horas??"",iconName:x.iconName??"BookOpen",modules};};
export const courseService={
 list:async()=> (await api.get<any[]>("/cursos")).map(mapCourse),
 getById:async(id:string|number)=>mapCourse(await api.get<any>(`/cursos/${id}`)),
 listLessons:async(id:string|number)=> (await api.get<any[]>(`/cursos/${id}/aulas`)).map(mapLesson),
 create:(input:any)=>api.post("/cursos",input),update:(id:string|number,input:any)=>api.put(`/cursos/${id}`,input),remove:(id:string|number)=>api.delete(`/cursos/${id}`)
};
export {mapCourse,mapLesson};
