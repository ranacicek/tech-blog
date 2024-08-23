import { makeAutoObservable } from "mobx";
import ApiClient from "../api/ApiClient";
import { AddUpdateArticleRequestDto } from "../models/AddUpdateArticleRequestDto";
import { router } from "../router/router";

export class ArticleStore {   

    searchText = '';

    constructor() {
        makeAutoObservable(this);
    }  

    setSearchText = (value:string)=>{
        this.searchText=value;

        router.navigate("/search");
    }

    addArticle = async (article: AddUpdateArticleRequestDto) => {
        return await ApiClient.articleApi.addArticle(article);
    }

    updateArticle = async (id: string, article: AddUpdateArticleRequestDto) => {
        return await ApiClient.articleApi.updateArticle(id, article);
    }

    deleteArticle = async (id: string) => {
        await ApiClient.articleApi.deleteArticle(id);
    }

    getLatestArticles = async (pageNo: number) => {
        return await ApiClient.articleApi.latestArticles(pageNo);
    }

    getMyArticles = async (pageNo: number) => {
        return await ApiClient.articleApi.myArticles(pageNo);
    }

    getArticle = async (id: string) => {
        return await ApiClient.articleApi.getArticle(id);
    }

    getAuthorArticles = async (id: string, pageNo: number) => {
        return await ApiClient.articleApi.authorArticles(id, pageNo);
    }

    searchArticles = async (searchText: string, pageNo: number)=> {
        return await ApiClient.articleApi.searchArticles(searchText, pageNo);
    }
}