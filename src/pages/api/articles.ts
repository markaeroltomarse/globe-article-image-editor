// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IArticle } from "@/common/types/article.type";
import FirebaseService from "@/utils/firebase.util";
import type { NextApiRequest, NextApiResponse } from "next";

const firebaseConfig = {
  apiKey: "AIzaSyBR8g3x4exrtFTee6txYnXxtO5aq9kRNso",
  authDomain: "globe-article-temp.firebaseapp.com",
  projectId: "globe-article-temp",
  storageBucket: "globe-article-temp.appspot.com",
  messagingSenderId: "473312626609",
  appId: "1:473312626609:web:e6e59af0cfd735844d1f90",
  measurementId: "G-5TFK8EE29N"
};

const firebaseService = new FirebaseService(firebaseConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { paginate, type } = req.query;

  if (req.method === 'POST') {
    const article: IArticle = req.body;

    try {
      // Get the current JSON data
      const jsonData = await firebaseService.getJsonFile(Number(paginate));

      // Find the index of the article to edit
      const indexToEdit = jsonData.result.findIndex((a: IArticle) => a.title === article?.title);

      
      if (article && jsonData.result && jsonData.result[indexToEdit]) {
        // Modify the properties of the object as needed
        jsonData.result[indexToEdit] = req.body;
        console.log('article',  jsonData.result[indexToEdit])
        // Create or update the JSON file in Firebase Storage
        await firebaseService.createOrUpdateJsonFile(Number(paginate), jsonData);

        res.status(200).json({ message: 'Object edited successfully' });
      } else {
        res.status(404).json({ message: 'Object not found or index out of bounds' });
      }
    } catch (error) {
      console.error('Error editing object:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'GET') {
    if (type && type === 'failed') {
      // Handle your specific case
    } else {
      try {
        // Get JSON file from Firebase Storage
        const jsonData = await firebaseService.getJsonFile(Number(paginate));
        res.status(200).json({ data: jsonData.result });
      } catch (error) {
        res.status(404).json({ message: 'Object not found or index out of bounds' });
      }
    }
  }
}
