import {model, Schema} from 'mongoose';

export interface IUser {
    login: string;
    _id: string
    password?: string;
}

const userSchema = new Schema<IUser>({
    login: {type: String, required: true},
    password: {type: String, required: true, select: false},
});
export default model<IUser>('User', userSchema);