import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Image,
	FlatList,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { styled } from 'styled-components/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MovieList = styled.View`
	flex: 1;
	padding-top: 30px;
	width: ${screenWidth}px - 30px;
	background-color: #f9c2ff;
`;

const MovieImage = styled.Image`
	width: ${screenWidth}px;
	height: ${screenHeight / 3}px;
`;

type ItemProps = { title: string };
interface listTypes {
	id: number;
	title: string;
}

const Item = ({ title }: ItemProps) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
);

export default function MyPager() {
	const [slider, setSlider] = useState([]);
	const [list, setList] = useState<listTypes[]>([]);

	useEffect(() => {
		const popular = 'https://api.themoviedb.org/3/movie/now_playing';
		const topRated = 'https://api.themoviedb.org/3/movie/top_rated';
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization:
					'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjliYjdlMGE2ZGQxMjM3MmQ0MzVjYWQ1Mzc4OWM5NCIsInN1YiI6IjYyYTgwYWYwZDU1Njk3MThjNzVhNWYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cNJzzxCT1_D5yV_e62hnRPp5t29aHrWnE3GkmM2-4Ks',
			},
		};

		const fetchMovie = async (movieParameter: string) => {
			const response = await fetch(movieParameter, options);
			const data = await response.json();
			const { results } = data;
			return results;
		};

		fetchMovie(popular).then((res) => setSlider(res));
		fetchMovie(topRated).then((res) => setList(res));
	}, []);

	return (
		<View>
			<PagerView style={{ flex: 1, width: screenWidth }} initialPage={0}>
				{slider.map((el: any, idx: number) => {
					return (
						<MovieList key={idx}>
							<Text style={{ fontSize: 20 }}>{el.original_title}</Text>
							<View>
								<MovieImage
									source={{
										uri: `https://image.tmdb.org/t/p/w500/${el.backdrop_path}`,
									}}
								/>
							</View>
						</MovieList>
					);
				})}
			</PagerView>
			<FlatList
				style={{ flex: 1 }}
				data={list}
				renderItem={({ item }) => <Item title={item.title} />}
				keyExtractor={(item) => item.id + ' '}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 20,
	},
});
