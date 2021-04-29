import { Model, Table, Column, DataType, Default, PrimaryKey } from 'sequelize-typescript';

@Table({
    tableName: 'images',
    timestamps: false,
})
export default class Image extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUIDV4)
    id: any;

    @Column(DataType.STRING(20))
    imageId: string;

    @Column(DataType.STRING(100))
    imageUrl: string;

    @Column(DataType.UUIDV4)
    productId: any;
}
