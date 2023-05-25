import {IsNotEmpty, IsString} from "class-validator";

export class LoginDto {
    constructor({login, password}: { login: string, password: string }) {
        this.login = login
        this.password = password
    }

    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
