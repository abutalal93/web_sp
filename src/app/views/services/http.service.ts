import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers} from '@angular/http';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth-service.service';
import { FormGroup } from '@angular/forms';

@Injectable()
export class HttpService {
  private apiUrl = environment.apiUrl;

  private headers: Headers = new Headers();
  private options: RequestOptions = new RequestOptions();
  private path;
  private prefix = environment.prefix;

  constructor(private cookieService: CookieService, private http: Http,private authService: AuthService) {
  }

   async httpRequest(request_options:any): Promise<any>{

    if(this.cookieService.check('user')){
      this.headers.set('Authorization',this.cookieService.get('user'));
    }
  
    this.options.headers = this.headers;
    this.options.method = request_options.method;
    if(request_options.body){
      this.options.body = request_options.body;
    }
    if(request_options.prefix){
      this.prefix = request_options.prefix;
    }
    this.path = request_options.path ;
    let http_response = await this.http.request(this.apiUrl + this.prefix + this.path,  this.options)
    .toPromise()
    .then(response => response.json())
    .catch((err: any) => {
      let response: any;
      switch(err.status){
        case 401:
          response = err.json();
          this.authService.logoutUser();
          break;
        case 500:
          response = { status: err.status , message_key: err.statusText}
          break;
        default:
          response = err.json();
          break;
        }

      return response;
    });

    return http_response;


  }

  markFormGroupTouched(form: FormGroup) {
    (<any>Object).values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

}
