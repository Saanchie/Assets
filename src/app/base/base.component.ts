import { Component } from '@angular/core';
import { Asset } from './../../models/assets';
import { BaseService } from './../../services/service';

@Component({
  selector: 'base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {
  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.baseService.ngOnInit();
  }

  public createAssets(num): Array<Asset> {
    return this.baseService.createAssets(num);
  }

  public updateAssets(assets: Array<Asset>): Array<Asset> {
    return this.baseService.updateAssets(assets);
  }

  public createStockAsset(i): Asset {
    return this.baseService.createStockAsset(i);
  }

  public createCurrencyAsset(i): Asset {
    return this.baseService.createCurrencyAsset(i);
  }

  public getAssetName(type): String {
    return this.baseService.getAssetName(type);
  }

  public getPrice(): number {
    return this.baseService.getPrice();
  }

  public createFilterFormControls() {
    this.baseService.createFilterFormControls();
  }

  public isFavoriteAsset(asset) {
    this.baseService.isFavoriteAsset(asset);
  }

  public isNotFavoriteAsset(asset) {
    this.baseService.isNotFavoriteAsset(asset);
  }

  public addToFavorites(index) {
    this.baseService.addToFavorites(index);
  }

  public removeFromFavorites(index) {
    this.baseService.removeFromFavorites(index);
  }

  public filterAssets() {
    this.baseService.filterAssets();
  }

  public resetFormControl(formControlName: string) {
    this.baseService.resetFormControl(formControlName);
  }

  public filterLastUpdate() {
    this.baseService.filterLastUpdate();
  }
  
}
