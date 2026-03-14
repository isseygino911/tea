import { useState, useCallback } from 'react';
import api from '../services/api';

export const useDocuments = () => {
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ==================== FOLDER OPERATIONS ====================

  // Fetch all folders (public)
  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/documents/folders');
      setFolders(response.data.folders || []);
      return response.data.folders;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch folders');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all folders (admin)
  const fetchAllFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/documents/admin/folders');
      setFolders(response.data.folders || []);
      return response.data.folders;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch folders');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create folder
  const createFolder = useCallback(async (folderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/documents/admin/folders', folderData);
      await fetchAllFolders(); // Refresh list
      return response.data.folder;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllFolders]);

  // Update folder
  const updateFolder = useCallback(async (id, folderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/documents/admin/folders/${id}`, folderData);
      await fetchAllFolders(); // Refresh list
      return response.data.folder;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllFolders]);

  // Delete folder
  const deleteFolder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/documents/admin/folders/${id}`);
      await fetchAllFolders(); // Refresh list
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete folder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllFolders]);

  // ==================== DOCUMENT OPERATIONS ====================

  // Fetch documents (public)
  const fetchDocuments = useCallback(async (folderId = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = folderId ? { folder_id: folderId } : {};
      const response = await api.get('/documents', { params });
      setDocuments(response.data.documents || []);
      return response.data.documents;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all documents (admin)
  const fetchAllDocuments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/documents/admin/all', { params });
      setDocuments(response.data.documents || []);
      return response.data.documents;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload single PDF file to S3
  const uploadPdf = useCallback(async (file, folderId = null, metadata = {}) => {
    setLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Get folder name for S3 path
      let folderName = 'uncategorized';
      if (folderId) {
        const folder = folders.find(f => f.id === parseInt(folderId));
        if (folder) {
          folderName = folder.name;
        }
      }

      // Step 1: Get presigned upload URL from backend
      const uploadUrlResponse = await api.post('/documents/admin/upload-url', {
        filename: file.name,
        folder_name: folderName,
      });

      const { uploadUrl, publicUrl, key } = uploadUrlResponse.data;

      // Step 2: Upload file directly to S3 using XMLHttpRequest for progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/pdf');
        xhr.send(file);
      });

      // Step 3: Save document metadata to database
      const documentData = {
        title: metadata.title || file.name.replace(/\.pdf$/i, ''),
        description: metadata.description || '',
        folder_id: folderId || null,
        file_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
      };

      const createResponse = await api.post('/documents/admin', documentData);
      
      return createResponse.data.document;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [folders]);

  // Upload multiple PDF files to S3
  const uploadMultiplePdfs = useCallback(async (files, folderId = null, onProgress = null) => {
    setLoading(true);
    setError(null);
    
    const results = {
      successful: [],
      failed: [],
    };

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Report overall progress
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: files.length,
            fileName: file.name,
            status: 'uploading'
          });
        }

        try {
          const document = await uploadPdf(file, folderId, {
            title: file.name.replace(/\.pdf$/i, ''),
            description: '',
          });
          results.successful.push({ file, document });
        } catch (err) {
          results.failed.push({ file, error: err.message });
        }
      }

      // Refresh documents list after all uploads
      await fetchAllDocuments();
      
      return results;
    } catch (err) {
      setError(err.message || 'Failed to upload documents');
      throw err;
    } finally {
      setLoading(false);
      if (onProgress) {
        onProgress({ current: files.length, total: files.length, status: 'complete' });
      }
    }
  }, [uploadPdf, fetchAllDocuments]);

  // Update document
  const updateDocument = useCallback(async (id, documentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/documents/admin/${id}`, documentData);
      await fetchAllDocuments(); // Refresh list
      return response.data.document;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllDocuments]);

  // Delete document
  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/documents/admin/${id}`);
      await fetchAllDocuments(); // Refresh list
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllDocuments]);

  // Get document download URL (presigned)
  const getDocumentDownloadUrl = useCallback(async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      // Increment download count
      await api.post(`/documents/${id}/download`);
      return response.data.document.view_url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get document');
      throw err;
    }
  }, []);

  // Download document directly
  const downloadDocument = useCallback(async (doc) => {
    try {
      const downloadUrl = await getDocumentDownloadUrl(doc.id);
      
      // Create temporary link to download
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = doc.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to download document');
      throw err;
    }
  }, [getDocumentDownloadUrl]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    folders,
    documents,
    loading,
    error,
    uploadProgress,
    
    // Folder operations
    fetchFolders,
    fetchAllFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    
    // Document operations
    fetchDocuments,
    fetchAllDocuments,
    uploadPdf,
    uploadMultiplePdfs,
    updateDocument,
    deleteDocument,
    getDocumentDownloadUrl,
    downloadDocument,
    
    // Utils
    clearError,
  };
};

export default useDocuments;
