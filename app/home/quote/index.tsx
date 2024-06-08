import React, { useState } from 'react';
import { Text } from 'react-native';
import { useAsyncEffect } from 'use-async-effect';
import { StyleSheet } from '@lib/stylesheet';
import colours from '@lib/colours';
import { Tile } from '@lib/components/tile';
import { Quote as QuoteModel, getTodayQuote } from '@lib/data/external/quote';

type Props = {

}

export const Quote = ({} : Props) => {
    const [quote, setQuote] = useState<QuoteModel | null>(null);

    useAsyncEffect(async () => {
        try {
            setQuote(await getTodayQuote());
        } catch (e) {
            console.error(e);
        }
    }, []);
    
    return <Tile style={styles.quoteContainer}>
        <Text style={styles.quote}>
            {quote?.content ? `“${quote.content}”` : ''}
        </Text>
        <Text style={styles.authour}>{`—${quote?.authour ?? ''}`}</Text>
    </Tile>;
}

const styles = StyleSheet.create({
    quoteContainer: {
        marginTop: 15
    },

    quote: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: colours.text1.hex(),
        fontStyle: 'italic',
        textAlign: 'center'
    },

    authour: {
        flex: 1,
        alignSelf: 'flex-end',
        fontSize: 12,
        fontFamily: 'Roboto',
        color: colours.text2.hex(),
        marginTop: 6,
        textAlign: 'center'
    }
});