import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  paddingY?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  accordionSpacing?: number;
  expandIconColor?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  subtitle,
  items,
  paddingY = 8,
  backgroundColor,
  backgroundImage,
  accordionSpacing = 2,
  expandIconColor
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        py: paddingY,
        backgroundColor: backgroundColor || 'transparent',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Container maxWidth="lg">
        {title && (
          <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {subtitle}
          </Typography>
        )}

        {items.map((item, index) => (
          <Accordion
            key={item.id}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: accordionSpacing }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: expandIconColor }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default FAQSection;
