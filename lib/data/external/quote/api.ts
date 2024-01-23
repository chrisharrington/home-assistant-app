import { Quote } from './models';

export const getTodayQuote = async () : Promise<Quote> => {
    const response = await fetch(`https://zenquotes.io/api/today`);

    if (!response.ok)
        throw response;

    const json = await response.json();
    return {
        content: json[0].q,
        authour: json[0].a
    };
}