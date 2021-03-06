import {Component, OnInit} from '@angular/core';
import {EBayService} from '../../services/eBayApi/eBayApi.service';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import {CategoryType, Item, Properties} from './eBay.model';
import {until} from 'selenium-webdriver';
import elementIsNotSelected = until.elementIsNotSelected;

@Component({
  selector: 'my-eBay',
  templateUrl: './eBay.component.html',
  styleUrls: ['./eBay.component.scss'],
  providers: [EBayService]
})

export class EBayComponent implements OnInit {
  query: string;
  categoryList: CategoryType[];
  selectedCategories: CategoryType[];
  itemList: Item[];
  properties: Properties[];
  selectedProperties: {};
  pageCounter: number;
  someData: boolean;
  nothingElse: boolean;

  constructor(private ebayService: EBayService) {
    this.selectedCategories = [];
    this.properties = [];
    this.selectedProperties = {};
    this.pageCounter = 1;
    this.someData = false;
    this.nothingElse = false;
  }

  private searchTermStream = new Subject<string>();

  ngOnInit() {
    this.ebayService.getMainCategories()
      .subscribe(data => this.categoryList = data.map(elem => CategoryType.copy(elem)),
        error2 => console.log("Zly request"));
  }

  submit() {
    this.nothingElse = false;
    this.pageCounter = 1;
    this.getData();

  }

  nextPage() {
    this.pageCounter = this.pageCounter + 1;
    this.getData();
  }

  previousPage() {
    this.pageCounter = this.pageCounter - 1;
    this.getData();
  }

  getData() {
    if (this.selectedCategories.length !== 0) {
      if (this.query !== '') {
        this.ebayService.getItemsByKeyWordAndCategory(this.query, this.selectedCategories[this.selectedCategories.length - 1].categoryID, this.pageCounter)
          .subscribe(data => {
              if (!data) {
                if (this.pageCounter === 1) {
                  this.someData = false;
                  this.itemList = [];
                  this.query = "";
                } else {
                  console.log('nothing else');
                  this.pageCounter = this.pageCounter - 1;
                  this.nothingElse = true;
                }
              } else {
                this.someData = true;
                this.itemList = [];
                this.itemList = data
              }
            },
            error2 => console.log('ERROR'));
      }
      else {
        console.log('WRONG QUERY PARAMETERS');
      }
    }
    else {
      if (this.query !== '') {
        this.ebayService.getItemsByKeyWord(this.query, this.pageCounter)
          .subscribe(data => {
              if (!data) {
                if (this.pageCounter === 1) {
                  this.someData = false;
                  this.itemList = [];
                  this.query = "";
                } else {
                  this.pageCounter = this.pageCounter - 1;
                  this.nothingElse = true;
                }
              } else {
                this.someData = true;
                this.itemList = [];
                this.itemList = data
              }
            },
            error2 => console.log('ERROR'));
      }
      else {
        console.log('WRONG QUERY PARAMETERS');
      }
    }
  }

  addProperties = (type, value) => {
    this.selectedProperties[type] = value;
  };

  chooseMainCategory = (categoryName: string) => {

    const newSelected = this.categoryList.find(category => category.categoryName === categoryName);

    this.selectedCategories = [];
    this.selectedCategories.push(newSelected);

    this.ebayService.getSbsCategoriesByParentId(newSelected.categoryID)
      .subscribe(data => this.selectedCategories[this.selectedCategories.length - 1].childrenCategories = data.map(elem => CategoryType.copy(elem)),
        error2 => console.log("Zly request"),
        () => {
        });

    this.ebayService.getSpecificsCategoriesById(newSelected.categoryID)
      .subscribe(data => {
          let item: Properties;
          this.properties = [];
          for (let type in data) {
            item = new Properties();
            item.type = type;
            item.value = data[type];
            this.properties.push(item);
          }
        },
        error2 => console.log("Zly request"),
        () => {
        });
  };

  chooseCategory = (categoryName: string) => {
    //TODO Refactor shity kod ale w przy takim czasie odopowiedzzi z serwera nie ma sensu przyspieszyc
    let newSelected;

    if (this.selectedCategories.length > 0) {
      newSelected = this.selectedCategories.find(category =>
      category.childrenCategories.find(categoryChild => categoryChild.categoryName === categoryName) !== null)
        .childrenCategories.find(category => category.categoryName === categoryName);
    } else {
      newSelected = this.categoryList.find(category => category.categoryName === categoryName);
    }

    if (newSelected) {
      const tmp = this.selectedCategories.find(cat => {
        return cat.categoryID === newSelected.categoryParentID[0];
      });

      this.selectedCategories = this.selectedCategories.slice(
        0, this.selectedCategories.indexOf(tmp) + 1);

      this.selectedCategories.push(newSelected);

      this.ebayService.getSbsCategoriesByParentId(newSelected.categoryID)
        .subscribe(data => this.selectedCategories[this.selectedCategories.length - 1].childrenCategories =
            data.map(elem => CategoryType.copy(elem)).filter(cat => cat.categoryID !== newSelected.categoryID),
          error2 => console.log("Zly request"),
          () => {
            console.log(this.selectedCategories)
          });


      this.ebayService.getSpecificsCategoriesById(newSelected.categoryID)
        .subscribe(data => {
            let item: Properties;
            this.properties = [];
            for (let type in data) {
              item = new Properties();
              item.type = type;
              item.value = data[type];
              console.log(item);
              this.properties.push(item);
            }
            console.log(this.properties)
          },
          error2 => console.log("Zly request"),
          () => {
            console.log(this.selectedCategories)
          });
    }
  }

}
