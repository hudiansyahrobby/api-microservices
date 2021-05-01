import { Model, Table, Column, DataType, Default, PrimaryKey, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

@Table({
    tableName: 'userprofile',
})
export default class Profile extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUIDV4)
    id: any;

    @Column(DataType.STRING)
    uid: string;

    @Column(DataType.STRING)
    address: string;

    @Column(DataType.TEXT)
    about: string;

    @Column(DataType.STRING)
    job: string;

    @Column(DataType.DATE)
    birthday: string;

    @BeforeCreate
    @BeforeUpdate
    static makeLowerCase(instance: Profile) {
        instance.job = instance.job.toLowerCase();
    }
}
