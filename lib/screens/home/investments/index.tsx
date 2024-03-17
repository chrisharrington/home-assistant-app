import React, { Suspense, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from '@lib/stylesheet';
import { Tile } from '@lib/components/tile';
import colours from '@lib/colours';
import { getBalance, getExchange } from './api';
import { StateContext } from '@lib/context';
import { LoaderBoundary } from '@lib/components/loaderBoundary';

const balanceResource = getBalance(),
    exchangeResource = getExchange();

export const Investments = () => {
    const { toast } = useContext(StateContext),
        formatter = useMemo(() => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }), []);

    return <Tile style={{ flexDirection: 'row' }}>
        <View style={{ flex: 2 }}>
            <Text style={styles.label}>Investments</Text>
            <LoaderBoundary
                loadingFallback={<Text style={styles.amount}>-</Text>}
                errorFallback={<Text style={styles.amount}>-</Text>}
                onError={() => toast.error('An error occurred while loading the investments balance.')}
            >
                <Balance />
            </LoaderBoundary>
        </View> 

        <View style={{ flex: 1 }}>
            <Text style={styles.label}>Exchange</Text>
            <LoaderBoundary
                loadingFallback={<Text style={styles.amount}>-</Text>}
                errorFallback={<Text style={styles.amount}>-</Text>}
                onError={() => toast.error('An error occurred while loading the exchange rate.')}
            >
                <Exchange />
            </LoaderBoundary>
        </View>
    </Tile>;

    function Balance() {
        const balance = balanceResource.read();
        return <>
            <Text style={styles.amount}>{balance ? formatter.format(balance.amount) : '-'}</Text>
            <Text>{balance ? balance.change : ''}</Text>
        </>;
    }

    function Exchange (){
        const exchange = exchangeResource.read();
        return <Text style={styles.amount}>{exchange.toFixed(4)}</Text>;
    }
}

const styles = StyleSheet.create({
    label: {
        color: colours.text2.hex(),
        fontSize: 14,
        marginBottom: 3
    },

    amount: {
        color: colours.text1.hex(),
        fontSize: 28,
        fontFamily: 'Lato Regular'
    },

    positive: {
        color: colours.textPositive.hex()
    },

    negative: {
        color: colours.textNegative.hex()
    }
});