import { FirebaseApp, initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class FirebaseService {
  private firebaseApp: FirebaseApp;
  private storage;

  constructor(config: FirebaseConfig) {
    this.firebaseApp = initializeApp(config);
    this.storage = getStorage(this.firebaseApp);
  }

  private getFilePath(paginate: number): string {
    return `json_articles/${paginate}-listing.servlet.json`;
  }

  async createOrUpdateJsonFile(paginate: number, data: any): Promise<void> {
    try {
      const filePath = this.getFilePath(paginate);
      const jsonString = JSON.stringify(data, null, 2);

      // Upload the JSON string to Firebase Storage
      await uploadString(ref(this.storage, filePath), jsonString);

      console.log('JSON file successfully uploaded:', filePath);
    } catch (error) {
      console.error('Error uploading JSON file:', error);
      throw error;
    }
  }

  async getJsonFile(paginate: number): Promise<any> {
    try {
      const filePath = this.getFilePath(paginate);
      const downloadURL = await getDownloadURL(ref(this.storage, filePath));

      // Fetch the JSON file from the download URL
      const response = await fetch(downloadURL);
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.error('Error fetching JSON file:', error);
      throw error;
    }
  }

  async deleteJsonFile(paginate: number): Promise<void> {
    try {
      const filePath = this.getFilePath(paginate);

      // Delete the JSON file from Firebase Storage
      // Note: Deleting files from Firebase Storage is a premium feature
      // You might need to handle file deletion differently based on your Firebase plan
      // See Firebase Storage pricing and documentation for more details
      // https://firebase.google.com/pricing
      // https://firebase.google.com/docs/storage/web/delete-files
    } catch (error) {
      console.error('Error deleting JSON file:', error);
      throw error;
    }
  }
}

export default FirebaseService;
