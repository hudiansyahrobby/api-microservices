import {
    Model,
    Table,
    Column,
    DataType,
    Default,
    PrimaryKey,
    BeforeCreate,
    BeforeUpdate,
    AllowNull,
} from 'sequelize-typescript';

@Table({
    tableName: 'users',
})
export default class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUIDV4)
    id: any;

    @Column(DataType.STRING)
    uid: string;

    @Column(DataType.STRING)
    displayName: string;

    @AllowNull
    @Column(DataType.STRING)
    username: string;

    @AllowNull
    @Column(DataType.STRING)
    email: string;

    @AllowNull
    @Column(DataType.STRING)
    facebookId: string;

    @BeforeCreate
    @BeforeUpdate
    static makeLowerCase(instance: User) {
        // this will be called when an instance is created or updated
        instance.displayName = instance.displayName.toLowerCase();
    }
}
