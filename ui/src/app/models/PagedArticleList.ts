import { ArticleSearchItem } from "./ArticleSearchItem";

export default interface PagedArticleList {
    pageNo: number;
    totalPages: number;
    items: ArticleSearchItem[];
}