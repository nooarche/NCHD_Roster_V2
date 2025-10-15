import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Header } from './components/organisms/Header';
import { Navigation } from './components/organisms/Navigation';
import { Footer } from './components/organisms/Footer';
import { DashboardView } from './components/views/DashboardView';
import { PostsView } from './components/views/PostsView';
import { RosterView } from './components/views/RosterView';
import { Modal } from './components/molecules/Modal';
import { AlertBanner } from './components/molecules/AlertBanner';
import { PostForm } from './components/organisms/PostForm';
import { ShiftForm } from './components/organisms/ShiftForm';
import { CSVImportModal } from './components/organisms/CSVImportModal';
import { postsApi, rosterApi } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  
  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingShift, setEditingShift] = useState(null);

  // Data
  const [posts, setPosts] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [postsData, shiftsData] = await Promise.all([
        postsApi.getAll(),
        // rosterApi.getShifts(), // Uncomment when backend is ready
      ]);
      
      setPosts(postsData);
      // setShifts(shiftsData); // Uncomment when backend is ready
      
      // Mock data for now
      setShifts([
        { id: 1, name: 'DLHG 1', time: '09:00-17:00', weekIdx: 0, dayIdx: 0, type: 'Day Call' },
        { id: 2, name: 'MHID', time: '09:00-17:00', weekIdx: 0, dayIdx: 1, type: 'Day Call' },
        { id: 3, name: 'Gorey', time: '17:00-09:00', weekIdx: 0, dayIdx: 5, type: 'Night Call' },
      ]);
    } catch (error) {
      showNotification('Failed to load data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered posts based on search
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.site?.toLowerCase().includes(query) ||
      p.grade?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  // Post handlers
  const handleSavePost = async (postData) => {
    try {
      if (editingPost) {
        const updatedPost = await postsApi.update(editingPost.id, postData);
        setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p));
        showNotification('Post updated successfully', 'success');
      } else {
        const newPost = await postsApi.create(postData);
        setPosts([...posts, newPost]);
        showNotification('Post created successfully', 'success');
      }
      setShowPostModal(false);
      setEditingPost(null);
    } catch (error) {
      showNotification('Failed to save post: ' + error.message, 'error');
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postsApi.delete(postId);
      setPosts(posts.filter(p => p.id !== postId));
      showNotification('Post deleted', 'success');
    } catch (error) {
      showNotification('Failed to delete post: ' + error.message, 'error');
    }
  };

  // Shift handlers
  const handleSaveShift = async (shiftData) => {
    try {
      if (editingShift) {
        // Update existing shift
        const updatedShift = await rosterApi.updateShift(editingShift.id, shiftData);
        setShifts(shifts.map(s => s.id === editingShift.id ? updatedShift : s));
        showNotification('Shift updated successfully', 'success');
      } else {
        // Create new shift
        const newShift = {
          id: Date.now(),
          name: shiftData.user_name,
          time: `${shiftData.start_time}-${shiftData.end_time}`,
          weekIdx: 0,
          dayIdx: 0,
          type: shiftData.shift_type,
        };
        setShifts([...shifts, newShift]);
        showNotification('Shift created successfully', 'success');
      }
      setShowShiftModal(false);
      setEditingShift(null);
    } catch (error) {
      showNotification('Failed to save shift: ' + error.message, 'error');
      throw error;
    }
  };

  const handleCSVImport = (rows) => {
    const newShifts = rows.map((row, idx) => ({
      id: Date.now() + idx,
      name: row['Staff'] || row['User'] || row['Name'] || 'Unknown',
      time: `${row['Start Time'] || '09:00'}-${row['End Time'] || '17:00'}`,
      weekIdx: 0,
      dayIdx: idx % 7,
      type: row['Type'] || 'Day Call',
    }));
    setShifts([...shifts, ...newShifts]);
    showNotification(`Imported ${rows.length} shifts from CSV`, 'success');
  };

  const handleShiftMove = useCallback((shift, newWeekIdx, newDayIdx) => {
    setShifts(prevShifts => prevShifts.map(s => 
      s.id === shift.id 
        ? { ...s, weekIdx: newWeekIdx, dayIdx: newDayIdx }
        : s
    ));
    showNotification('Shift reassigned', 'success');
  }, []);

  const handleShiftClick = (shift) => {
    setEditingShift(shift);
    setShowShiftModal(true);
  };

  const handleGenerateRoster = async () => {
    try {
      showNotification('Generating roster...', 'info');
      // const result = await rosterApi.generateRoster({ month: 1, year: 2026 });
      // setShifts(result.shifts);
      showNotification('Roster generated successfully', 'success');
    } catch (error) {
      showNotification('Failed to generate roster: ' + error.message, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
        <Header 
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onNewShift={() => {
            setEditingShift(null);
            setShowShiftModal(true);
          }}
        />

        <Navigation 
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {notification && (
            <div className="mb-6">
              <AlertBanner
                type={notification.type}
                message={notification.message}
                onDismiss={() => setNotification(null)}
              />
            </div>
          )}

          {showAlert && (
            <div className="mb-6">
              <AlertBanner
                type="warning"
                message="3 shifts need to be assigned for next week. EWTD compliance check required."
                onDismiss={() => setShowAlert(false)}
              />
            </div>
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              posts={posts}
              shifts={shifts}
              onShiftMove={handleShiftMove}
              onShiftClick={handleShiftClick}
            />
          )}

          {currentView === 'posts' && (
            <PostsView
              posts={filteredPosts}
              onCreatePost={() => {
                setEditingPost(null);
                setShowPostModal(true);
              }}
              onEditPost={(post) => {
                setEditingPost(post);
                setShowPostModal(true);
              }}
              onDeletePost={handleDeletePost}
            />
          )}

          {currentView === 'roster' && (
            <RosterView
              shifts={shifts}
              onImportCSV={() => setShowCSVModal(true)}
              onGenerateRoster={handleGenerateRoster}
              onShiftMove={handleShiftMove}
              onShiftClick={handleShiftClick}
            />
          )}
        </main>

        <Footer />

        {/* Modals */}
        <Modal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setEditingPost(null);
          }}
          title={editingPost ? 'Edit Post' : 'Create New Post'}
          size="large"
        >
          <PostForm
            post={editingPost}
            onSave={handleSavePost}
            onCancel={() => {
              setShowPostModal(false);
              setEditingPost(null);
            }}
          />
        </Modal>

        <Modal
          isOpen={showShiftModal}
          onClose={() => {
            setShowShiftModal(false);
            setEditingShift(null);
          }}
          title={editingShift ? 'Edit Shift' : 'Create New Shift'}
          size="medium"
        >
          <ShiftForm
            shift={editingShift}
            posts={posts}
            onSave={handleSaveShift}
            onCancel={() => {
              setShowShiftModal(false);
              setEditingShift(null);
            }}
          />
        </Modal>

        <CSVImportModal
          isOpen={showCSVModal}
          onClose={() => setShowCSVModal(false)}
          onImport={handleCSVImport}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
