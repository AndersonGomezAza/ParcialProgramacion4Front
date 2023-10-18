import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public api:HttpClient) { }

  apiUrl = "https://localhost:7027/api/";

  public async Get (gatewayController: string){
    var respo:any;
    await this.api.get(this.apiUrl+gatewayController).toPromise().then((res)=>{
      respo = res;
    })
    console.log(respo);
    return respo;
  }

  public async getById (gatewayController: string, idBody: string){
    await this.api.get(this.apiUrl+gatewayController+'/'+idBody).toPromise().then((res=>{
      console.log(res);
    })
    )
  }

  public async post ( gatewayController: string , body: any ){
    return await this.api.post(this.apiUrl+gatewayController, body).toPromise().then((res)=>{
      console.log(res);
    })
  }

  public async delete (gatewayController: string , idBody:  string){
    console.log(this.apiUrl+gatewayController+'/'+idBody);
    return await this.api.delete(this.apiUrl+gatewayController+'/'+idBody).toPromise().then(res =>{
      console.log(res);
    });
  }

  public async update ( gatewayController: string , body: any, idBody:  string ){
    return await this.api.put(this.apiUrl+gatewayController+'/'+idBody, body).toPromise().then(res =>{
      console.log(res);
    });
  }
}
