# Support Ticket Reply History System

## Overview

The reply history system maintains a complete conversation thread for each support ticket, allowing administrators to track all communications and providing users with a seamless support experience.

## Backend Implementation

### Database Schema

#### SupportReply Schema (`server/models/supportReplySchema.js`)
```javascript
{
  supportTicketId: ObjectId (ref: Support),
  sender: String (enum: ["admin", "user"]),
  senderName: String,
  senderEmail: String,
  subject: String,
  message: String,
  isHtml: Boolean,
  templateId: ObjectId (ref: SupportMailTemplate),
  readAt: Date,
  timestamps: true
}
```

#### Enhanced Support Schema
```javascript
{
  // ... existing fields
  status: String (default: "new"),
  lastReplyAt: Date,
  replyCount: Number (default: 0),
  timestamps: true
}
```

### API Endpoints

#### Reply Management
- `POST /support/:supportTicketId/reply` - Send a reply to a ticket
- `GET /support/:supportTicketId/replies` - Get all replies for a ticket
- `GET /support/:id/with-replies` - Get ticket with all replies
- `PUT /support/reply/:replyId/read` - Mark a reply as read

#### Request/Response Examples

**Send Reply Request:**
```json
{
  "subject": "Re: Your Support Request",
  "message": "Thank you for contacting us...",
  "senderName": "Admin",
  "senderEmail": "admin@support.com",
  "isHtml": true,
  "templateId": "template_id_here"
}
```

**Get Ticket with Replies Response:**
```json
{
  "ticket": { /* support ticket data */ },
  "replies": [
    {
      "_id": "reply_id",
      "supportTicketId": "ticket_id",
      "sender": "admin",
      "senderName": "Admin",
      "subject": "Re: Your Support Request",
      "message": "Thank you for contacting us...",
      "isHtml": true,
      "templateId": { "_id": "template_id", "subject": "Template Name" },
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "totalReplies": 1
}
```

## Frontend Implementation

### Enhanced SupportDetails Component

#### Key Features
1. **Conversation Thread View**: Messages displayed chronologically
2. **Visual Sender Distinction**: Different styling for admin vs user messages
3. **Rich Content Support**: HTML and plain text rendering
4. **Template Tracking**: Shows when templates were used
5. **Attachment Display**: Inline display of images and files
6. **Read Receipts**: Shows when messages were read
7. **Real-time Updates**: Refreshes after sending replies

#### Component Structure
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main Content - Conversation Thread */}
  <div className="lg:col-span-2">
    {/* Ticket Header */}
    {/* Original Message */}
    {/* Replies Thread */}
    {/* Reply Button */}
  </div>
  
  {/* Sidebar - Ticket Information */}
  <div className="lg:col-span-1">
    {/* Sender Information */}
    {/* Ticket Details */}
    {/* Quick Stats */}
  </div>
</div>
```

#### Message Types
1. **Original Ticket**: Blue avatar, gray background
2. **Admin Replies**: Green avatar, green background with admin badge
3. **User Replies**: Blue avatar, gray background
4. **Template Usage**: Special badge indicating template was used

### Enhanced ReplyModal Integration

#### Template Tracking
- Records which template was used for the reply
- Passes template ID to backend for history tracking
- Maintains template variable replacement functionality

#### Rich Text Support
- Detects HTML content and stores `isHtml` flag
- Preserves formatting in conversation history
- Provides toggle between rich text and plain text editing

## Data Flow

### Sending a Reply
1. User opens ReplyModal from SupportDetails
2. User selects template (optional) or writes custom message
3. Template variables are replaced automatically
4. ReplyModal calls `handleSendReply` with message details
5. SupportDetails sends POST request to `/support/:id/reply`
6. Backend creates SupportReply record
7. Backend sends email to ticket sender
8. Backend updates Support ticket (status, lastReplyAt, replyCount)
9. Frontend refreshes conversation thread
10. Modal closes and success message displays

### Loading Conversation History
1. SupportDetails component loads
2. Calls `/support/:id/with-replies` endpoint
3. Backend fetches Support ticket and related SupportReply records
4. Frontend renders conversation thread chronologically
5. Each message shows sender, timestamp, and content
6. Special styling for admin vs user messages

## Features

### Visual Conversation Flow
- **Chronological Order**: Messages ordered by creation time
- **Sender Identification**: Clear visual distinction between admin and user
- **Message Metadata**: Timestamps, read receipts, template usage
- **Rich Content**: HTML rendering for formatted messages
- **Attachment Support**: Inline display of images and downloadable files

### Admin Tools
- **Reply Statistics**: Count of total, admin, and user replies
- **Template Tracking**: See which templates were used
- **Status Management**: Ticket status updates based on reply activity
- **Read Receipts**: Track when messages are read

### Email Integration
- **Automatic Emails**: Replies sent via email to ticket sender
- **HTML Support**: Rich text replies rendered in emails
- **Template Integration**: Template content sent via email
- **Delivery Tracking**: Email success/failure status recorded

## Database Considerations

### Indexes
- `supportTicketId + createdAt` for efficient conversation loading
- `sender` for filtering by admin/user replies
- `readAt` for tracking read status

### Performance
- Replies are loaded with tickets to minimize database calls
- Template information populated for display
- Efficient querying with proper indexing

## Security & Validation

### Backend Validation
- Verify support ticket exists before creating reply
- Sanitize HTML content for security
- Validate required fields (subject, message, sender info)
- Check authentication for admin operations

### Frontend Validation
- Prevent empty submissions
- HTML content detection for proper storage
- Template variable validation
- User feedback for all operations

## Future Enhancements

### Potential Improvements
1. **Real-time Updates**: WebSocket integration for live conversation updates
2. **File Attachments**: Support for reply attachments
3. **Message Threading**: Sub-conversations within tickets
4. **Auto-responses**: Automated replies based on keywords
5. **Collaboration**: Multiple admin support with assignment
6. **Analytics**: Response time tracking and performance metrics
7. **Export**: Conversation export to PDF/Email
8. **Search**: Full-text search across conversation history

The reply history system provides a complete communication trail while maintaining the enhanced template and rich text functionality, creating a professional support ticket management experience.
