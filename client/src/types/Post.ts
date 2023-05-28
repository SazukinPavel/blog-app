import User from "./User";

export default interface Post {
    template: string
    _id: string
    owner: User
    createdAt: Date
}