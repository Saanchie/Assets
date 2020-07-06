export class Asset {
    private id: number;
    private assetName: string;
    private price: number;
    private lastUpdate: number;
    private type: string;

    constructor(id, assetName, price, lastUpdate, type) {
        this.id = id || -1;
        this.assetName = assetName || '';
        this.price = price || -1;
        this.lastUpdate = lastUpdate || '' ;
        this.type = type || '';
    }

    public getId() {
        return this.id;
    }

    public getAssetName() {
      return this.assetName;
    }

    public getType() {
      return this.type;
    }

    public getPrice() {
        return this.price;
    }

    public setPrice(price) {
        this.price = price;
    }

    public getLastUpdate() {
        return this.lastUpdate;
    }

    public setLastUpdate(lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

}
