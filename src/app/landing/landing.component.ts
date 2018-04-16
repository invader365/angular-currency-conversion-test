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
  public result:number = 0;
  public isLoading:boolean = true;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: Http,
  ){}

  ngOnInit() {
    this.getConfig();
    this.createForm();
    this.updateForm();
    setInterval(this.updateForm(), 60*100);
  }

  createForm() {
    this.form = this.formBuilder.group({
        input: ['1', Validators.maxLength(4)],
        output: [{value:'1', disabled:true}]
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
    console.log(this.form.get('input'));
  }

  formatNumbers(number) {
    if (number != "") {
      let str = number.toString().split('.');

        str[0] = str[0]
          .replace(/[^0-9\.]+/g, '')
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        if (str[1] && str[1].lenght > 3) str[1] = str[1].slice(0, 4);

        return str.join('.');
    } else {
        return '';
    }
  }

  limitCharacters(event, value) {
      event = (event) ? event : window.event;
      let charCode = (event.which) ? event.which : event.keyCode;
      let number = value.split('.');

      if (charCode > 31 && (charCode < 46 || charCode > 57)) event.preventDefault();
      if (number.length > 1 && charCode == 46) event.preventDefault();
      // if (number[1] && number[1].length > 3) return false;
  }

}
