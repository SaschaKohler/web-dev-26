import React, { useState } from 'react';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Typography,
  Stack,
  Tooltip
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Title,
  Code,
  Preview,
  Edit
} from '@mui/icons-material';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: number;
  fullWidth?: boolean;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  label = 'Inhalt',
  placeholder = 'HTML-Inhalt eingeben...',
  minHeight = 150,
  fullWidth = true
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const insertTag = (tag: string, attrs?: string) => {
    const textarea = document.getElementById('wysiwyg-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText = '';
    switch (tag) {
      case 'bold':
        newText = `<strong>${selectedText || 'Text'}</strong>`;
        break;
      case 'italic':
        newText = `<em>${selectedText || 'Text'}</em>`;
        break;
      case 'underline':
        newText = `<u>${selectedText || 'Text'}</u>`;
        break;
      case 'strikethrough':
        newText = `<s>${selectedText || 'Text'}</s>`;
        break;
      case 'h1':
        newText = `<h1>${selectedText || 'Überschrift'}</h1>`;
        break;
      case 'h2':
        newText = `<h2>${selectedText || 'Überschrift'}</h2>`;
        break;
      case 'h3':
        newText = `<h3>${selectedText || 'Überschrift'}</h3>`;
        break;
      case 'p':
        newText = `<p>${selectedText || 'Absatz'}</p>`;
        break;
      case 'ul':
        newText = `<ul>\n  <li>${selectedText || 'Listeneintrag'}</li>\n</ul>`;
        break;
      case 'ol':
        newText = `<ol>\n  <li>${selectedText || 'Listeneintrag'}</li>\n</ol>`;
        break;
      case 'link':
        newText = `<a href="${attrs || '#'}">${selectedText || 'Link Text'}</a>`;
        break;
      case 'br':
        newText = '<br />';
        break;
      case 'code':
        newText = `<code>${selectedText || 'Code'}</code>`;
        break;
      default:
        newText = selectedText || '';
    }

    const newValue = beforeText + newText + afterText;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    active?: boolean;
  }> = ({ icon, tooltip, onClick, active }) => (
    <Tooltip title={tooltip}>
      <ToggleButton
        value={tooltip}
        selected={active}
        onClick={onClick}
        size="small"
        sx={{ minWidth: 40 }}
      >
        {icon}
      </ToggleButton>
    </Tooltip>
  );

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          {label}
        </Typography>
      )}

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box
          sx={{
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'background.default',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5
          }}
        >
          <Stack direction="row" spacing={0.5}>
            <ToolbarButton
              icon={<FormatBold />}
              tooltip="Fett"
              onClick={() => insertTag('bold')}
            />
            <ToolbarButton
              icon={<FormatItalic />}
              tooltip="Kursiv"
              onClick={() => insertTag('italic')}
            />
            <ToolbarButton
              icon={<FormatUnderlined />}
              tooltip="Unterstrichen"
              onClick={() => insertTag('underline')}
            />
            <ToolbarButton
              icon={<FormatStrikethrough />}
              tooltip="Durchgestrichen"
              onClick={() => insertTag('strikethrough')}
            />
          </Stack>

          <Box sx={{ width: 1, height: '1px', backgroundColor: 'divider', my: 0.5 }} />

          <Stack direction="row" spacing={0.5}>
            <ToolbarButton
              icon={<Title />}
              tooltip="Überschrift 1"
              onClick={() => insertTag('h1')}
            />
            <ToolbarButton
              icon={<Title fontSize="small" />}
              tooltip="Überschrift 2"
              onClick={() => insertTag('h2')}
            />
            <ToolbarButton
              icon={<Title sx={{ fontSize: 14 }} />}
              tooltip="Überschrift 3"
              onClick={() => insertTag('h3')}
            />
          </Stack>

          <Box sx={{ width: 1, height: '1px', backgroundColor: 'divider', my: 0.5 }} />

          <Stack direction="row" spacing={0.5}>
            <ToolbarButton
              icon={<FormatListBulleted />}
              tooltip="Aufzählung"
              onClick={() => insertTag('ul')}
            />
            <ToolbarButton
              icon={<FormatListNumbered />}
              tooltip="Nummerierung"
              onClick={() => insertTag('ol')}
            />
            <ToolbarButton
              icon={<Link />}
              tooltip="Link"
              onClick={() => {
                const url = prompt('URL eingeben:', 'https://');
                if (url) insertTag('link', url);
              }}
            />
            <ToolbarButton
              icon={<Code />}
              tooltip="Code"
              onClick={() => insertTag('code')}
            />
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="edit">
              <Edit fontSize="small" sx={{ mr: 0.5 }} />
              HTML
            </ToggleButton>
            <ToggleButton value="preview">
              <Preview fontSize="small" sx={{ mr: 0.5 }} />
              Vorschau
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Editor Area */}
        {viewMode === 'edit' ? (
          <TextField
            id="wysiwyg-textarea"
            multiline
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '& fieldset': {
                  border: 'none'
                }
              },
              '& .MuiInputBase-root': {
                minHeight,
                alignItems: 'flex-start'
              }
            }}
          />
        ) : (
          <Box
            sx={{
              p: 2,
              minHeight,
              backgroundColor: 'background.paper',
              '& h1': { typography: 'h4', mb: 2 },
              '& h2': { typography: 'h5', mb: 2 },
              '& h3': { typography: 'h6', mb: 1.5 },
              '& p': { typography: 'body1', mb: 1.5 },
              '& ul': { pl: 3, mb: 1.5 },
              '& ol': { pl: 3, mb: 1.5 },
              '& li': { typography: 'body1', mb: 0.5 },
              '& a': { color: 'primary.main', textDecoration: 'underline' },
              '& strong': { fontWeight: 700 },
              '& em': { fontStyle: 'italic' },
              '& code': {
                backgroundColor: 'action.hover',
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5,
                fontFamily: 'monospace'
              }
            }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        HTML-Tags werden unterstützt: &lt;h1&gt;-&lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;u&gt;, &lt;s&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;br&gt;, &lt;code&gt;
      </Typography>
    </Box>
  );
};

export default WysiwygEditor;
