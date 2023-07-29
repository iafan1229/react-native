import React, { useCallback, useEffect, useState } from 'react';
// import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from 'styled-components/native';
import { StyleSheet, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset, useAssets } from 'expo-asset';
import PagerView from 'react-native-pager-view';
import Slider from '../components/MyPager';
import { ActivityIndicator, Dimensions, FlatList } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				await Font.loadAsync(Entypo.font);
			} catch (e) {
				console.warn(e);
			} finally {
				// Tell the application to render
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	return (
		<View
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
			onLayout={onLayoutRootView}>
			<Slider />
			<View>
				<Text>Movie List - by Hayoung Lee👋</Text>
				<Entypo name='rocket' size={30} />
			</View>
		</View>
	);
}
