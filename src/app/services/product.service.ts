import {Inject, Injectable} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';


import {APP_CONFIG} from '../app-config.constants';
import {ProductResponse} from '../response/product.response';
import {Observable} from 'rxjs/Observable';
import {ProductMaterialResponse} from '../response/product-material.response';
import {ProductColorResponse} from '../response/product-color.response';
import {IAppConfig} from '../app-config.interface';

@Injectable()
export class ProductService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, @Inject(APP_CONFIG) private config: IAppConfig) {
    this.headers.append('Access-Control-Allow-Origin', 'true');
  }

  getProducts(category: string, limit: any = null): Promise<ProductResponse[]> {
    const parameters = new URLSearchParams();
    parameters.set('category', category);
    parameters.set('limit', limit);
    return this.http.get(this.config.apiEndpoint + 'products.php', {search: parameters})
        .toPromise()
        .then(response => {
          return response.json().data as ProductResponse[];
        })
        .catch(this.handleError);
  }

  getProduct(category: string, code: string): Observable<ProductResponse> {
    const parameters = new URLSearchParams();
    parameters.set('category', category);
    parameters.set('code', code);
    return this.http.get(this.config.apiEndpoint + 'product.php', {search: parameters})
        .map((response: Response) => <ProductResponse>response.json().data)
        .catch(this.handleError);
  }

  getProductMaterial(type: any): Observable<ProductMaterialResponse[]> {
    const parameters = new URLSearchParams();
    parameters.set('product_type', type);
    return this.http.get(this.config.apiEndpoint + 'material.php', {search: parameters})
        .map((response: Response) => <ProductMaterialResponse>response.json().data)
        .catch(this.handleNewError);
  }

  getProductColor(type: any): Observable<ProductColorResponse[]> {
    const parameters = new URLSearchParams();
    parameters.set('product_type', type);
    return this.http.get(this.config.apiEndpoint + 'color.php', {search: parameters})
        .map((response: Response) => <ProductColorResponse>response.json().data)
        .catch(this.handleNewError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private handleNewError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
