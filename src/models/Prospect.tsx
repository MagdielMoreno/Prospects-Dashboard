import Icon from "@/components/Icon";
import axios from "axios";
import { Doc } from "./Document";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface Prospect {
  id: number;
  name: string;
  lastName: string;
  secondLastName: string;
  phone: string;
  status: number;
  hasDocuments: boolean;
}

export const DefaultProspect: Prospect = {
  id: 0,
  name: "",
  lastName: "",
  secondLastName: "",
  phone: "",
  status: 1,
  hasDocuments: false
};

export const getAllProspects = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/prospects`, {
      headers: {
        key: API_KEY,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching prospects:", error);
    return [];
  }
};

export const uploadFiles = async (id: number, files: Doc[]) => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", file.name);
    formData.append("document", file.document);

    try {
      await axios.post(`${BASE_URL}/prospects/upload`, formData, {
        headers: {
          key: API_KEY,
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);
  return results;
};

export const updateProspect = async (prospect: Prospect) => {
  try {
    const response = await axios.put(`${BASE_URL}/prospects`, prospect, {
      headers: {
        key: API_KEY,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating prospect:", error);
  }
};

export const addProspect = async (prospect: Prospect) => {
  try {
    const { id, ...newUser } = prospect;
    const response = await axios.post(`${BASE_URL}/prospects`, newUser, {
      headers: {
        key: API_KEY,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding prospect:", error);
  }
};

export const getProspectDocuments = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/prospects/documents/${id}`, {
      headers: {
        key: API_KEY,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}