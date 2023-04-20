import AsyncStorage from '@react-native-community/async-storage';

const KEY_PREFIX = 'loharano'

export default {
  getItem : async (key: string) => {
    let value;
    try {
      value = await AsyncStorage.getItem(`${KEY_PREFIX}_${key}`);
    } catch(e) {
      console.log('AsyncStorage => getItem : ', e);
    }
    return value;
  },

  setItem : async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(`${KEY_PREFIX}_${key}`, value);
    } catch (e) {
      console.log('AsyncStorage => getItem : ', e);
    }
  },

  removeItem : async (key: string) => {
    try {
      await AsyncStorage.removeItem(`${KEY_PREFIX}_${key}`);
    } catch(e) {
      console.log('AsyncStorage => removeItem : ', e);
    }
  },

  clear : async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      console.log('AsyncStorage => getItem : ', e);
    }
  },
};