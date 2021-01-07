import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from 'rxjs/operators';

import { Item } from "./item.model";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiPath: string = "http://localhost:3001/api/items";

  constructor(private http: HttpClient) { }

getAll(): Observable<Item[]>{
  return this.http.get(this.apiPath).pipe(
    catchError(this.handleError),
    map(this.jsonDataToItems)
    )
}
getById(id: string): Observable<Item>{
  const url = `${this.apiPath}/${id}`;

  return this.http.get(url).pipe(
    catchError(this.handleError),
    map(this.jsonDataToItem)
    )
}



create(items: Item): Observable<Item>{
  return this.http.post(this.apiPath, items).pipe(
    catchError(this.handleError),
    map(this.jsonDataToItem)
    )
}

update(items: Item): Observable<Item>{

  const url = `${this.apiPath}/${items._id}`;

  return this.http.put(url, items).pipe(
    catchError(this.handleError),
    map(() => items)
    )
}

delete(_id: string): Observable<any>{
  const url = `${this.apiPath}/${_id}`;

  return this.http.delete(url).pipe(
    catchError(this.handleError),
    map(()=>null)
  )
}


//PRIVATE

private jsonDataToItems(jsonData: any[]): Item[]{
  const items: Item[] = [];
  jsonData.forEach(element => items.push(element as Item));
  return items;
}

private jsonDataToItem(jsonData: any): Item{
  return jsonData as Item;
}

private handleError(error: any): Observable<any>{
  console.log("ERRO NAN REQUISIÇÃO =>", error);

  return throwError(error);
}

}
