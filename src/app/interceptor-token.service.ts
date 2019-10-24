import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { catchError,map,flatMap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiToolsService } from './services/api-tools.service';

const TOKEN_KEY = 'auth-token';
@Injectable()

export class RefreshToken implements HttpInterceptor {
  token: string;
  newheaders: HttpHeaders;
  cloneRequest: HttpRequest<any>;
  next: HttpHandler;


  constructor( private injector : Injector, private router : Router,public api: ApiToolsService,private http : HttpClient ){}

  intercept( request : HttpRequest<any>, next : HttpHandler) : Observable < HttpEvent<any> > {
    return next.handle(request).catch( (errorResponse: HttpErrorResponse) => {
        const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
        if( errorResponse.status == 401 ){
            console.log("a refrescar")
                let oldtoken = localStorage.getItem("refresh")
                let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
                headers = headers.append('Refresh', oldtoken)
                const http = this.injector.get(HttpClient);
                return http.get(environment.apiUrl+'auth/refreshToken',{ headers: headers })
                .catch( error => { 
                    if(error.status == 400){
                        if(error.error.code < 0){
                            // this.ref.closeAll()
                            localStorage.clear()
                            this.router.navigate(["/home"])
                        }
                    }
                    return Observable.throw(errorResponse)
                })
                .flatMap( 
                    ( data : any) => {
                        localStorage.setItem('token', data.token );
                        console.log(data)
                        localStorage.setItem('refresh', data.Refresh );
                        let token  = localStorage.getItem("token")
                        let newheaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token })
                        const cloneRequest = request.clone({headers: newheaders});
                        return next.handle(cloneRequest)
                    },
                )
            
        
        }
        return Observable.throw(errorResponse)
    })
}














  // protected url   = environment.apiUrl+'auth/refreshToken';
  // protected debug = true;

  // constructor(public http: HttpClient,private alertController: AlertController, private injector: Injector) {}

  // inflightAuthRequest = null;

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   // exempt some paths from authentication
  //   if (req.headers.get('authExempt') === 'true') {
  //     return next.handle(req);
  //   }

  //   const authService = this.injector.get(ApiToolsService);

  //   if (!this.inflightAuthRequest) {
  //     this.inflightAuthRequest = authService.getToken();
  //   }

  //   return this.inflightAuthRequest.pipe(
  //     switchMap((newToken: string) => {
  //       console.log(newToken)
  //       // unset request inflight
  //       this.inflightAuthRequest = null;

  //       // use the newly returned token
  //       const authReq = req.clone({
  //         headers: req.headers.set('Authorization', newToken ? newToken : '')
  //       });

  //       return next.handle(authReq);
  //     }),
  //     catchError(error => {
  //       console.log(error)
  //       // checks if a url is to an admin api or not
  //       if (error.error.Code == -300) {
  //         // check if the response is from the token refresh end point
  //         const isFromRefreshTokenEndpoint = !!error.headers.get(
  //           'unableToRefreshToken'
  //         );

  //         if (isFromRefreshTokenEndpoint) {
  //           localStorage.clear();
  //           console.log("te mando pa login")
  //           // this.router.navigate(['/sign-page']);
  //           return throwError(error);
  //         }

  //         if (!this.inflightAuthRequest) {
  //           console.log("te refresco")
  //           this.inflightAuthRequest = authService.refrescarToken();
  //           // console.log(this.inflightAuthRequest)
  //           if (!this.inflightAuthRequest) {
  //             console.log("te mando a registrar")
  //             // remove existing tokens
  //             localStorage.clear();
  //             // this.router.navigate(['/sign-page']);
  //             return throwError(error);
  //           }
  //         }

  //         console.log(this.inflightAuthRequest)

  //         return this.inflightAuthRequest.then(data=>{
  //           console.log(data)
  //         })

  //         return this.inflightAuthRequest.pipe(
  //           switchMap((newToken: string) => {
  //             console.log("entre aqui")
  //             console.log("nuevo token,", newToken)
  //             // unset inflight request
  //             this.inflightAuthRequest = null;

  //             // clone the original request
  //             const authReqRepeat = req.clone({
  //               headers: req.headers.set('token', newToken)
  //             });

  //             // resend the request
  //             return next.handle(authReqRepeat);
  //           })
  //         );
  //       } else {
  //         console.log("entro al error")
  //         return throwError(error);
  //       }
  //     })
  //   );
  // }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


  //   return from(localStorage.getItem('Refresh'))
    
  //           .pipe(
  //               switchMap(token => {
  //                 console.log(token)
  //                   if (token) {
  //                       request = request.clone({ headers: request.headers.set('Authorization', 'Refresh ' + token) });
  //                   }

  //                   if (!request.headers.has('Content-Type')) {
  //                       request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
  //                   }

  //                   if (this.debug) {
  //                     console.log(this.debug)
  //                       request = request.clone({ url: this.url + request.url + '?XDEBUG_SESSION_START=1'});
  //                   }

  //                   return next.handle(request).pipe(
  //                       map((event: HttpEvent<any>) => {
  //                         console.log("entre")
  //                           if (event instanceof HttpResponse) {
  //                               // do nothing for now
  //                           }
  //                           return event;
  //                       }),
  //                       catchError((error: HttpErrorResponse) => {
  //                         console.log("err")
  //                           const status =  error.status;
  //                           const reason = error && error.error.reason ? error.error.reason : '';

  //                           this.presentAlert(status, reason);
  //                           return throwError(error);
  //                       })
  //                   );
  //               })
  //           );


  //   }

  //   async presentAlert(status, reason) {
  //       const alert = await this.alertController.create({
  //           header: status + ' Error',
  //           subHeader: 'Subtitle',
  //           message: reason,
  //           buttons: ['OK']
  //       });

  //       await alert.present();
  //   }


  // }

  //   intercept( request : HttpRequest<any>, next : HttpHandler) : Observable < HttpEvent<any> > {
  //     return next.handle(request).catch( (errorResponse: HttpErrorResponse) => {
  //         const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
  //         if( errorResponse.status == 400 ){
  //             if( error.error.code == -100 ){
  //                 let oldtoken = localStorage.getItem("token")
  //                 let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
  //                 headers = headers.append('Authorization', oldtoken)
  //                 const http = this.injector.get(HttpClient);
  //                 return http.post(environment.apiUrl+'auth/refreshToken', { "refresh_token":  localStorage.getItem("secondtoken")}, { headers: headers })
  //                 .catch( error => { 
  //                     if(error.status == 400){
  //                         if(error.error.code < 0){
  //                             localStorage.clear()
  //                         }
  //                     }
  //                     return Observable.throw(errorResponse)
  //                 })
  //                 .flatMap( 
  //                     ( data : any) => {
  //                         localStorage.setItem('token', data.data.access_token );
  //                         localStorage.setItem('secondtoken', data.data.refresh_token );
  //                         let token  = localStorage.getItem("token")
  //                         let newheaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token })
  //                         const cloneRequest = request.clone({headers: newheaders});
  //                         return next.handle(cloneRequest)
  //                     },
  //                 )
  //             }
  //             else if(error.error.code == -200){
  //                 localStorage.clear()
  //             }
  //         }
  //         return Observable.throw(errorResponse)
  //     })
  // }


  //  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
  //    return next.handle(request).pipe(
  //      catchError((err: HttpErrorResponse) => {
  //       const error = (typeof err.error !== 'object') ? JSON.parse(err.error) : err;
  //       console.log(error)
  //        if (err.status == 400) {
  //          if(error.error.Code == -300){
  //           let refresh: string = localStorage.getItem('refresh');
  //           let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
  //           headers = headers.append('Refresh', refresh)
  //           const http = this.injector.get(HttpClient);
            
  //         http.get(environment.apiUrl+'auth/refreshToken',{headers:headers}).subscribe((data:any)=>{
  //             console.log(data.Refresh)
  //             localStorage.setItem('token', data.token)
  //             localStorage.setItem('refresh', data.Refresh)
  //             let token  = localStorage.getItem("token")
  //             let newheaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': token })
  //             const cloneRequest = request.clone({headers: newheaders});
  //             return next.handle(cloneRequest)

  //           })
  //         }
  //       }
  //       return Observable.throw(err);
  //      })
  //    );

  // 
}