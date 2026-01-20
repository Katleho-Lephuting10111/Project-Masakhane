const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const {
  createUser,
  getUser,
  getAllUsers,
  getUsersByType,
  createSwipe,
  getSwipe,
  createMatch,
  getMatchesForUser
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { name, type, location, experience, pitch, img } = req.body;

    if (!name || !type || !location || !experience || !pitch) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['farmer', 'investor'].includes(type)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const user = {
      id: uuidv4(),
      name,
      type,
      location,
      experience,
      pitch,
      img: img || 'https://via.placeholder.com/300x200?text=No+Image'
    };
    const newUser = await createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get potential matches for a user (opposite type, not swiped yet)
app.get('/api/users/:id/potential-matches', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oppositeType = user.type === 'farmer' ? 'investor' : 'farmer';
    const potentialUsers = await getUsersByType(oppositeType);

    // Filter out users already swiped on
    // For simplicity, assume we check swipes, but in production, optimize this
    const filteredUsers = [];
    for (const potentialUser of potentialUsers) {
      if (potentialUser.id !== user.id) {
        const existingSwipe = await getSwipe(user.id, potentialUser.id);
        if (!existingSwipe) {
          filteredUsers.push(potentialUser);
        }
      }
    }

    res.json(filteredUsers);
  } catch (error) {
    console.error('Error fetching potential matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Swipe on a user
app.post('/api/swipe', async (req, res) => {
  try {
    const { userId, targetUserId, action } = req.body;

    if (!userId || !targetUserId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['like', 'dislike'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot swipe on yourself' });
    }

    // Check if users exist
    const user = await getUser(userId);
    const targetUser = await getUser(targetUserId);
    if (!user || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already swiped
    const existingSwipe = await getSwipe(userId, targetUserId);
    if (existingSwipe) {
      return res.status(400).json({ error: 'Already swiped on this user' });
    }

    // Create swipe
    await createSwipe({ userId, targetUserId, action });

    // Check for match if liked
    if (action === 'like') {
      const reciprocalSwipe = await getSwipe(targetUserId, userId);
      if (reciprocalSwipe && reciprocalSwipe.action === 'like') {
        // Create match
        await createMatch({
          user1Id: userId < targetUserId ? userId : targetUserId,
          user2Id: userId < targetUserId ? targetUserId : userId
        });
        return res.json({ matched: true });
      }
    }

    res.json({ matched: false });
  } catch (error) {
    console.error('Error processing swipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get matches for a user
app.get('/api/users/:id/matches', async (req, res) => {
  try {
    const matches = await getMatchesForUser(req.params.id);
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});