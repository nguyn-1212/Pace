import { AppConfig } from "./core/helpers/app.config";

export const setEnvironment = function () {
    let domain = AppConfig.getDomain();
    switch (domain) {
        case 'localhost':
            {
                AppConfig.SchemaWeb = 'http://localhost:8080';
                AppConfig.SchemaApi = 'https://localhost:44310';
                AppConfig.LanguageKey = 'lazy.travel.language';
                AppConfig.AccountTokenKey = 'lazy.travel.account';
                AppConfig.SecretKey = 'HL3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
            } break;
        default: {
            AppConfig.SchemaWeb = 'https://' + domain;
            AppConfig.SchemaApi = 'https://api-' + domain;
            AppConfig.SecretKey = 'HL3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
        } break;
    }
    AppConfig.DefaultPassword = 'Abcde12345^';
    AppConfig.ApiUrl = AppConfig.SchemaApi + '/api';
    AppConfig.SignalrUrl = AppConfig.SchemaApi + '/notifyhub';
    if (!AppConfig.LanguageKey)
        AppConfig.LanguageKey = domain.replace('-', '.') + '.language';
    if (!AppConfig.AccountTokenKey)
        AppConfig.AccountTokenKey = domain.replace('-', '.') + '.account';

    let language = localStorage.getItem(AppConfig.LanguageKey);
    if (!language || language == 'null')
        language = 'en';
    AppConfig.Language = language;
    AppConfig.Logo = AppConfig.SchemaWeb + '/assets/media/logos/logo-light.png';
    document.documentElement.style.setProperty("--color-active-menu", "#ffffff");
    document.documentElement.style.setProperty("--theme-aside-color", "#007bff");
    document.documentElement.style.setProperty("--default-color-link", "#00bafb");
    document.documentElement.style.setProperty("--theme-header-color", "#2188f7");
    document.documentElement.style.setProperty("--default-color-link-hover", "#00bafb");
    document.documentElement.style.setProperty("--background-active-aside-menu", "#0091FF");
}
