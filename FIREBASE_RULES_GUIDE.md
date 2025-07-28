# Firebase Realtime Database Rules Guide

This guide explains the comprehensive Firebase Realtime Database rules for your D&D Character Creator application.

## Overview

The rules are designed to provide robust security while allowing full functionality for character creation and feedback systems. They include data validation, rate limiting, and proper indexing for optimal performance.

## Rule Structure

### 1. Global Security
```json
".read": false,
".write": false
```
- **Purpose**: Denies all read/write access by default
- **Security**: Ensures no accidental data exposure
- **Override**: Specific collections override these rules

### 2. Characters Collection

#### Access Control
```json
"characters": {
  ".read": true,
  ".write": true
}
```
- **Purpose**: Allows public read/write access to characters
- **Use Case**: Users can create, read, update, and delete their characters
- **Note**: For production, consider adding user authentication

#### Data Validation
Each character field has specific validation rules:

**Required Fields:**
- `createdAt`: Must be a positive number (timestamp)
- `updatedAt`: Must be a positive number (timestamp)

**Character Name:**
```json
"name": {
  ".validate": "newData.isString() && newData.val().length <= 100"
}
```
- Maximum 100 characters
- Must be a string

**Ability Scores:**
```json
"abilityScores": {
  "strength": {
    ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 30 || newData.val() == null"
  }
}
```
- Range: 1-30 (D&D 5e limits)
- Can be null (optional)

**Level Validation:**
```json
"level": {
  ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 20 || newData.val() == null"
}
```
- Range: 1-20 (D&D 5e level cap)
- Can be null (optional)

**Wealth Validation:**
```json
"wealth": {
  "platinum": {
    ".validate": "newData.isNumber() && newData.val() >= 0 || newData.val() == null"
  }
}
```
- Non-negative numbers only
- Can be null (optional)

### 3. Feedback Collection

#### Access Control
```json
"feedback": {
  ".read": true,
  ".write": true
}
```
- **Purpose**: Public feedback system
- **Use Case**: Users can submit and view community feedback

#### Required Fields
```json
".validate": "newData.hasChildren(['feedback', 'upvotes', 'upvotedBy', 'createdAt', 'updatedAt'])"
```
- All feedback entries must have these core fields

#### Feedback Content
```json
"feedback": {
  ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 1000"
}
```
- Non-empty string
- Maximum 1000 characters

#### Browser Information
```json
"browserInfo": {
  "name": {
    ".validate": "newData.isString() || newData.val() == null"
  },
  "isMobile": {
    ".validate": "newData.isBoolean() || newData.val() == null"
  }
}
```
- Optional browser detection data
- Helps with troubleshooting

#### Upvote System
```json
"upvotes": {
  ".validate": "newData.isNumber() && newData.val() >= 0"
},
"upvotedBy": {
  ".validate": "newData.isArray()"
}
```
- Non-negative vote count
- Array of user identifiers who upvoted

### 4. Rate Limiting

#### Feedback Rate Limiting
```json
"rateLimits": {
  "feedback": {
    "$ip": {
      ".read": false,
      ".write": "!data.exists() || (newData.val() - data.val()) > 60000",
      ".validate": "newData.isNumber()"
    }
  }
}
```
- **Purpose**: Prevents spam feedback submissions
- **Limit**: 1 submission per IP per minute (60,000ms)
- **Security**: Helps prevent abuse

### 5. Database Indexes

#### Character Indexes
```json
"indexes": {
  "characters": {
    "name": {
      ".indexOn": ".value"
    },
    "createdAt": {
      ".indexOn": ".value"
    },
    "updatedAt": {
      ".indexOn": ".value"
    }
  }
}
```
- **Purpose**: Optimize queries by character name and timestamps
- **Performance**: Faster sorting and filtering

#### Feedback Indexes
```json
"feedback": {
  "upvotes": {
    ".indexOn": ".value"
  },
  "createdAt": {
    ".indexOn": ".value"
  }
}
```
- **Purpose**: Optimize feedback sorting by popularity and date
- **Performance**: Efficient community feedback display

## Implementation Steps

### 1. Copy Rules to Firebase Console

1. Go to your Firebase Console
2. Navigate to Realtime Database
3. Click on "Rules" tab
4. Replace existing rules with the content from `firebase-rules.json`
5. Click "Publish"

### 2. Test Your Application

After implementing the rules:

1. **Test Character Creation:**
   - Create a new character
   - Verify all fields save correctly
   - Check validation errors for invalid data

2. **Test Character Updates:**
   - Edit an existing character
   - Verify timestamps update correctly
   - Test field validation

3. **Test Feedback System:**
   - Submit new feedback
   - Test upvote functionality
   - Verify rate limiting works

4. **Test Error Handling:**
   - Try submitting invalid data
   - Verify appropriate error messages
   - Check browser console for validation errors

### 3. Monitor Usage

Use Firebase Analytics to monitor:
- Database read/write operations
- Most accessed data
- Performance metrics
- Error rates

## Security Considerations

### Current Security Level
- **Public Access**: Anyone can read/write characters and feedback
- **Data Validation**: Strong validation prevents malicious data
- **Rate Limiting**: Prevents spam and abuse

### Production Recommendations

1. **Add Authentication:**
```json
"characters": {
  "$characterId": {
    ".read": "auth != null && auth.uid == data.child('userId').val()",
    ".write": "auth != null && auth.uid == data.child('userId').val()"
  }
}
```

2. **User-Specific Data:**
```json
"characters": {
  "$characterId": {
    ".validate": "newData.hasChild('userId') && newData.child('userId').val() == auth.uid"
  }
}
```

3. **Admin Access:**
```json
"feedback": {
  "$feedbackId": {
    ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
  }
}
```

## Troubleshooting

### Common Issues

1. **"Permission denied" errors:**
   - Check if rules are properly published
   - Verify collection names match exactly
   - Ensure required fields are present

2. **Validation errors:**
   - Check data types match validation rules
   - Verify field lengths are within limits
   - Ensure required fields are not null

3. **Performance issues:**
   - Verify indexes are created
   - Check query patterns
   - Monitor database usage

### Debug Mode

Enable Firebase debug logging:
```javascript
localStorage.setItem('firebase:debug', '*')
```

### Testing Rules

Use Firebase Rules Playground:
1. Go to Firebase Console
2. Navigate to Realtime Database
3. Click "Rules" tab
4. Use the "Rules Playground" feature
5. Test read/write operations with sample data

## Maintenance

### Regular Tasks

1. **Monitor Usage:**
   - Check Firebase Console metrics
   - Review error logs
   - Monitor performance

2. **Update Rules:**
   - Add new fields as needed
   - Adjust validation rules
   - Update rate limiting

3. **Security Reviews:**
   - Regular security audits
   - Update authentication rules
   - Monitor for abuse

### Backup Strategy

1. **Export Rules:**
   - Download rules from Firebase Console
   - Store in version control
   - Document changes

2. **Data Backup:**
   - Regular database exports
   - Test restore procedures
   - Monitor data integrity

## Support

For issues with these rules:
1. Check Firebase documentation
2. Review error messages in browser console
3. Test in Firebase Rules Playground
4. Consult Firebase support if needed

---

**Note**: These rules are designed for a public D&D character creator. For production use with sensitive data, implement proper authentication and more restrictive access controls. 