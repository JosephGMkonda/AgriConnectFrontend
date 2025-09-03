import supabase from '../lib/supabase'
import type { LoginData } from '../types/auth'
import type { RegisterData } from '../types/auth'
import type { User } from '../types/auth'
import {api} from './api'


export class AuthService {
    static async register(userData: RegisterData): Promise<User>{
        const {data: authData, error: authError} = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password
        })

        if(authError){
            throw new Error(authError.message)
        }

        if(!authData) {
            throw new Error("User registration failed")
        }

        const {data: djangoUser} = await api.post('/users/create', {
            supabase_uid: authData.user.id,
            username: userData.username,
            email: userData.email
        })

        if(djangoUser.error) {
            throw new Error(djangoUser.error.message)
        }

        return djangoUser.data
    }

    static async login(credentials: LoginData): Promise<{user: User, token: string}>{
        const { data: authData, error: authError} = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        })

        if(authError){
            throw new Error(authError.message)
        }

        if(!authData.session) {
            throw new Error("User login failed")
        }

        localStorage.setItem("token", authData.session.access_token)

        const {data: user} = await api.get('/users/me')

        return { user, token: authData.session.access_token }
    }

    static async getCurrentUser(): Promise<User>{
        const {data: user} = await api.get('/users/me')
        return user
    }

    static async logout(): Promise<void>{
        localStorage.removeItem("token")
        await supabase.auth.signOut()
    }

    static async getSession(){
        const {data: session} = await supabase.auth.getSession()
        return session
    }
}


