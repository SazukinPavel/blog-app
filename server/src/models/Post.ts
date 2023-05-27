import {model, Schema, Types} from 'mongoose';
import {IUser} from "./User";

export interface INote {
    template: string;
    owner: IUser;
    createdAt: Date
}

const noteSchema = new Schema<INote>({
    template: {type: String, required: true},
    owner: {type: Types.ObjectId, ref: "User"}
}, {timestamps: true});
export default model<INote>('Note', noteSchema);