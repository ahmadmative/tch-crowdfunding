# React Quill Setup Instructions

## Installation

To use the Support Mail Template feature with rich text editing, you need to install React Quill:

```bash
npm install react-quill quill
```

## Features Included

1. **Rich Text Editor**: Full-featured WYSIWYG editor with formatting options
2. **Template Variables**: Support for dynamic variables like {{firstName}}, {{lastName}}, etc.
3. **Create/Edit/View**: Complete CRUD operations for email templates
4. **Professional UI**: Modern, responsive interface with proper styling

## Usage

- Navigate to Support Mail Templates
- Create new templates with rich text formatting
- Use template variables for dynamic content
- Edit existing templates with full formatting preserved
- View templates in read-only mode

## Template Variables

The following variables can be used in templates:
- `{{firstName}}` - User's first name
- `{{lastName}}` - User's last name  
- `{{email}}` - User's email address
- `{{subject}}` - Original ticket subject
- `{{ticketId}}` - Support ticket ID
- `{{date}}` - Current date

These will be automatically replaced when emails are sent.
