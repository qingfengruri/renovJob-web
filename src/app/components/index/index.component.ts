import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { HttpCommonService } from 'src/app/services/http-common.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  constructor(
    private http: HttpCommonService
  ) {
    // 测试调用接口
    // this.http.get('/getUserInfo').subscribe(data => {
    //   console.log(data);
    // });
  }

  ngOnInit() {
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;
  }

}
