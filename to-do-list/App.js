import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	TextInput,
	ScrollView,
	Pressable,
	Alert,
	Button,
} from 'react-native';
import { color } from './color';
import { EvilIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_Height } = Dimensions.get('window');

export default function App() {
	const focus = useRef(null);

	const [boolean, setBoolean] = useState(true);
	const [text, onChangeText] = useState('');
	const [editText, onEditText] = useState('');
	const [toDo, setToDo] = useState({});
	const [showInput, setShowInput] = useState({});

	const storeData = async (value) => {
		try {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem('my-store', jsonValue);
		} catch (e) {
			// saving error
			console.log(e);
		}
	};
	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('my-store');
			if (jsonValue) {
				return JSON.parse(jsonValue);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleSubmit = async () => {
		const newTodo = { ...toDo, [Date.now()]: { text, working: boolean } };
		setToDo(newTodo);
		await storeData(newTodo);
		onChangeText('');
		focus.current.focus();
	};

	const handleDelete = (el) => {
		Alert.alert('삭제', '정말 삭제하시겠습니까', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					const obj = { ...toDo };
					delete obj[el];
					setToDo(obj);
				},
			},
		]);
	};

	const handleEdit = (el) => {
		setShowInput({ [el]: true });
		onEditText(toDo[el].text);
	};
	const saveEdit = async (el) => {
		const newToDo = { ...toDo };
		newToDo[el].text = editText;
		setToDo(newToDo);
		await storeData(newToDo);
		setShowInput({ [el]: false });
	};

	useEffect(() => {
		getData().then((data) => setToDo(data));
	}, []);
	return (
		<>
			<StatusBar style='light' />
			<View style={styles.container}>
				<View style={styles.buttonWrap}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => setBoolean(true)}>
						<Text
							style={{
								...styles.btnText,
								color: boolean ? 'white' : 'gray',
								borderBottomColor: boolean ? 'white' : null,
							}}>
							Work
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={() => setBoolean(false)}>
						<Text
							style={{
								...styles.btnText,
								color: !boolean ? 'white' : 'gray',
								borderBottomColor: !boolean ? 'white' : null,
							}}>
							Travel
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<TextInput
						style={styles.textInput}
						onChangeText={onChangeText}
						value={text}
						placeholder={boolean ? 'text to work' : 'text to travel'}
						onSubmitEditing={handleSubmit}
						ref={focus}
					/>
				</View>
				<ScrollView contentContainerStyle={styles.listView}>
					{toDo !== undefined &&
						Object.keys(toDo).map((el, idx) => {
							if (toDo[el]?.working === boolean)
								return (
									<View style={styles.listText} key={idx}>
										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}>
											<AntDesign
												style={{ paddingRight: 10 }}
												name='pluscircleo'
												size={24}
												color='#fff'
											/>
											{!showInput[el] && (
												<Text style={styles.listTextContent}>
													{toDo[el].text}
												</Text>
											)}
											{showInput[el] && (
												<View style={{ gap: 10 }}>
													<TextInput
														onChangeText={onEditText}
														value={editText}
														placeholder={toDo[el].text}
														style={{
															...styles.textInput,
															paddingVertical: 5,
															borderRadius: 1.5,
															width: SCREEN_WIDTH / 1.6,
														}}
													/>
													<View
														style={{
															flexDirection: 'row',
															justifyContent: 'center',
														}}>
														<Button title='수정' onPress={() => saveEdit(el)} />
														<Button
															title='취소'
															color='#841584'
															onPress={() => {
																setShowInput({ ...showInput, [el]: false });
															}}
														/>
													</View>
												</View>
											)}
										</View>
										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Pressable
												style={{ flexDirection: 'row' }}
												onPress={() => handleEdit(el)}>
												<Feather name='edit' size={18} color='#fff' />
											</Pressable>
											<Pressable
												style={{ flexDirection: 'row' }}
												onPress={() => handleDelete(el)}>
												<EvilIcons name='trash' size={24} color='#fff' />
											</Pressable>
										</View>
									</View>
								);
						})}
				</ScrollView>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		height: SCREEN_Height,
		backgroundColor: color.background,
		color: '#fff',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	buttonWrap: {
		paddingVertical: 30,
		width: SCREEN_WIDTH,
		flexDirection: 'row',
		borderBottomColor: '#fff',
		justifyContent: 'space-around',
	},
	button: {
		paddingVertical: 30,
		color: '#fff',
	},
	btnText: {
		fontSize: 20,
		color: '#fff',
		borderBottomWidth: 1,
	},
	textInput: {
		width: SCREEN_WIDTH - 50,
		backgroundColor: '#fff',
		borderRadius: 50,
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
	listView: {
		paddingTop: 30,
		width: SCREEN_WIDTH,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listText: {
		width: '90%',
		color: '#fff',
		fontSize: 20,
		borderColor: color.list,
		borderWidth: 1,
		borderRadius: 5,
		marginVertical: 10,
		fontSize: 14,
		paddingHorizontal: 10,
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	listTextContent: {
		color: '#fff',
	},
});
