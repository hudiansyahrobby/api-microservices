import {
  Model,
  Table,
  Column,
  DataType,
  Default,
  PrimaryKey,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";

@Table({
  tableName: "categories",
})
export default class Category extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  id: any;

  @Column(DataType.STRING)
  name: string;

  @BeforeCreate
  @BeforeUpdate
  static makeLowerCase(instance: Category) {
    // this will be called when an instance is created or updated
    instance.name = instance.name.toLowerCase();
  }
}
