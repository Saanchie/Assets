import { Injectable } from '@angular/core';
import { Constants } from './../constants/constants';
import { Asset } from './../models/assets';
import { interval, Subscription, from } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: "root"
})
export class BaseService {
  public assets: Array<Asset> = [];
  public filteredAssets: Array<Asset> = [];
  public favoriteAssets: Array<Asset> = [];
  public assetProperties: Array<String> = [];
  public favoriteAssetIds: Array<Number> = [];
  public subscription: Subscription;
  public filterForm: FormGroup;
  public constants = Constants;
  public displayincorrectValue = false;
  public enableIdFilter = false;
  public enableNameFilter = false;
  public enablePriceFilter = false;
  public enableLastUpdateFilter = false;
  public enableTypeFilter = false;
  public lastUpdateFilterMessage = false;

  ngOnInit() {
    this.assetProperties = Object.keys(Reflect.construct(Asset, []));

    let favoriteAssets = JSON.parse(localStorage.getItem('favoriteAssets'));
    favoriteAssets = favoriteAssets || [];
    this.favoriteAssetIds = favoriteAssets.map(asset => asset.id);
    this.favoriteAssets = favoriteAssets.map(asset => new Asset(asset.id, asset.assetName, asset.price, asset.lastUpdate, asset.type));

    this.filterForm = this.createFilterFormControls();

    this.filteredAssets = this.createAssets(Constants.numberOfAssets);

    this.assets = [...this.favoriteAssets, ...this.filteredAssets];

    this.subscription = interval(Constants.updateInterval).subscribe((val) => {
      this.filteredAssets = this.updateAssets(this.filteredAssets);
      this.favoriteAssets = this.updateAssets(this.favoriteAssets);
    });

    this.setDefault();
  }

  public setDefault(){
    this.displayincorrectValue = false;
    this.enableIdFilter = false;
    this.enableNameFilter = false;
    this.enablePriceFilter = false;
    this.enableLastUpdateFilter = false;
    this.enableTypeFilter = false; 
    this.lastUpdateFilterMessage = false;  
  }

  public createAssets(num): Array<Asset> {
    let assets = [];
    for (let i = 1; i <= num; i++) {
      if (this.favoriteAssetIds.indexOf(i) > -1) {
        continue;
      } else if (i % 2 === 0) {
        assets.push(this.createStockAsset(i));
      } else {
        assets.push(this.createCurrencyAsset(i));
      }
    }
    return assets;
  }

  public createStockAsset(i): Asset {
    return new Asset(i, this.getAssetName(Constants.STOCK), this.getPrice(), Date.now(), Constants.STOCK);
  }

  public createCurrencyAsset(i): Asset {
    return new Asset(i, this.getAssetName(Constants.CURRENCY), this.getPrice(), Date.now(), Constants.CURRENCY);;
  }

  public updateAssets(assets: Array<Asset>): Array<Asset> {
    from(assets).subscribe((asset) => {
      const random = Math.random();
      asset.setPrice(random >= 0.5 ? asset.getPrice() + random : asset.getPrice() - random);
    },
      (error) => console.error('Error in updating assets: ', error)
    );
    return assets;
  }

  public getAssetName(type): String {
    return type === Constants.STOCK ? Constants.stocks[Math.floor(Math.random() * 4)] : Constants.currencies[Math.floor(Math.random() * 4)];
  }

  public getPrice(): number {
    return Math.random() * 10;
  }

  public createFilterFormControls() {
    var formGroupObj = {};
    this.assetProperties.forEach(prop => formGroupObj[prop + "Filter"] = new FormControl)
    return new FormGroup(formGroupObj);
  }

  public isFavoriteAsset(asset) {
    let id = asset.getId();
    return this.favoriteAssets.findIndex(asset => asset.getId() === id) !== -1;
  }

  public isNotFavoriteAsset(asset) {
    let id = asset.getId();
    return this.favoriteAssets.findIndex(asset => asset.getId() === id) === -1;
  }

  public addToFavorites(index) {
    let asset = this.filteredAssets.splice(index, 1);
    asset ? this.favoriteAssets.push(asset[0]) : {};
    this.favoriteAssets = [...this.favoriteAssets];
    this.filteredAssets = [...this.filteredAssets];

    localStorage.setItem('favoriteAssets', JSON.stringify(this.favoriteAssets));
  }

  public removeFromFavorites(index) {
    let asset = this.favoriteAssets.splice(index, 1);
    this.filteredAssets.push(asset[0]);
    this.filteredAssets.sort((a, b) => (a.getId() > b.getId()) ? 1 : -1);
    this.favoriteAssets = [...this.favoriteAssets];
    this.filteredAssets = [...this.filteredAssets];
    
    localStorage.setItem('favoriteAssets', JSON.stringify(this.favoriteAssets));
  }

  public insertAt(array, index, ...element) {
    this.filteredAssets.splice(array, index, ...element);
  }

  public filterAssets() {
    var assets = this.assets.slice();
    this.setDefault();

    if (this.filterForm.value.idFilter < Constants.maxNumberOfAssets && this.filterForm.value.idFilter > Constants.minNumberOfAssets) {
      assets = assets.filter(asset => asset.getId() === this.filterForm.value.idFilter);
      this.displayincorrectValue = false;
      this.enableIdFilter = true;
    }

    else if (this.filterForm.value.idFilter > Constants.maxNumberOfAssets || this.filterForm.value.idFilter < Constants.minNumberOfAssets) {
      assets = assets.filter(asset => asset.getId() === this.filterForm.value.idFilter);
      this.displayincorrectValue = true;
      this.enableIdFilter = false;
    }

    else if (this.filterForm.value.assetNameFilter && this.filterForm.value.assetNameFilter.match('[a-zA-Z]+')) {
      assets = assets.filter(asset => asset.getAssetName().toLowerCase().indexOf(this.filterForm.value.assetNameFilter.toLowerCase()) !== -1);
      this.enableNameFilter = true;
    }

    else if (this.filterForm.value.assetNameFilter && !(this.filterForm.value.assetNameFilter.match('[a-zA-Z]+'))) {
      assets = assets.filter(asset => asset.getAssetName().toLowerCase().indexOf(this.filterForm.value.assetNameFilter.toLowerCase()) !== -1);
      this.displayincorrectValue = true;
      this.enableNameFilter = false;
    }

    else if (this.filterForm.value.priceFilter === Constants.priceRange1 ) {
      assets = assets.filter(asset => (asset.getPrice() < Constants.maxPriceRange1 && asset.getPrice() > Constants.minPriceRange1));
      this.enablePriceFilter = true;
    }

    else if (this.filterForm.value.priceFilter === Constants.priceRange2) {
      assets = assets.filter(asset => (asset.getPrice() < Constants.maxPriceRange2 && asset.getPrice() > Constants.maxPriceRange1));
      this.enablePriceFilter = true;
    }

    else if (this.filterForm.value.priceFilter === Constants.priceRange3) {
      assets = assets.filter(asset => (asset.getPrice() < Constants.maxPriceRange3 && asset.getPrice() > Constants.maxPriceRange2));
      this.enablePriceFilter = true;
    }

    else if (this.filterForm.value.priceFilter === Constants.priceRange4) {
      assets = assets.filter(asset => (asset.getPrice() > Constants.maxPriceRange3));
      this.enablePriceFilter = true;
    }

    else if (this.filterForm.value.typeFilter) {
      assets = assets.filter(asset => asset.getType() === this.filterForm.value.typeFilter);
      this.enableTypeFilter = true;
    }

    else {
      this.displayincorrectValue = false;  
    }

    //this.favoriteAssets = assets.filter(this.isFavoriteAsset.bind(this)); // use this if favorites should not be pinned after using filter
    this.filteredAssets = assets.filter(this.isNotFavoriteAsset.bind(this));
  }

  public resetFormControl(formControlName: string) {
    this.filterForm.get(formControlName).reset();
    this.filterAssets();
  }

  public filterLastUpdate() {
      this.lastUpdateFilterMessage = true;
  }

}
