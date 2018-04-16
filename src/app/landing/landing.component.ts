import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Http, Response, Headers, RequestOptions, Jsonp, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [ ]
})
export class LandingComponent implements OnInit {
  public result;
  isLoading: boolean = true;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: Http,
  ){}

  ngOnInit() {
    this.getConfig();
    this.createForm();
    setInterval(this.updateForm, 60*1000);
  }

  createForm() {
    this.form = this.formBuilder.group({
        input: '',
        output: [{value:'', disabled:true}]
    });
  }

  getConfigService(): Observable<any> {
    let url = "https://api.fixer.io/latest?base=USD&symbols=EUR";
    // url = "assets/config.json";
    let headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});

    return this.http.get(url, { headers: headers }).map(data => data);
  }

  getConfig() {
      this.getConfigService()
          .subscribe(result => {
              let response:any = (<Observable<any>> result.json());
              this.result = response['rates']['EUR'];
          }, err => {
              console.log('error');
          }, () => {
              this.isLoading = false
          });
  }

  updateForm() {
    let value = this.form.get('input').value;
    value = value.replace(/[^0-9\.]+/g, '');
    value = value * this.result;

    this.form.patchValue({
      output: Math.round(value * 10000) / 10000
    });
  }

  formatNumbers(number) {
    let str = number.toString().split('.');

    str[0] = str[0]
      .replace(/[^0-9\.]+/g, '')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    return str.join('.');
  }


  limitCharacters(event) {
    event = (event) ? event : window.event;
    let charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 46 || charCode > 57))  event.preventDefault();
  }

}
