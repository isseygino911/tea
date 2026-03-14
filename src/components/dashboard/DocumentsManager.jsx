import { useState, useEffect, useRef, useCallback } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { 
  FileText, 
  Folder, 
  Upload, 
  Trash2, 
  Edit2, 
  Plus, 
  X, 
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Check,
  AlertCircle,
  File,
  Loader2,
  Move
} from 'lucide-react';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Upload Modal (Multiple Files Support)
const UploadModal = ({ isOpen, onClose, folders, onUpload, onUploadMultiple, loading }) => {
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    current: 0,
    total: 0,
    fileName: '',
    status: 'idle', // idle, uploading, complete, error
  });
  const inputRef = useRef(null);

  const resetForm = () => {
    setSelectedFolder('');
    setSelectedFiles([]);
    setUploadStatus({ current: 0, total: 0, fileName: '', status: 'idle' });
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const addFiles = (files) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    
    const progressCallback = (progress) => {
      setUploadStatus(progress);
    };

    const results = await onUploadMultiple(
      selectedFiles, 
      selectedFolder || null, 
      progressCallback
    );
    
    if (results.failed.length === 0) {
      handleClose();
    } else {
      // Keep failed files in the list
      setSelectedFiles(results.failed.map(f => f.file));
      setUploadStatus({ current: 0, total: 0, fileName: '', status: 'error' });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Upload PDF Documents (${selectedFiles.length})`}>
      <div style={styles.modalBody}>
        {/* Drag & Drop Zone */}
        <div 
          style={{
            ...styles.dropZone,
            ...(dragActive ? styles.dropZoneActive : {}),
            ...(selectedFiles.length > 0 ? styles.dropZoneHasFiles : {}),
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Upload size={48} color="rgba(255,255,255,0.3)" />
          <p style={styles.dropText}>Drag & drop PDFs here, or click to browse</p>
          <p style={styles.dropHint}>You can select multiple files. Max 50MB each.</p>
        </div>

        {/* File List */}
        {selectedFiles.length > 0 && (
          <div style={styles.fileListContainer}>
            <div style={styles.fileListHeader}>
              <span>{selectedFiles.length} file(s) selected</span>
              <span style={styles.fileListSize}>Total: {formatFileSize(totalSize)}</span>
            </div>
            <div style={styles.fileList}>
              {selectedFiles.map((file, index) => (
                <div key={index} style={styles.fileListItem}>
                  <FileText size={20} color="#ffffff" />
                  <div style={styles.fileListInfo}>
                    <p style={styles.fileListName}>{file.name}</p>
                    <p style={styles.fileListMeta}>{formatFileSize(file.size)}</p>
                  </div>
                  {!loading && (
                    <button 
                      style={styles.fileListRemove}
                      onClick={() => removeFile(index)}
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {loading && uploadStatus.status === 'uploading' && (
          <div style={styles.batchProgressContainer}>
            <div style={styles.batchProgressHeader}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Uploading {uploadStatus.current} of {uploadStatus.total}...</span>
            </div>
            <p style={styles.batchProgressFile}>{uploadStatus.fileName}</p>
            <div style={styles.batchProgressBar}>
              <div 
                style={{
                  ...styles.batchProgressFill,
                  width: `${(uploadStatus.current / uploadStatus.total) * 100}%`,
                }}
              />
            </div>
            <p style={styles.batchProgressText}>
              {Math.round((uploadStatus.current / uploadStatus.total) * 100)}% complete
            </p>
          </div>
        )}

        {/* Error Message */}
        {uploadStatus.status === 'error' && (
          <div style={styles.uploadError}>
            <AlertCircle size={18} />
            <span>Some files failed to upload. Check the list and try again.</span>
          </div>
        )}

        {/* Folder Selection */}
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Folder (applies to all files)</label>
          <select
            style={styles.formSelect}
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            disabled={loading}
          >
            <option value="">Uncategorized</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div style={styles.modalActions}>
          <button 
            style={styles.btnSecondary} 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            style={{
              ...styles.btnPrimary,
              opacity: selectedFiles.length === 0 || loading ? 0.5 : 1,
            }}
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0 || loading}
          >
            {loading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Move Document Modal
const MoveDocumentModal = ({ isOpen, onClose, document, folders, onMove, loading }) => {
  const [selectedFolder, setSelectedFolder] = useState('');

  useEffect(() => {
    if (document) {
      setSelectedFolder(document.folder_id || '');
    }
  }, [document, isOpen]);

  const handleSubmit = () => {
    onMove(document.id, selectedFolder || null);
  };

  if (!document) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Move Document">
      <div style={styles.modalBody}>
        <div style={styles.moveDocInfo}>
          <FileText size={32} color="#ffffff" />
          <div>
            <p style={styles.moveDocTitle}>{document.title}</p>
            <p style={styles.moveDocCurrent}>
              Current: {document.folder_name || 'Uncategorized'}
            </p>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Move to Folder</label>
          <select
            style={styles.formSelect}
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            disabled={loading}
          >
            <option value="">Uncategorized</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.modalActions}>
          <button 
            style={styles.btnSecondary} 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            style={{
              ...styles.btnPrimary,
              opacity: loading ? 0.5 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Moving...' : 'Move Document'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Folder Modal (Create/Edit)
const FolderModal = ({ isOpen, onClose, folder, onSave, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (folder) {
      setName(folder.name || '');
      setDescription(folder.description || '');
      setSortOrder(folder.sort_order || 0);
    } else {
      setName('');
      setDescription('');
      setSortOrder(0);
    }
  }, [folder, isOpen]);

  const handleSubmit = () => {
    onSave({ name, description, sort_order: parseInt(sortOrder) || 0 });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={folder ? 'Edit Folder' : 'Create Folder'}
    >
      <div style={styles.modalBody}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Name *</label>
          <input
            type="text"
            style={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter folder name"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Description</label>
          <input
            type="text"
            style={styles.formInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter folder description"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Sort Order</label>
          <input
            type="number"
            style={styles.formInput}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="0"
          />
          <p style={styles.formHint}>Lower numbers appear first</p>
        </div>

        <div style={styles.modalActions}>
          <button 
            style={styles.btnSecondary} 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            style={{
              ...styles.btnPrimary,
              opacity: !name || loading ? 0.5 : 1,
            }}
            onClick={handleSubmit}
            disabled={!name || loading}
          >
            {loading ? 'Saving...' : (folder ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Component
export const DocumentsManager = () => {
  const [activeTab, setActiveTab] = useState('files'); // 'files' | 'folders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [movingDocument, setMovingDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const {
    folders,
    documents,
    loading,
    error,
    fetchAllFolders,
    fetchAllDocuments,
    uploadMultiplePdfs,
    createFolder,
    updateFolder,
    deleteFolder,
    updateDocument,
    deleteDocument,
    clearError,
  } = useDocuments();

  // Initial data load
  useEffect(() => {
    fetchAllFolders();
    fetchAllDocuments();
  }, [fetchAllFolders, fetchAllDocuments]);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = !selectedFolderFilter || 
      doc.folder_id === parseInt(selectedFolderFilter);
    
    return matchesSearch && matchesFolder;
  });

  // Handlers
  const handleUploadMultiple = async (files, folderId, onProgress) => {
    return await uploadMultiplePdfs(files, folderId, onProgress);
  };

  const handleFolderSave = async (data) => {
    if (editingFolder) {
      await updateFolder(editingFolder.id, data);
    } else {
      await createFolder(data);
    }
    setIsFolderModalOpen(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = async (folderId) => {
    if (deleteConfirm === `folder-${folderId}`) {
      await deleteFolder(folderId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(`folder-${folderId}`);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (deleteConfirm === `doc-${docId}`) {
      await deleteDocument(docId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(`doc-${docId}`);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleMoveDocument = async (docId, folderId) => {
    await updateDocument(docId, { folder_id: folderId });
    setIsMoveModalOpen(false);
    setMovingDocument(null);
  };

  const openMoveModal = (doc) => {
    setMovingDocument(doc);
    setIsMoveModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Documents Management</h2>
        <button 
          style={styles.uploadBtn}
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload size={18} />
          Upload PDFs
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button style={styles.errorClose} onClick={clearError}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'files' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('files')}
        >
          <FileText size={18} />
          All Files
          <span style={styles.tabBadge}>{documents.length}</span>
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'folders' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('folders')}
        >
          <Folder size={18} />
          Folders
          <span style={styles.tabBadge}>{folders.length}</span>
        </button>
      </div>

      {/* Filters (Files tab only) */}
      {activeTab === 'files' && (
        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            style={styles.filterSelect}
            value={selectedFolderFilter}
            onChange={(e) => setSelectedFolderFilter(e.target.value)}
          >
            <option value="">All Folders</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {loading && documents.length === 0 && folders.length === 0 ? (
        <div style={styles.loading}>Loading...</div>
      ) : activeTab === 'files' ? (
        /* Files Tab */
        <div style={styles.filesContainer}>
          {filteredDocuments.length === 0 ? (
            <div style={styles.emptyState}>
              <FileText size={64} color="rgba(255,255,255,0.2)" />
              <p>No documents found</p>
              <button 
                style={styles.emptyAction}
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload your first PDFs
              </button>
            </div>
          ) : (
            <div style={styles.fileList}>
              {/* Table Header */}
              <div style={styles.fileListHeader}>
                <div style={styles.cellDoc}>Document</div>
                <div style={styles.cellFolder}>Folder</div>
                <div style={styles.cellSize}>Size</div>
                <div style={styles.cellDownloads}>Downloads</div>
                <div style={styles.cellDate}>Date</div>
                <div style={styles.cellActions}>Actions</div>
              </div>

              {/* Table Body */}
              {filteredDocuments.map(doc => (
                <div key={doc.id} style={styles.fileRow}>
                  <div style={styles.cellDoc}>
                    <div style={styles.fileInfo}>
                      <FileText size={24} color="#ffffff" />
                      <div>
                        <p style={styles.fileTitle}>{doc.title}</p>
                        {doc.description && (
                          <p style={styles.fileDesc}>{doc.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={styles.cellFolder}>
                    <span style={styles.folderTag}>
                      {doc.folder_name || 'Uncategorized'}
                    </span>
                  </div>
                  <div style={styles.cellSizeMuted}>
                    {doc.file_size_formatted}
                  </div>
                  <div style={styles.cellDownloadsMuted}>
                    {doc.download_count || 0}
                  </div>
                  <div style={styles.cellDateMuted}>
                    {formatDate(doc.created_at)}
                  </div>
                  <div style={styles.cellActions}>
                    <div style={styles.actions}>
                      <button 
                        style={styles.actionBtn}
                        onClick={() => openMoveModal(doc)}
                        title="Move to Folder"
                      >
                        <Move size={16} />
                      </button>
                      <button 
                        style={styles.actionBtn}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        style={{
                          ...styles.actionBtn,
                          ...(deleteConfirm === `doc-${doc.id}` ? styles.actionBtnDanger : {}),
                        }}
                        onClick={() => handleDeleteDocument(doc.id)}
                        title={deleteConfirm === `doc-${doc.id}` ? 'Confirm Delete' : 'Delete'}
                      >
                        {deleteConfirm === `doc-${doc.id}` ? <Check size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Folders Tab */
        <div style={styles.foldersContainer}>
          <div style={styles.foldersHeader}>
            <button 
              style={styles.createFolderBtn}
              onClick={() => {
                setEditingFolder(null);
                setIsFolderModalOpen(true);
              }}
            >
              <Plus size={18} />
              Create Folder
            </button>
          </div>

          {folders.length === 0 ? (
            <div style={styles.emptyState}>
              <Folder size={64} color="rgba(255,255,255,0.2)" />
              <p>No folders yet</p>
              <button 
                style={styles.emptyAction}
                onClick={() => {
                  setEditingFolder(null);
                  setIsFolderModalOpen(true);
                }}
              >
                Create your first folder
              </button>
            </div>
          ) : (
            <div style={styles.folderGrid}>
              {folders.map(folder => (
                <div key={folder.id} style={styles.folderCard}>
                  <div style={styles.folderIcon}>
                    <Folder size={40} color="#ffffff" />
                  </div>
                  <div style={styles.folderInfo}>
                    <h4 style={styles.folderName}>{folder.name}</h4>
                    {folder.description && (
                      <p style={styles.folderDesc}>{folder.description}</p>
                    )}
                    <p style={styles.folderMeta}>
                      {folder.document_count || 0} documents • Sort: {folder.sort_order}
                    </p>
                  </div>
                  <div style={styles.folderActions}>
                    <button 
                      style={styles.actionBtn}
                      onClick={() => {
                        setEditingFolder(folder);
                        setIsFolderModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      style={{
                        ...styles.actionBtn,
                        ...(deleteConfirm === `folder-${folder.id}` ? styles.actionBtnDanger : {}),
                      }}
                      onClick={() => handleDeleteFolder(folder.id)}
                      title={deleteConfirm === `folder-${folder.id}` ? 'Confirm Delete' : 'Delete'}
                    >
                      {deleteConfirm === `folder-${folder.id}` ? <Check size={16} /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={folders}
        onUploadMultiple={handleUploadMultiple}
        loading={loading}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
        onSave={handleFolderSave}
        loading={loading}
      />

      <MoveDocumentModal
        isOpen={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false);
          setMovingDocument(null);
        }}
        document={movingDocument}
        folders={folders}
        onMove={handleMoveDocument}
        loading={loading}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 180px)',
    minHeight: '500px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: 0,
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    marginBottom: '1rem',
    color: '#ef4444',
    flexShrink: 0,
  },
  errorClose: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '1rem',
    flexShrink: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
    borderColor: 'rgba(255,255,255,0.3)',
    color: '#ffffff',
  },
  tabBadge: {
    padding: '0.125rem 0.5rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    marginLeft: '0.25rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexShrink: 0,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    minWidth: '150px',
  },
  filesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 0,
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  emptyAction: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '0.5rem',
  },
  fileListHeader: {
    display: 'flex',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  fileCell: {
    display: 'flex',
    alignItems: 'center',
  },
  // Pre-defined cell styles to avoid inline object creation
  cellDoc: {
    display: 'flex',
    alignItems: 'center',
    flex: 2,
  },
  cellFolder: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  cellSize: {
    display: 'flex',
    alignItems: 'center',
    flex: 0.5,
  },
  cellSizeMuted: {
    display: 'flex',
    alignItems: 'center',
    flex: 0.5,
    color: 'rgba(255,255,255,0.6)',
  },
  cellDownloads: {
    display: 'flex',
    alignItems: 'center',
    flex: 0.5,
  },
  cellDownloadsMuted: {
    display: 'flex',
    alignItems: 'center',
    flex: 0.5,
    color: 'rgba(255,255,255,0.6)',
  },
  cellDate: {
    display: 'flex',
    alignItems: 'center',
    flex: 0.5,
  },
  cellDateMuted: {
    display: 'flex',
    alignItems: 'center',
    flex: 0.5,
    color: 'rgba(255,255,255,0.6)',
  },
  cellActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    textAlign: 'center',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  fileTitle: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#ffffff',
  },
  fileDesc: {
    margin: '0.25rem 0 0 0',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
  },
  folderTag: {
    padding: '0.25rem 0.75rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    color: '#ffffff',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionBtnDanger: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
  foldersContainer: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  foldersHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1.5rem',
  },
  createFolderBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'rgba(255,255,255,0.1)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  folderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  folderCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem',
    background: 'rgba(255,255,255,0.03)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  folderIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    borderRadius: '12px',
    flexShrink: 0,
  },
  folderInfo: {
    flex: 1,
    minWidth: 0,
  },
  folderName: {
    margin: '0 0 0.25rem 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  folderDesc: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  folderMeta: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
  },
  folderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  modalContent: {
    background: '#0a0a0a',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  modalBody: {
    padding: '1.5rem',
  },
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'rgba(255,255,255,0.03)',
    border: '2px dashed rgba(255,255,255,0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  dropZoneActive: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dropZoneHasFiles: {
    background: 'rgba(34, 197, 94, 0.05)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  dropText: {
    margin: '1rem 0 0.5rem 0',
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.7)',
  },
  dropHint: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
  },
  // File List in Modal
  fileListContainer: {
    marginBottom: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  fileListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
  },
  fileListSize: {
    color: 'rgba(255,255,255,0.5)',
  },
  fileList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  fileListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'background-color 0.2s ease',
  },
  fileListInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileListName: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileListMeta: {
    margin: '0.15rem 0 0 0',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
  },
  fileListRemove: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.35rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    borderRadius: '6px',
    color: '#ef4444',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Batch Progress
  batchProgressContainer: {
    marginBottom: '1rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
  },
  batchProgressHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#ffffff',
  },
  batchProgressFile: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  batchProgressBar: {
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  batchProgressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    transition: 'width 0.3s ease',
  },
  batchProgressText: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  uploadError: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#ef4444',
  },
  // Move Document Modal Styles
  moveDocInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    marginBottom: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
  },
  moveDocTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  moveDocCurrent: {
    margin: 0,
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
  },
  // Form Styles
  formGroup: {
    marginBottom: '1.25rem',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
  },
  formInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  formSelect: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none',
  },
  formHint: {
    margin: '0.5rem 0 0 0',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// Add keyframes for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default DocumentsManager;
