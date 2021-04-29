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
    firstName: string;

    @Column(DataType.STRING)
    lastName: string;

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
        // console.log(instance);
        // this will be called when an instance is created or updated
        instance.firstName = instance.firstName.toLowerCase();
        instance.lastName = instance.lastName.toLowerCase();
        instance.job = instance.job.toLowerCase();
    }
}
