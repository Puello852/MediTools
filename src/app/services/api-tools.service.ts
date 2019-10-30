import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage'
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiToolsService {

	
@Output() evento = new EventEmitter();
@Output() cargar = new EventEmitter()
@Output() cambiarSegmento = new EventEmitter()
	token: any = "null"
	refreshToken: string;
  constructor(private ruta: Router,private storage:Storage, private _http: HttpClient,public platform:Platform) {}
  emitir(value) {
    this.evento.emit(value);
  }

  emitircarga(){
	  this.cargar.emit()
  }

  emitirsegmento(){
	  this.cambiarSegmento.emit()
  }


  getQuery( query: string, type: string,  authorization: boolean, body?: any ) {
		const url = environment.apiUrl+query;
		let headers:any = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
		if (authorization)
		{
			if(this.token != undefined && this.token != null)
			{
				// headers =  headers.append('Authorization',this.token);
			 	if(this.platform.is('cordova')){
			 	this.storage.get("token").then(token=>{
			 	// alert("añadiendo token headers")
			 		if(token){
			 			// alert(this.token)
			// 			// alert("token añadido al headers: "+this.token)
			 			// this.token = token
			 			headers =  headers.append('Authorization',this.token);
			 		}
			 	})
			 }else{
			 	headers =  headers.append('Authorization',localStorage.getItem('token'));
			 }
			
				// let to = this.storage.get('token') || null
				// console.log(this.token)
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

	listarcitas(numero){
		return this.getQuery('citas/miscitas/'+numero, 'get',true)
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

	eventMes2(data){
		return this.getQuery('cupo/getcupoMes', 'post',true,data)
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

	sendMsj(data){
		return this.getQuery('auth/enviarverificacion', 'post',true,data)
	}

	verificarSmj(data){
		return this.getQuery('auth/verificacionmsg', 'post',true,data)
	}

	editCelular(data){
		return	this.getQuery('persona/updatecelular', 'post', true,data)
	}



	getToken(): Observable<string> {
		const token = localStorage.getItem('token');
		return of(token);
	  }


	recibido(token){
		
		this.token = token
	}

	guardarToken(token:string,refreshToken:string,uid:string){
	
		// this.token = token
		if(this.platform.is('cordova')){
			// alert("celular")
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
		this.storage.set('name','edwin')
		let promesa = new Promise((resolve,reject)=>{

			if(this.platform.is('cordova')){
				this.storage.ready().then( () => {
					// alert("se cargo la plataforma")
					this.storage.get("token").then(token=>{
						if(token){
							// alert("encontre un token")
							this.token = token
							// alert(this.token)
							this.ruta.navigate(['/dashboard/home'])
						}else{
							this.ruta.navigate(['/home'])
						}
					})
					resolve()
				})
			}else{
				console.log("pc")
				//pc
				if(localStorage.getItem('token')){
					this.ruta.navigate(['/dashboard/home'])
					this.token = localStorage.getItem('token')
				}else{
					this.ruta.navigate(['/home'])
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


	refrescarToken(): Observable<string> {
		const url = environment.apiUrl+'auth/refreshToken';
	
		// append refresh token if you have one
		const refreshToken = localStorage.getItem('refresh');
		const expiredToken = localStorage.getItem('token');
	
		return this._http.get(url, {headers: new HttpHeaders().set('Refresh', refreshToken).set('Auto', expiredToken),observe: 'response'})
		  .pipe(
			share(), // <========== YOU HAVE TO SHARE THIS OBSERVABLE TO AVOID MULTIPLE REQUEST BEING SENT SIMULTANEOUSLY
			map(res => {
				console.log(res)
			  const token = res.headers.get('token');
			  const newRefreshToken = res.headers.get('Refresh');
	
			  // store the new tokens
			  localStorage.setItem('refreshToken', newRefreshToken);
			  localStorage.setItem('token', token);
	
			  return token;
			})
		  );
	  }

}
