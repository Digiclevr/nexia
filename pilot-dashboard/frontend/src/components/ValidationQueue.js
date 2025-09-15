import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const ValidationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [publishingItems, setPublishingItems] = useState([]);

  useEffect(() => {
    fetchQueue();
  }, [filter]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/validation/queue?status=${filter}`);
      const data = await response.json();
      setQueue(data);
    } catch (error) {
      console.error('Failed to fetch validation queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (itemId, status, feedback = '') => {
    try {
      const response = await fetch(`/api/validation/${itemId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, feedback })
      });

      if (response.ok) {
        fetchQueue();
      }
    } catch (error) {
      console.error('Failed to review content:', error);
    }
  };

  const handleBatchReview = async (status, feedback = '') => {
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch('/api/validation/batch/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedItems, status, feedback })
      });

      if (response.ok) {
        setSelectedItems([]);
        fetchQueue();
      }
    } catch (error) {
      console.error('Failed to batch review content:', error);
    }
  };

  const handleEditContent = (item) => {
    setEditingItem(item.id);
    setEditedContent(item.content);
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const response = await fetch(`/api/validation/${itemId}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editedContent })
      });

      if (response.ok) {
        setEditingItem(null);
        setEditedContent('');
        fetchQueue();
      }
    } catch (error) {
      console.error('Failed to save content edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditedContent('');
  };

  const handlePublish = async (itemId) => {
    setPublishingItems(prev => [...prev, itemId]);
    
    try {
      const response = await fetch(`/api/validation/${itemId}/publish`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Content published successfully!${result.url ? '\nURL: ' + result.url : ''}`);
        fetchQueue();
      } else {
        alert(`Failed to publish: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to publish content:', error);
      alert('Failed to publish content');
    } finally {
      setPublishingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getContentPreview = (content, itemId) => {
    if (expandedItems.includes(itemId)) {
      return content;
    }
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };

  const getContentTypeColor = (type) => {
    const colors = {
      linkedin_post: '#0077B5',
      twitter_thread: '#1DA1F2',
      linkedin_dm: '#0077B5',
      email: '#EA4335',
      blog_post: '#FF6B6B'
    };
    return colors[type] || '#64748b';
  };

  return (
    <div className="validation-queue">
      <div className="card-header">
        <h1 className="card-title">Content Validation Queue</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="published">Published</option>
          </select>
          
          {selectedItems.length > 0 && filter === 'pending' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary btn-small"
                onClick={() => handleBatchReview('approved')}
              >
                Approve ({selectedItems.length})
              </button>
              <button 
                className="btn btn-secondary btn-small"
                onClick={() => handleBatchReview('rejected')}
                style={{ color: 'var(--error)' }}
              >
                Reject ({selectedItems.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading validation queue...
        </div>
      ) : queue.length === 0 ? (
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="validation-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
            <h3>No content in {filter} queue</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {filter === 'pending' 
                ? 'Agents haven\'t submitted any content for validation yet'
                : `No ${filter} content found`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {queue.map(item => (
                <div 
                  key={item.id} 
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    backgroundColor: selectedItems.includes(item.id) ? 'var(--surface-hover)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {filter === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span 
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: getContentTypeColor(item.content_type),
                              color: 'white',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {item.content_type.replace('_', ' ').toUpperCase()}
                          </span>
                          <strong>{item.agent_name}</strong>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          Submitted {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`status ${item.status}`}>
                      <span className="status-dot"></span>
                      {item.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    {editingItem === item.id ? (
                      <div>
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '200px',
                            padding: '1rem',
                            border: '2px solid var(--primary)',
                            borderRadius: '0.375rem',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            lineHeight: '1.5',
                            resize: 'vertical'
                          }}
                          placeholder="Edit content here..."
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => handleSaveEdit(item.id)}
                          >
                            Save Changes
                          </button>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        backgroundColor: 'var(--surface-hover)', 
                        padding: '1rem', 
                        borderRadius: '0.375rem',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap',
                        position: 'relative'
                      }}>
                        {getContentPreview(item.content, item.id)}
                        {item.content.length > 200 && (
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            style={{
                              position: 'absolute',
                              bottom: '0.5rem',
                              right: '0.5rem',
                              background: 'var(--primary)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            {expandedItems.includes(item.id) ? '📄 Show Less' : '📄 Show Full'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {item.feedback && (
                    <div style={{ 
                      backgroundColor: item.status === 'approved' ? '#dcfce7' : '#fef2f2',
                      color: item.status === 'approved' ? '#166534' : '#dc2626',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      marginBottom: '1rem'
                    }}>
                      <strong>Feedback:</strong> {item.feedback}
                    </div>
                  )}

                  {item.scheduled_for && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <strong>Scheduled for:</strong> {new Date(item.scheduled_for).toLocaleString()}
                    </div>
                  )}

                  {item.published_at && (
                    <div style={{ fontSize: '0.875rem', color: '#10b981', marginBottom: '1rem' }}>
                      <strong>Published:</strong> {new Date(item.published_at).toLocaleString()}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {filter === 'pending' && (
                      <>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleReview(item.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => {
                            const feedback = prompt('Rejection reason (optional):');
                            handleReview(item.id, 'rejected', feedback || '');
                          }}
                          style={{ color: 'var(--error)' }}
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleEditContent(item)}
                          disabled={editingItem === item.id}
                        >
                          Edit
                        </button>
                      </>
                    )}
                    
                    {filter === 'approved' && (
                      <button
                        className="btn btn-success btn-small"
                        onClick={() => handlePublish(item.id)}
                        disabled={publishingItems.includes(item.id)}
                      >
                        {publishingItems.includes(item.id) ? '📤 Publishing...' : '📤 Publish'}
                      </button>
                    )}
                    
                    {item.content.length <= 200 && (
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => {
                          navigator.clipboard.writeText(item.content);
                          alert('Content copied to clipboard!');
                        }}
                      >
                        📋 Copy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationQueue;