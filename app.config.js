export default {
    expo: {
        name: 'Haus',
        slug: 'haus',
        version: '1.0.0',
        userInterfaceStyle: 'light',
        splash: {
            backgroundColor: '#191f2b'
        },
        assetBundlePatterns: [
            '**/*'
        ],
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/icon.png',
                backgroundColor: '#ffc800'
            },
            package: 'com.chrisharrington.haus',
            config: {
                googleMaps: {
                    apiKey: process.env['EXPO_PUBLIC_GOOGLE_MAPS_API_KEY']
                }
            }
        },
        runtimeVersion: {
            policy: 'sdkVersion'
        },
        plugins: [
            [
                'expo-location',
                {
                    'isAndroidBackgroundLocationEnabled': true
                }
            ],
            'expo-font',
            'expo-secure-store',
            'expo-router'
        ],
        extra: {
            eas: {
                projectId: '20fb2b5b-6345-4e6c-846a-7391b1f085de'
            }
        },
        updates: {
            url: 'https://u.expo.dev/20fb2b5b-6345-4e6c-846a-7391b1f085de'
        }
    }
}