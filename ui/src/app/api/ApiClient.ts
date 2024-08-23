import axios, { AxiosResponse } from "axios";
import LoginRequestDto from "../models/LoginRequestDto";
import LoginResponseDto from "../models/LoginResponseDto";
import { store } from "../stores/store";
import { AddUpdateArticleRequestDto } from "../models/AddUpdateArticleRequestDto";
import { Article } from "../models/Article";
import { RegisterUserModel } from "../models/RegisterUserModel";
import RegisterResponseDto from "../models/RegisterResponseDto";
import UserDto from "../models/UserDto";
import UpdateUserRequest from "../models/UpdateUserRequest";
import PagedArticleList from "../models/PagedArticleList";
import ViewArticleDto from "../models/ViewArticleDto";
import AuthorArticlesDto from "../models/AuthorArticlesDto";



axios.defaults.baseURL="http://localhost:5142/api";

axios.interceptors.request.use(config => {

    const token = store.accountStore.authToken;

    if(token && config.headers)
        config.headers.Authorization = "Bearer "+ token;

    return config;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const api = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body:{}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const AccountApi = {
    login: (request: LoginRequestDto) => api.post<LoginResponseDto>("/account/login", request),
    register: (request: RegisterUserModel) => api.post<RegisterResponseDto>("/account/register", request),
    userProfile: () => api.get<UserDto>("/account/userprofile"),
    authorProfile: (id: string) => api.get<UserDto>("/account/authorprofile/"+id),
    updateUserProfile: (request: UpdateUserRequest) => api.put<string>("/account/userprofile", request)
}

const ArticleApi = {
    addArticle: (request: AddUpdateArticleRequestDto) => api.post<Article>("/article", request),
    updateArticle: (id: string, request: AddUpdateArticleRequestDto) => api.put<string>("/article/"+id, request),
    deleteArticle: (id: string) => api.del<string>("/article/"+id),
    latestArticles: (pageNo: number) => api.get<PagedArticleList>("/article/latest?pageNo="+pageNo),
    myArticles: (pageNo: number) => api.get<PagedArticleList>("/article/myarticles?pageNo="+pageNo),
    getArticle: (id: string) => api.get<ViewArticleDto>("/article/"+id),
    authorArticles: (id: string, pageNo: number) => api.get<AuthorArticlesDto>("/article/authorarticles/"+id+"?pageNo="+pageNo),
    searchArticles: (searchText: string, pageNo: number) => api.get<PagedArticleList>("/article/search?searchText="+searchText+"&pageNo="+pageNo)
}

const ApiClient = {
    accountApi: AccountApi,
    articleApi: ArticleApi
}

export default ApiClient;