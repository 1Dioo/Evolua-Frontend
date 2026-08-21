import {api} from "./api";
export const progressService={list:()=>api.get<any[]>("/progresso"),course:(id:number|string)=>api.get<any>(`/cursos/${id}/progresso`),update:(lessonId:number,p:number,done?:boolean)=>api.put(`/aulas/${lessonId}/progresso`,{percentual:p,concluida:done}),complete:(lessonId:number)=>api.post(`/aulas/${lessonId}/concluir`,{})};
