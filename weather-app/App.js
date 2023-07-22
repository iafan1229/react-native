import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Dimensions,
	Image,
} from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

const { width: windowWidth } = Dimensions.get('window');

export default function App() {
	// 여기에 Google API 키를 설정합니다.
	const API_KEY = '4d65fb03299758f1f721b4287e630ad4';
	// Google API 키를 설정합니다.
	Geocoder.init(API_KEY);

	const [city, setCity] = useState('');
	const [errorMsg, setErrorMsg] = useState(null);
	const [weather, setWeather] = useState(null);
	const [sortedWeather, setSortedWeather] = useState([]);

	const getWeatherInfo = async (latitude, longitude) => {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
			);
			if (!response) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching weather data:', error);
		}
	};
	const allowPermission = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied');
			return;
		}

		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });

		const city = await Location.reverseGeocodeAsync(
			{
				latitude,
				longitude,
			},
			{ useGoogleMaps: false }
		);
		const [address] = city;
		//도시명 state에 담기
		setCity(address.country + ' ' + address.region + ' ' + address.street);
		return getWeatherInfo(latitude, longitude);
	};

	async function fetchDataWrapper() {
		try {
			const result = await allowPermission();
			setWeather(result);
		} catch (error) {
			console.error('최상위 에러:', error);
		}
	}

	useEffect(() => {
		fetchDataWrapper();
	}, []);

	useEffect(() => {
		if (weather) {
			const newArr = weather.list.filter((data) =>
				data['dt_txt'].includes('00:00:00')
			);
			setSortedWeather(newArr);
		}
	}, [weather]);
	return (
		<>
			<StatusBar />
			<View style={styles.container}>
				<Text style={styles.text}>{city || errorMsg}</Text>
			</View>
			<ScrollView style={styles.sliderWrap} horizontal>
				{sortedWeather.map((el, idx) => {
					return (
						<View style={styles.slider} key={idx}>
							<Text style={styles.text}>{el['dt_txt'].split(' ')[0]}</Text>
							<Text style={styles.text}>{el['weather'][0].main}</Text>
							<Text style={styles.text}>{el['weather'][0].description}</Text>
							<Image
								style={{ width: 100, height: 100 }}
								source={{
									uri: `https://openweathermap.org/img/wn/${el['weather'][0].icon}@2x.png`,
								}}
							/>
						</View>
					);
				})}
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
		width: windowWidth,
		flex: 0.5,
		backgroundColor: 'pink',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sliderWrap: {
		flex: 1.5,
	},
	slider: {
		width: windowWidth,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 30,
	},
});
