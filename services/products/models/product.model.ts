import { Model, Table, Column, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({
    tableName: 'products',
})
export default class Product extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUIDV4)
    id: any;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.NUMBER)
    quantity: number;

    @Column(DataType.NUMBER)
    price: number;

    @Column(DataType.TEXT)
    description: string;
}
