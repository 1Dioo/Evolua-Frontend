import {api} from "./api"; import type {User} from "@/types";
export const userService={me:()=>api.get<User>("/users/me"),update:(input:Partial<{name:string;email:string;avatarUrl:string|null}>)=>api.put<User>("/users/me",{nome:input.name,email:input.email,avatarUrl:input.avatarUrl})};
