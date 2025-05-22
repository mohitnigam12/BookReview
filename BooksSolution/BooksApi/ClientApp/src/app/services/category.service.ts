import { Injectable } from "@angular/core";
import { environment } from "../../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category.model";

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/category`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
