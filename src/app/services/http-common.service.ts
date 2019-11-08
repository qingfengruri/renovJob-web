import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {CookieService} from 'ngx-cookie-service';
import * as c from 'crypto-js';


@Injectable()
export class HttpCommonService {

  // 请求头
  private headers: HttpHeaders;
  // 本地
  private baseUrl = '';  // URL to web api
  private timeCode = '&t=' + new Date().getTime();  // 时间戳
  private d = c.enc.Latin1.parse('x89j30k23k5s2lln');

  constructor(private http: HttpClient, public cookieService: CookieService) {
    // 请求头配置
    /*this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json;charset=UTF-8');*/

    // 解决ie缓存页面不刷新问题
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json;charset=UTF-8')
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');
  }

  public getBaseUrl(): any {
    return this.baseUrl;
  }

  /**
   * get请求
   * @param {string} url 请求地址
   * @param params 传递的参数
   * @returns {any}
   */
  get(url: string, params?: any): any {
    this.setHeaders();
    if (params) {
      params = this.encodeParams(params);
    }
    return this.http.get(this.getBaseUrl() + url, {headers: this.headers, params: params});
  }

  /**
   * post请求
   * @param {string} url
   * @param body
   * @returns {any}
   */
  post(url: string, body, type?: string): any {
    this.setHeaders();
    body = JSON.stringify(body);
    if ('1' === type) {
      body = this.a(body);
    }
    return this.http.post(this.getBaseUrl() + url, body, {headers: this.headers});
  }

  /**
   * put请求
   * @param {string} url
   * @param body
   * @returns {any}
   */
  put(url: string, body): any {
    this.setHeaders();
    body = JSON.stringify(body);
    return this.http.put(this.getBaseUrl() + url, body, {headers: this.headers});
  }

  /**
   * delete请求
   * @param {string} url
   * @param {string} id
   * @returns {Observable<Object>}
   */
  delete(url: string, id: string) {
    this.setHeaders();
    // 如果后端用/:id方式传参则用此行代码
    // return this.http.delete(url + "/" + id, {headers: this.headers});
    const idParam = new HttpParams().set('id', id);
    return this.http.delete(this.getBaseUrl() + url, {params: idParam, headers: this.headers});
  }

  /**
   * 该方法用于导出数据的使用
   * @param params
   */
  locationUrl(url, params?: any) {
    /*this.setHeaders();
    let str = '';
    Object.keys(params).forEach(key => {
      str += key + '=' + params[key] + '&';
    });
    str = str.substring(0, str.length - 1);
    location.href= url + "?" + str;*/
    // this.setHeaders();

    params = JSON.stringify(params);
    return this.http.post(this.getBaseUrl() + url, params, {headers: this.headers, responseType: 'arraybuffer'});
  }

  /**
   * 该方法用于导出数据的使用
   * @param? params
   */
  locationUrlGet(url, params?: any) {
    // this.setHeaders();
    if (params) {
      params = this.encodeParams(params);
    }
    return this.http.get(this.getBaseUrl() + url, {
      headers: this.headers, params: params,
      responseType: 'arraybuffer'
    });
  }

  /**
   * 该方法用于导出数据的使用
   * @param? params
   */
  locationUrlGet2(url, params?: any) {
    this.setHeaders();
    if (params) {
      params = this.encodeParams(params);
    }
    window.open(this.getBaseUrl() + url + '?' + params, '_self');
  }

  getImageUrl(path: string): any {
    // return this.getBaseUrl() + "/enterprise/detail/common/file/viewImage?path=" +path
    // 更改图片、视频访问方式，不经过后台接口，直接通过代理服务器访问资源即可，提高访问速度
    return path;
  }

  /**
   * 将对象类型的参数转换成HttpParams类型
   * @param params
   * @returns {HttpParams}
   */
  encodeParams(params: any): HttpParams {
    let str = '';
    Object.keys(params).forEach(key => {
      str += key + '=' + params[key] + '&';
    });
    return new HttpParams({fromString: str.substring(0, str.length - 1)});
  }

  /**
   * 将cookie中的token设置在header请求头里，token每1小时变更一次，所以需要每次请求都去cookie中取一下
   */
  setHeaders() {
    const userType = JSON.parse(localStorage.getItem('_user')) ? JSON.parse(localStorage.getItem('_user'))['_userType'] : '';
    this.headers = this.headers.set('User-Type', userType ? userType : 'tourist').set('Set-Cookie', 'auth-token=' +
      this.cookieService.get('auth-token'));
  }

  a(e) {
    const g = c.enc.Utf8.parse(e);
    const f = c.AES.encrypt(g, this.d, {
      mode: c.mode.ECB,
      padding: c.pad.Pkcs7
    });
    return f.toString();
  }

  b(e) {
    const g = c.AES.decrypt(e, this.d, {
      mode: c.mode.ECB,
      padding: c.pad.Pkcs7
    });
    const f = JSON.parse(c.enc.Utf8.stringify(g).toString());
    return f;
  }

}
