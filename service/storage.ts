import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Stores an object in the local storage with the specified key.
 * @param key - The string key to store the content under.
 * @param content - The object to be stored.
 */
export const storeData = async (
  key: string,
  content: object,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(content);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error storing data for key ${key}:`, e);
    throw e;
  }
};

/**
 * Retrieves an object from the local storage associated with the specified key.
 * @param key - The string key to retrieve the content from.
 * @returns The parsed object or null if not found.
 */
export const getData = async <T extends object>(
  key: string,
): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error retrieving data for key ${key}:`, e);
    throw e;
  }
};

/**
 * Modifies/updates an existing object in the local storage associated with the specified key.
 * If the key doesn't exist, it will behave like storeData.
 * @param key - The string key of the object to modify.
 * @param content - The object containing the updates to be merged.
 */
export const modifyData = async (
  key: string,
  content: object,
): Promise<void> => {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(content));
  } catch (e) {
    console.error(`Error modifying data for key ${key}:`, e);
    throw e;
  }
};

/**
 * Deletes the content associated with the specified key from the local storage.
 * @param key - The string key of the content to delete.
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing data for key ${key}:`, e);
    throw e;
  }
};
