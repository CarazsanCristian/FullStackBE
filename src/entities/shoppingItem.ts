import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShoppingItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  itemId!: number;

  @Column("varchar", { length: 50 })
  productName!: string;

  @Column("varchar", { length: 60 })
  category!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "int" })
  price!: number;

  // static createItem(
  //   productName: string,
  //   category: string,
  //   quantity: number,
  //   price: number
  // ) {
  //   return this.create({
  //     productName,
  //     category,
  //     quantity,
  //     price,
  //   }).save();
  // }

  static getShoppingItems() {
    return this.find();
  }
}
