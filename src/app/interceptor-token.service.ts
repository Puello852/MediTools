import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()

export class RefreshToken implements HttpInterceptor {
   
    constructor( private injector : Injector){}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log(err)
        if (err.error.Code == -300) {
            let refresh: string = localStorage.getItem('refresh');
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
            headers = headers.append('Refresh', refresh)
            const http = this.injector.get(HttpClient);
            console.log("vamos a refrescar el token")
            http.get(environment.apiUrl+'auth/refreshToken',{headers:headers}).subscribe((data:any)=>{
              localStorage.setItem('token', data.token)
              localStorage.setItem('refresh', data.refresh)
              let token  = localStorage.getItem("token")
              let newheaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token })
              const cloneRequest = request.clone({headers: newheaders});
              return next.handle(cloneRequest)
            })
        }

        return throwError( err );

      })
    );

  }

  //  intercept( request : HttpRequest<any>, next : HttpHandler) : Observable < HttpEvent<any> > {

      
  //      return next.handle(request).pipe( request => {
  //          const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
  //          if( errorResponse.status == 400 && error.error.code == -100){
  //              let oldtoken = localStorage.getItem("token")
  //              let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
  //              headers = headers.append('Authorization', oldtoken)
  //              const http = this.injector.get(HttpClient);
  //              return http.post(environment.apiUrl+'auth/refreshToken', { "refresh_token":  localStorage.getItem("refresh_token")}, { headers: headers })
  //              .flatMap( ( data : any) => {
  //                  localStorage.setItem('token', data.data.access_token );
  //                  localStorage.setItem('refresh_token', data.data.refresh_token );
  //                  let token  = localStorage.getItem("token")
  //                  let newheaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token })
  //                  const cloneRequest = request.clone({headers: newheaders});
  //                  return next.handle(cloneRequest)
  //              })
  //          }
            

  //          return Observable.throw(errorResponse)
  //      })
  //  }
}
