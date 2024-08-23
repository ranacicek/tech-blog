import { makeAutoObservable, runInAction } from "mobx";
import { RegisterUserModel } from "../models/RegisterUserModel";
import LoginRequestDto from "../models/LoginRequestDto";
import ApiClient from "../api/ApiClient";
import { router } from "../router/router";
import UpdateUserRequest from "../models/UpdateUserRequest";
import { showError } from "../../components/utils/Toast";

export class AccountStore {   
   
    authToken : string | null = localStorage.getItem("auth-token");
    isLoggedin = this.authToken != null;

    constructor() {
        makeAutoObservable(this);
    }    
    
    login = async (email: string, password:string) => {

        const loginRequest : LoginRequestDto = {
            email: email,
            password: password
        }

        try{
            const loginResponse = await ApiClient.accountApi.login(loginRequest);
            runInAction(()=> {
                console.log(loginResponse);

                this.setToken(loginResponse.authToken);

                router.navigate("/");
            });  
        }
        catch(error) {
            showError("Login failed", "Invalid user name or password");
        }          
    }

    logout = () => {
        this.setToken(null);
        
        router.navigate("/");
     }

    register = async (registerModel: RegisterUserModel)=> {
        const registerResponse = await ApiClient.accountApi.register(registerModel);

        runInAction(()=> {
            console.log(registerResponse);

            this.setToken(registerResponse.authToken);            
        });    

        router.navigate("/");
    }

    getUserProfile = async ()=> {
        const user = await ApiClient.accountApi.userProfile();

        return user;
    }

    getAuthorProfile = async (id: string)=> {
        const user = await ApiClient.accountApi.authorProfile(id);

        return user;
    }

    updateUserProfile = async (requst: UpdateUserRequest)=> {
        const response = await ApiClient.accountApi.updateUserProfile(requst);

        return response;
    }

    setToken = (token: string | null) => {
        this.authToken = token;

        if(this.authToken) {
            localStorage.setItem("auth-token", token!);
            this.isLoggedin = true;  
        }
        else {
            this.isLoggedin=false;
            localStorage.removeItem("auth-token");            
        }
    }
}