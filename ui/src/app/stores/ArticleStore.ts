import { makeAutoObservable } from "mobx";
import ApiClient from "../api/ApiClient";
import { AddUpdateArticleRequestDto } from "../models/AddUpdateArticleRequestDto";
import { Article } from "../models/Article";
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
        const savedArticle = await ApiClient.articleApi.addArticle(article);

        console.log(savedArticle);

        return savedArticle;
    }

    updateArticle = async (id: string, article: AddUpdateArticleRequestDto) => {
        const resultMessage = await ApiClient.articleApi.updateArticle(id, article);

        return resultMessage;
    }

    deleteArticle = async (id: string) => {
        const resultMessage = await ApiClient.articleApi.deleteArticle(id);
    }

    getLatestArticles = async (pageNo: number) => {
        const pagedArticles = await ApiClient.articleApi.latestArticles(pageNo);

        return pagedArticles;
    }

    getMyArticles = async (pageNo: number) => {
        const pagedArticles = await ApiClient.articleApi.myArticles(pageNo);

        return pagedArticles;
    }

    getArticle = async (id: string) => {
        const article = await ApiClient.articleApi.getArticle(id);

        return article;
    }

    getAuthorArticles = async (id: string, pageNo: number) => {
        const authorArticles = await ApiClient.articleApi.authorArticles(id, pageNo);

        return authorArticles;
    }

    searchArticles = async (searchText: string, pageNo: number)=> {
        const searchResults = await ApiClient.articleApi.searchArticles(searchText, pageNo);

        return searchResults;
    }
}