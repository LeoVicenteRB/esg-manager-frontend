export type SessionUser={id:string;name:string;email:string;role:string};
export function saveSession(token:string,user:SessionUser){localStorage.setItem('esg.token',token);localStorage.setItem('esg.user',JSON.stringify(user));}
export function getUser():SessionUser|null{if(typeof window==='undefined')return null;const raw=localStorage.getItem('esg.user');return raw?JSON.parse(raw):null;}
export function logout(){localStorage.removeItem('esg.token');localStorage.removeItem('esg.user');location.href='/login';}
