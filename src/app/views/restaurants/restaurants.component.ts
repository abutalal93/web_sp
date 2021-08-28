import { Component, OnInit } from '@angular/core';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'restaurants.component.html',
  animations: [fadeInOutTranslate]
})
export class RestaurantsComponent implements OnInit {


  restaurantsList = [];

  page = 0;
  activePage = 1;
  pages = [];
  pageSize = 10;
  fromNext = false;
  
  showTable = true;

  ariaList = [];
  cityList = [];
  districtList = [];

  rest: FormGroup;


  async ngOnInit() {
    this.loadForm();
    await this.findRestaurants();
    
  
  }

  constructor(private httpService: HttpService, private notifyService: NotifyService) {
    this.findAria();
  }


  loadForm() {
    this.rest = new FormGroup({
      commercialRegister: new FormControl(''),
      brandNameEn: new FormControl(''),
      brandNameAr: new FormControl(''),
      taxNumber: new FormControl(''),
      logo: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      mobileNumber: new FormControl(''),
      regionId: new FormControl(''),
      cityId: new FormControl(''),
      districtId: new FormControl(''),
      longitude: new FormControl(''),
      latitude: new FormControl(''),
      streetName: new FormControl(''),
      buildingNumber: new FormControl(''),
      address: new FormControl(''),
      contract: new FormControl(''),
      restaurantType: new FormControl(''),
      serviceType: new FormControl(''),
      authorizedFirstName: new FormControl(''),
      authorizedSecondName: new FormControl('',),
      authorizedThirdName: new FormControl('',),
      authorizedLastName: new FormControl('',),
      authorizedMobileNumber: new FormControl('',),
      authorizedEmail: new FormControl('')
    });
  }

  async findRestaurants() {

    if (!this.fromNext) {
      this.activePage = 1;
    }

    let request = {
      method: "GET",
      path: "sp/rest/search",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.restaurantsList = response.data.pageList;
      let numberOfPages = response.data.numberOfPages;
      this.fillPageArray(numberOfPages);
    } else {
      this.fillPageArray(1);
      this.restaurantsList = [];
    }

    this.fromNext = false;
  }

  fillPageArray(numberOfPages) {
    this.pages = [];
    for (var index = 0; index < numberOfPages; index++) {
      this.pages.push({ pageName: index + 1, pageNumber: index });
    }
    console.log("pages", this.pages);
  }

  async onSelect(page) {
    this.activePage = page.pageName;
    this.fromNext = true;
    await this.findRestaurants();
    console.log("+this.activePage+", this.activePage);
  }


  editItem(Item){

    this.showTable=!this.showTable;

  }

  deleteItem(Item){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete Restaurant!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "DELETE",
            path: "sp/rest/delete?restId="+Item.id,
            body: null
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Deleted!',
              'Your Item has been deleted.',
              'success'
            )
            await this.findRestaurants();
    
          }else{
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Item is safe :)',
          'error'
        )
      }
    });
  }

  activeOrInactive(Item){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change Item status!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return new Promise(async (resolve) => {
          let request = {
            method: "PUT",
            path: "sp/rest/activeInactive?restId="+Item.id,
            body: null
          };
    
          let response = await this.httpService.httpRequest(request);
          console.log(response);
          if(response.status == 200){
    
            Swal.fire(
              'Changed!',
              'Your Item has been changed.',
              'success'
            )
            await this.findRestaurants();
    
          }else{
            Swal.fire(
              'Error!',
              'Error ocurred please try again.',
              'error'
            )
          }

        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Item is safe :)',
          'error'
        )
      }
    });
  }


  async findAria() {

    let request = {
      method: "GET",
      path: "lookups/findAll?category=RIG&parentId=",
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.ariaList = response.data;
      this.findCity(response.data[0].id)
    } else {
      this.ariaList = []
    }
  }


  async findCity(ariaId) {

    let request = {
      method: "GET",
      path: "lookups/findAll?category=CIT&parentId="+ariaId,
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.cityList = response.data;
    } else {
      this.cityList = []
    }
  }

  async findDistrict(cityId) {

    let request = {
      method: "GET",
      path: "lookups/findAll?category=DIST&parentId="+cityId,
      body: null
    };

    let response = await this.httpService.httpRequest(request);
    console.log(response);
    if (response.status == 200) {
      this.cityList = response.data;
    } else {
      this.cityList = []
    }
  }


  async uploadAttachment(file,controleName){
    console.log('fileL: ',file);

    let formData = new FormData(); 

    formData.append("file",file[0]);

    let request = {
      method: "POST",
      path: "file/upload",
      body: formData
    };

    let response = await this.httpService.httpRequest(request);
    if (response.status == 200) {
      this.rest.get(controleName).setValue(response.data.url)
    }
    console.log(response)
  }


  async save(){
    this.httpService.markFormGroupTouched(this.rest);

    console.log(this.rest.valid);

    if (this.rest.valid) {

      let request = {
        method: "POST",
        path: "sp/rest/create",
        body: this.rest.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
      
        this.showTable=!this.showTable;

        this.rest.reset();

        await this.findRestaurants();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }



  // async uploadAttachment(controlName, fileName, file) {
  //   this.loading = true;
  //   if (file == undefined || file == null) {
  //     this.loading = false;
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   this.httpClient
  //     .post<any>(`${environment.apiUrl}/uploadFile`, formData)
  //     .subscribe(
  //       (data) => {
  //         console.log("data>>>>>>>>>>", data);
  //         this.loading = false;
  //         if (fileName == "fileName") {
  //           this.fileName = data.body;
  //         } else if (fileName == "fileName2") {
  //           this.fileName2 = data.body;
  //         } else if (fileName == "fileName3") {
  //           this.fileName3 = data.body;
  //         }

  //         this.form.get(controlName).setValue(data.body);
  //       },
  //       async (error) => {
  //         this.loading = false;
  //         if (error.status == 401) {
  //           this.authService.logoutUser();
  //         } else if (error.status == 500) {
  //           this.loading = false;

  //           this.toaster.showError(
  //             await this.findAllLanguagesService.getTranslate("tech_issue")
  //           );
  //         } else {
  //           let response: any = error.error;
  //           let errorMsg = response.msgWithLanguage;
  //           this.toaster.showError(errorMsg);
  //         }
  //       }
  //     );
  // }
}
