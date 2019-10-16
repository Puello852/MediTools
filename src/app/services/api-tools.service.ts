import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage'
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ApiToolsService {

	
	@Output() evento = new EventEmitter();
	token: any = "null"
	refreshToken: string;
  constructor(private storage:Storage, private _http: HttpClient,public platform:Platform) {}
  emitir(value) {
    this.evento.emit(value);
  }
  getQuery( query: string, type: string,  authorization: boolean, body?: any ) {
		const url = environment.apiUrl+query;
		let headers:any = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
		
		if (authorization)
		{
			if(this.token != undefined && this.token != null)
			{
			
				// let to = this.storage.get('token') || null
				headers =  headers.append('Authorization',this.token);
			}
		}
		if (type == 'get'){
			return this._http.get(url, { headers: headers })
		}  
		else if (type == 'post'){
			return this._http.post(url, body, { headers: headers });
		} 
		else if(type == 'delete'){
			let httpOptions = { headers : headers, body : body }
			return  this._http.delete( url, httpOptions )
		} 
		else{
			return this._http.put(url, body, { headers: headers });
		}
	}
  
  

  	registerStart( body: any ) {	  
		return this.getQuery( 'auth/registrarse', 'post', false, body )
	}

	nuevapersonaNatural(data){
		return this.getQuery( 'persona/nuevapersonanatural', 'post', true, data )
	}

	CompletarDatos(data){
		return this.getQuery( 'persona/ingresarnueva', 'post', false, data )
	}

	tokenRefresh(data){
		return this.getQuery( 'auth/refreshToken', 'get', true, data )
	}

	GetInfoUser(){
		return	this.getQuery('persona/getProfile', 'get', true)
	}

	login(data){
		return this.getQuery( 'auth/login', 'post',  false, data )
	}

	resendCodeEmail(){
		return	this.getQuery('auth/reenviarcodigo', 'get', true)
	}

	editFirstName(data){
		return	this.getQuery('persona/primernombre', 'post', true,data)
	}

	editsecundtName(data){
		return	this.getQuery('persona/segundonombre', 'post', true,data)
	}



	editPrimerApellido(data){
		return	this.getQuery('persona/primerapellido', 'post', true,data)
	}

	editSegundoApellido(data){
		return	this.getQuery('persona/segundoapellido', 'post', true,data)
	}

	editDocumento(data){
		return	this.getQuery('persona/updatedocumento', 'post', true,data)
	}

	restablecerPass(){
		return	this.getQuery('auth/restablecerpassword', 'get', true)
	}

	UploadPhoto(data){
		return	this.getQuery('persona/subirfoto', 'post', true,data)
	}

	buscadorMedical(data){
		return	this.getQuery('citas/search/'+data, 'get', true)
	}

	obetenerMedicoId(data){
		return	this.getQuery('profesional/detalles', 'post', true,data)
	}

	pedircita(data){
		return	this.getQuery('citas/nuevacita', 'post', true,data)
	}

	ListMedical(){
		return this.getQuery('profesional/listarmedico', 'get',true)
	}

	ListEspecialidades(){
		return this.getQuery('profesional/listarespecialidades', 'get',true)
	}

	ListmedicalEspecialidades(data){
		return this.getQuery('profesional/getmedicoEspecialidad/'+data, 'get',true)
	}

	listarcitas(){
		return this.getQuery('citas/miscitas', 'get',true)
	}

	listarcitasAceptada(){
		return this.getQuery('citas/miscitasaceptadas', 'get',true)
	}

	listarcitasCanceladas(){
		return this.getQuery('citas/miscitascanceladas', 'get',true)
	}

	listarcistasPendients(){
		return this.getQuery('citas/miscitaspendientes', 'get',true)
	}

	obtenerhorario(data){
		return this.getQuery('horario/gethorariodia', 'post',true,data)
	}

	detallecita(data){
		return this.getQuery('citas/detallecita/'+data, 'get',true)
	}

	eventMes(data){
		return this.getQuery('horario/gethorarioMes', 'post',true,data)
	}

	cuposlibresFecha(data){
		return this.getQuery('horario/gethorariodia', 'post',true,data)
	}

	cuposLibres(data){
		return this.getQuery('cupo/getcupoMes', 'post',true,data)
	}

	cuposLibreDias(data){
		return this.getQuery('cupo/getcupo', 'post',true,data)
	}

	nuevacitaCupo(data){
		return this.getQuery('cupo/nuevacitacupo', 'post',true,data)
	}

	detallestadocita(id){
		return this.getQuery('citas/detallecita/'+id, 'get',true)
	}

	cancelarCita(data){
		return this.getQuery('citas/cancelarcita', 'post',true,data)
	}




	recibido(token){
		
		this.token = token
	}

	guardarToken(token:string,refreshToken:string,uid:string){
	
		if(this.platform.is('cordova')){
		
			this.token = token
			this.storage.set('refresh', refreshToken)
			this.storage.set('token', token)
			this.storage.set('uid', uid)
			// this.CargarToken()
		}else{
			//pc
			localStorage.setItem("token",token)
			localStorage.setItem("refresh", refreshToken)
			localStorage.setItem("uid",uid)
			// this.CargarToken()
		}
		
		this.token = token
	}

	CargarToken(){
		let promesa = new Promise((resolve,reject)=>{

			if(this.platform.is('cordova')){
				this.storage.ready().then( () => {
					this.storage.get("token").then(token=>{
						this.token = token
					})
					resolve()
				})
			}else{
				//pc
				if(localStorage.getItem('token')){
					this.token = localStorage.getItem('token')
				}
			}
		})
		return promesa
	}

	async validaToke(){
		this.CargarToken()
		if(!this.token){
			return Promise.resolve(false)
		}
	}

}
