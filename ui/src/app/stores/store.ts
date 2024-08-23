import { AccountStore } from "./AccountStore";
import { ArticleStore } from "./ArticleStore";

interface AppStore {
    accountStore: AccountStore;
    articleStore: ArticleStore;
}

export const store : AppStore = {
    accountStore: new AccountStore(),
    articleStore: new ArticleStore()
}

