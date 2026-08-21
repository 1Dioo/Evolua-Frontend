import {api} from "./api"; export const contactService={send:(body:{nome:string;email:string;assunto:string;mensagem:string})=>api.post("/contatos",body)};
