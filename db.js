const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLES = {
  USERS: 'MasakhaneUsers',
  SWIPES: 'MasakhaneSwipes',
  MATCHES: 'MasakhaneMatches'
};

// User operations
async function createUser(user) {
  const params = {
    TableName: TABLES.USERS,
    Item: {
      id: user.id,
      name: user.name,
      type: user.type, // 'farmer' or 'investor'
      location: user.location,
      experience: user.experience,
      pitch: user.pitch,
      img: user.img,
      createdAt: new Date().toISOString()
    }
  };
  await dynamoDB.put(params).promise();
  return user;
}

async function getUser(userId) {
  const params = {
    TableName: TABLES.USERS,
    Key: { id: userId }
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

async function getAllUsers() {
  const params = {
    TableName: TABLES.USERS
  };
  const result = await dynamoDB.scan(params).promise();
  return result.Items;
}

async function getUsersByType(type) {
  const params = {
    TableName: TABLES.USERS,
    FilterExpression: '#type = :type',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { ':type': type }
  };
  const result = await dynamoDB.scan(params).promise();
  return result.Items;
}

// Swipe operations
async function createSwipe(swipe) {
  const params = {
    TableName: TABLES.SWIPES,
    Item: {
      id: `${swipe.userId}_${swipe.targetUserId}`,
      userId: swipe.userId,
      targetUserId: swipe.targetUserId,
      action: swipe.action, // 'like' or 'dislike'
      timestamp: new Date().toISOString()
    }
  };
  await dynamoDB.put(params).promise();
  return swipe;
}

async function getSwipe(userId, targetUserId) {
  const params = {
    TableName: TABLES.SWIPES,
    Key: { id: `${userId}_${targetUserId}` }
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

// Match operations
async function createMatch(match) {
  const params = {
    TableName: TABLES.MATCHES,
    Item: {
      id: `${match.user1Id}_${match.user2Id}`,
      user1Id: match.user1Id,
      user2Id: match.user2Id,
      timestamp: new Date().toISOString()
    }
  };
  await dynamoDB.put(params).promise();
  return match;
}

async function getMatchesForUser(userId) {
  const params = {
    TableName: TABLES.MATCHES,
    FilterExpression: 'user1Id = :userId OR user2Id = :userId',
    ExpressionAttributeValues: { ':userId': userId }
  };
  const result = await dynamoDB.scan(params).promise();
  return result.Items;
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  getUsersByType,
  createSwipe,
  getSwipe,
  createMatch,
  getMatchesForUser,
  TABLES
};