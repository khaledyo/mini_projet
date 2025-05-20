import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Enseignant } from '../model/enseignant';

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  http=inject(HttpClient);
  private apiUrl = 'http://localhost:3000';
  constructor() { }
  getEnseig(){
    return this.http.get<Enseignant[]>(this.apiUrl+"/enseignant")
  }
  getEnseigById(id:String){
    return this.http.get<Enseignant>(this.apiUrl+"/enseignant/"+id);
  }
  updateEnseig(id:String,model:Enseignant){
    return this.http.put(this.apiUrl+"/enseignant/"+id,model);
  }
  addEnseig(model:Enseignant){
    return this.http.post(this.apiUrl+"/enseignant",model);
  }
  deleteEnseig(id:String){
    return this.http.delete(this.apiUrl+"/enseignant/"+id);
  }
}
