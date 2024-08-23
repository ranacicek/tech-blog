import PagedArticleList from "./PagedArticleList";
import UserDto from "./UserDto";

export default interface AuthorArticlesDto {
    user: UserDto;
    articles: PagedArticleList;
}