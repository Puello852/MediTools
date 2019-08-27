import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiToolsService {

  constructor( private _http: HttpClient) {}

  getQuery( query: string, type: string,  authorization: boolean, body?: any ) {
		
		const url = environment.apiUrl+query;
		console.log(url)
		let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
		
		if (authorization)
		{
			if(localStorage.getItem('token') != undefined && localStorage.getItem('token') != "" && localStorage.getItem('token') != null)
			{
				headers =  headers.append('Authorization', localStorage.getItem('token'));
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
		return this.getQuery( 'auth/registro', 'post', false, body )
	}

	CompletarDatos(data){
		return this.getQuery( 'persona/ingresarnueva', 'post', false, data )
	}

	login(data){
		return this.getQuery( 'auth/registrarse', 'post',  false, data )
	}

}
