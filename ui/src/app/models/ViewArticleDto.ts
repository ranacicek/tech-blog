import { Article } from "./Article";
import UserDto from "./UserDto";

export default interface ViewArticleDto {
    user: UserDto;
    article: Article;
}