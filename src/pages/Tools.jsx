import { useState, useEffect, useCallback } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { ScrollReveal } from '../components/ScrollReveal';
import { LoadingBar } from '../components/ui/LoadingBar';
import { 
  FileText, 
  Folder, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Search,
  BookOpen,
  Wrench,
  FileSpreadsheet,
  ExternalLink,
  Clock,
  HardDrive
} from 'lucide-react';

// Folder icon mapping
const getFolderIcon = (folderName) => {
  const name = folderName?.toLowerCase() || '';
  if (name.includes('manual') || name.includes('guide')) return BookOpen;
  if (name.includes('tech') || name.includes('spec')) return Wrench;
  if (name.includes('brochure') || name.includes('market')) return FileSpreadsheet;
  return Folder;
};

// Document Card Component
const DocumentCard = ({ document, onDownload, index }) => {
  const handleDownload = useCallback(() => {
    onDownload(document);
  }, [document, onDownload]);

  return (
    <ScrollReveal delay={(index % 4) + 1}>
      <div style={styles.documentCard}>
        <div style={styles.documentIcon}>
          <FileText size={32} color="#ffffff" />
        </div>
        <div style={styles.documentInfo}>
          <h4 style={styles.documentTitle}>{document.title}</h4>
          {document.description && (
            <p style={styles.documentDesc}>{document.description}</p>
          )}
          <div style={styles.documentMeta}>
            <span style={styles.metaItem}>
              <HardDrive size={14} />
              {document.file_size_formatted}
            </span>
            <span style={styles.metaItem}>
              <Download size={14} />
              {document.download_count || 0} downloads
            </span>
          </div>
        </div>
        <button 
          style={styles.downloadBtn}
          onClick={handleDownload}
          title="Download PDF"
        >
          <Download size={20} />
        </button>
      </div>
    </ScrollReveal>
  );
};

// Folder Section Component
const FolderSection = ({ folder, documents, isExpanded, onToggle, onDownload }) => {
  const FolderIcon = getFolderIcon(folder.name);
  
  return (
    <div style={styles.folderSection}>
      <ScrollReveal>
        <button 
          style={styles.folderHeader}
          onClick={onToggle}
        >
          <div style={styles.folderHeaderLeft}>
            <div style={styles.folderIconLarge}>
              <FolderIcon size={28} color="#ffffff" />
            </div>
            <div>
              <h3 style={styles.folderTitle}>{folder.name}</h3>
              {folder.description && (
                <p style={styles.folderDescription}>{folder.description}</p>
              )}
            </div>
          </div>
          <div style={styles.folderHeaderRight}>
            <span style={styles.documentCount}>
              {documents.length} document{documents.length !== 1 ? 's' : ''}
            </span>
            <div style={{
              ...styles.expandIcon,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              <ChevronDown size={24} />
            </div>
          </div>
        </button>
      </ScrollReveal>
      
      <div style={{
        ...styles.folderContent,
        maxHeight: isExpanded ? '2000px' : '0',
        opacity: isExpanded ? 1 : 0,
      }}>
        <div style={styles.documentsGrid}>
          {documents.map((doc, index) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onDownload={onDownload}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Tools Page Component
const Tools = () => {
  const { folders, documents, loading, error, fetchFolders, fetchDocuments, getDocumentDownloadUrl } = useDocuments();
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  // Initial data load
  useEffect(() => {
    fetchFolders();
    fetchDocuments();
  }, [fetchFolders, fetchDocuments]);

  // Auto-expand first folder on load
  useEffect(() => {
    if (folders.length > 0 && Object.keys(expandedFolders).length === 0) {
      const firstFolderId = folders[0]?.id;
      if (firstFolderId) {
        setExpandedFolders({ [firstFolderId]: true });
      }
    }
  }, [folders, expandedFolders]);

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  }, []);

  // Handle document download
  const handleDownload = useCallback(async (document) => {
    if (downloadingId === document.id) return;
    
    setDownloadingId(document.id);
    try {
      const downloadUrl = await getDocumentDownloadUrl(document.id);
      
      // Open download in new tab
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingId(null);
    }
  }, [downloadingId, getDocumentDownloadUrl]);

  // Filter documents by search
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.folder_name?.toLowerCase().includes(query)
    );
  });

  // Group documents by folder
  const documentsByFolder = filteredDocuments.reduce((acc, doc) => {
    const folderId = doc.folder_id || 'uncategorized';
    if (!acc[folderId]) acc[folderId] = [];
    acc[folderId].push(doc);
    return acc;
  }, {});

  // Get folders that have documents (or all if searching)
  const visibleFolders = folders.filter(folder => {
    if (searchQuery) return true; // Show all folders when searching
    return documentsByFolder[folder.id]?.length > 0;
  });

  // Uncategorized documents
  const uncategorizedDocs = documentsByFolder['uncategorized'] || [];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <ScrollReveal>
          <div style={styles.heroContent}>
            <div style={styles.heroIcon}>
              <Folder size={48} color="#ffffff" />
            </div>
            <h1 style={styles.heroTitle}>Tools & Resources</h1>
            <p style={styles.heroSubtitle}>
              Download guides, manuals, technical documents, and marketing materials
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Search Section */}
      <section style={styles.searchSection}>
        <ScrollReveal delay={1}>
          <div style={styles.searchContainer}>
            <Search size={20} color="rgba(255,255,255,0.4)" />
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search documents by title, description, or folder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                style={styles.clearBtn}
                onClick={() => setSearchQuery('')}
              >
                <span>Clear</span>
              </button>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Content Section */}
      <section style={styles.content}>
        {loading && documents.length === 0 ? (
          <LoadingBar fullPage text="Loading Documents..." />
        ) : error ? (
          <div style={styles.error}>
            <p>Failed to load documents. Please try again.</p>
            <button style={styles.retryBtn} onClick={() => {
              fetchFolders();
              fetchDocuments();
            }}>
              Retry
            </button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={80} color="rgba(255,255,255,0.15)" />
            <h3>No documents found</h3>
            <p>
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Check back later for new resources"}
            </p>
          </div>
        ) : (
          <div style={styles.foldersContainer}>
            {/* Folder Sections */}
            {visibleFolders.map((folder, index) => {
              const folderDocs = documentsByFolder[folder.id] || [];
              if (folderDocs.length === 0 && !searchQuery) return null;
              
              return (
                <FolderSection
                  key={folder.id}
                  folder={folder}
                  documents={folderDocs}
                  isExpanded={expandedFolders[folder.id] || searchQuery}
                  onToggle={() => toggleFolder(folder.id)}
                  onDownload={handleDownload}
                />
              );
            })}

            {/* Uncategorized Documents */}
            {uncategorizedDocs.length > 0 && !searchQuery && (
              <FolderSection
                folder={{ 
                  id: 'uncategorized', 
                  name: 'Uncategorized',
                  description: 'Documents without a specific category'
                }}
                documents={uncategorizedDocs}
                isExpanded={expandedFolders['uncategorized']}
                onToggle={() => toggleFolder('uncategorized')}
                onDownload={handleDownload}
              />
            )}
          </div>
        )}

        {/* Total Documents Footer */}
        {!loading && filteredDocuments.length > 0 && (
          <ScrollReveal delay={2}>
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Showing {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
          </ScrollReveal>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#000000',
    paddingTop: '80px',
    color: '#ffffff',
  },
  hero: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  heroIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    borderRadius: '24px',
    marginBottom: '1.5rem',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.15)',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
    lineHeight: 1.6,
  },
  searchSection: {
    padding: '0 2rem 2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    '::placeholder': {
      color: 'rgba(255,255,255,0.4)',
    },
  },
  clearBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  content: {
    padding: '0 2rem 4rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem',
    color: 'rgba(255,255,255,0.5)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderWidth: '3px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  error: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: 'rgba(255,255,255,0.6)',
  },
  retryBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '6rem 2rem',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: '1.5rem 0 0.5rem 0',
    color: '#ffffff',
  },
  foldersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  folderSection: {
    background: 'rgba(255,255,255,0.02)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  folderHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1.25rem 1.5rem',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  folderHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  folderIconLarge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    borderRadius: '12px',
    flexShrink: 0,
  },
  folderTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#ffffff',
    textAlign: 'left',
  },
  folderDescription: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'left',
  },
  folderHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  documentCount: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
  },
  expandIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    transition: 'transform 0.3s ease, background-color 0.2s ease',
  },
  folderContent: {
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  documentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem',
    padding: '0 1.5rem 1.5rem',
  },
  documentCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.25rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  documentIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
    borderRadius: '10px',
    flexShrink: 0,
  },
  documentInfo: {
    flex: 1,
    minWidth: 0,
  },
  documentTitle: {
    margin: '0 0 0.35rem 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  documentDesc: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  documentMeta: {
    display: 'flex',
    gap: '1rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.4)',
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

export default Tools;
