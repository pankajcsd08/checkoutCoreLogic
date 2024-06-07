  interface PricingRule {
    sku: string;
    apply(quantity: number,price: number): number;
  }
  
  class Checkout {
    private pricingRules: PricingRule[];
    private allItems : Map<string, number>;
    private priceList : Map<string, number>;
  
    constructor(pricingRules: PricingRule[]) {
      this.pricingRules = pricingRules;
      this.allItems = new Map<string, number>();
        this.priceList = priceList;
    }
  
    // Method to scan items or add items on cart
    scan(item : string): void{
        if(!this.priceList.get(item)){
            console.log(`price is not set on price list please set that or item ${item} will be skipped from cart List !!`)
        }else{
            let count = this.allItems.get(item) || 0;
            this.allItems.set(item, count + 1);
        } 
    }
  
    // Method to clear allItems
    clearAllItems() {
       this.allItems.clear();
    }

    // Method to total Bills
    total(): number {

        let total : number = 0;

        for (let [item, value] of this.allItems){
          total += item ? ((this.priceList.get(item) ?? 0) * value) : 0 * value;             
        }

      // Apply pricing rules after scanning is complete
      for (const rule of this.pricingRules) {
        const quantity : number | undefined = this.allItems.get(rule.sku)
        const price : number | undefined = this.priceList.get(rule.sku)
        total -= quantity && price ? rule.apply(quantity,price) : 0;
      }

      return total;
    }
  }
  
  // Define Pricing Rules
  class AppleTVBulkDiscount implements PricingRule {
    sku = "atv";
  
    apply(quantity: number,price: number): number {
        return Math.floor(quantity / 3) * price;
    }
  }
  
  class SuperiPadBulkDiscount implements PricingRule {
    sku = "ipd";
  
    apply(quantity: number,price: number): number {
        return quantity > 4 ? (quantity * price) - (quantity * 499.99) : 0;
    }
}

// Define Pricing List of items

let priceList = new Map<string, number>();
priceList.set("ipd", 549.99);
priceList.set("mbp", 1399.99);
priceList.set("atv", 109.50);
priceList.set("vga", 30.00);


  // Example Usage
  const pricingRules: PricingRule[] = [new AppleTVBulkDiscount(), new SuperiPadBulkDiscount()];
  const co = new Checkout(pricingRules);
  
  co.scan("atv");
  co.scan("atv");
  co.scan("atv");
  co.scan("vga"); // Can scan in any order
  
  const total = co.total();
  console.log(`Total: $${total.toFixed(2)}`); // Output: Total: $249.00

  // Another example with Super iPad discount
  co.clearAllItems(); // Reset items for new scenario
  co.scan("atv");
  co.scan("ipd");
  co.scan("ipd");
  co.scan("atv");
  co.scan("ipd");
  co.scan("ipd");
  co.scan("ipd");
  
  const total2 = co.total();
  console.log(`Total: $${total2.toFixed(2)}`); // Output: Total: $2718.95  

