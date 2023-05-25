import {Request, Response, Router} from "express";
import {validate} from "class-validator";
import {LoginDto} from "../dto/auth/LoginDto";
import User, {IUser} from "../models/User";
import CryptoService from "../services/CryptoService";
import {AuthResponseDto} from "../dto/auth/AuthResponseDto";
import ErorrDto from "../dto/error/ErorrDto";
import JwtService from "../services/JwtService";
import {RegisterDto} from "../dto/auth/RegisterDto";
import * as crypto from "crypto";

class AuthService {

    private static getAuthResponse(user: IUser): AuthResponseDto {
        return {token: JwtService.sign(user), user: {...user, password: undefined}}
    }

    private static async checkIsLoginFree(login: string) {
        const userWithSameLogin = await User.findOne({login})

        if (userWithSameLogin) {
            return false
        }

        return true
    }


    static async register(request: Request<{}, {}, RegisterDto>, response: Response<AuthResponseDto | ErorrDto>) {
        const {body} = request
        const dto = new RegisterDto(body)
        const errors = await validate(dto);
        if (errors.length > 0) {
            return response.status(400).send({message: 'Тело запроса не прошло валидацию'})
        }

        if (!await this.checkIsLoginFree(dto.login)) {
            return response.status(400).send({message: 'Пользователь с таким логином уже существует'})
        }

        const password = await CryptoService.hash(dto.password)
        const user = new User({...dto, password})
        await user.save()

        const auth = this.getAuthResponse(user.toJSON())

        response.status(201).send(auth)
    }

    static async login(request: Request<{}, {}, LoginDto>, response: Response<AuthResponseDto | ErorrDto>) {
        const {body} = request
        const dto = new LoginDto(body)
        const errors = await validate(dto);
        if (errors.length > 0) {
            return response.status(400).send({message: 'Тело запроса не прошло валидацию'})
        }

        const user = await User.findOne({login:dto.login},).select('+password')

        if(!user){
            return response.status(502).send({message: 'Пользоваеля с таким логином не существует'})
        }
        const isPasswordCorrect=await CryptoService.compare(user.password as string,dto.password)

        if(!isPasswordCorrect){
            return response.status(502).send({message: 'Неверный пароль'})
        }

        const auth = this.getAuthResponse(user.toJSON())

        response.status(201).send(auth)
    }

    private static async getUserById(id:string){
        return User.findOne({_id:id})
    }

    static async me(request: Request, response: Response){
       try{
           const token=request.header('authorization')?.replace('Bearer ','')
           const id=JwtService.verify(token || "").id

           const user=await this.getUserById(id)

           if(!user){
               return response.status(502).send({message: 'Такого пользователя не существует'})
           }

           const auth = this.getAuthResponse(user.toJSON())
           response.status(201).send(auth)
       }catch(e){
           console.log(e)
           return response.status(502).send({message: 'Произошла ошибка во время авторизации'})
       }
    }
}

const authRouter = Router();

authRouter.post('/login/', (req, res) => AuthService.login(req, res))
authRouter.post('/register/', (req, res) => AuthService.register(req, res))
authRouter.post('/me/', (req, res) => AuthService.me(req, res))

export default authRouter