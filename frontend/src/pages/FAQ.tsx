import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import DynamicPage from '../components/DynamicPage';

interface FAQItem {
  question: string;
  answer: string;
}

function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'Was ist Lebens- und Sozialberatung?',
      answer: 'Lebens- und Sozialberatung ist eine professionelle Unterstützung bei der Bewältigung von Herausforderungen im Alltag, in Beziehungen oder bei persönlichen Krisen. Sie bietet einen geschützten Raum für Reflexion und Entwicklung.'
    },
    {
      question: 'Wie läuft eine Beratungssitzung ab?',
      answer: 'Eine Beratungssitzung dauert in der Regel 50-60 Minuten. In einem vertraulichen Gespräch besprechen wir Ihre Anliegen und erarbeiten gemeinsam Lösungsansätze. Die erste Sitzung dient dem gegenseitigen Kennenlernen und der Klärung Ihrer Ziele.'
    },
    {
      question: 'Wie viele Sitzungen sind notwendig?',
      answer: 'Die Anzahl der Sitzungen hängt von Ihrem individuellen Anliegen ab. Manche Themen können in wenigen Gesprächen geklärt werden, andere benötigen eine längerfristige Begleitung. Wir besprechen dies gemeinsam und passen den Prozess an Ihre Bedürfnisse an.'
    },
    {
      question: 'Was kostet eine Beratungssitzung?',
      answer: 'Die Kosten für eine Einzelsitzung (50-60 Minuten) betragen [Preis]. Paarberatung und andere Formate haben unterschiedliche Preise. Genaue Informationen finden Sie auf unserer Leistungsseite oder kontaktieren Sie uns direkt.'
    },
    {
      question: 'Ist die Beratung vertraulich?',
      answer: 'Ja, absolute Vertraulichkeit ist die Grundlage unserer Arbeit. Alle Gespräche unterliegen der gesetzlichen Verschwiegenheitspflicht. Ihre persönlichen Informationen werden nicht an Dritte weitergegeben.'
    },
    {
      question: 'Wie kann ich einen Termin vereinbaren?',
      answer: 'Sie können ganz einfach online über unser Buchungssystem einen Termin vereinbaren oder uns telefonisch bzw. per E-Mail kontaktieren. Wir melden uns zeitnah bei Ihnen zurück.'
    },
    {
      question: 'Bieten Sie auch Online-Beratung an?',
      answer: 'Ja, wir bieten auch Online-Beratung via Videocall an. Dies ermöglicht Ihnen eine flexible Termingestaltung von zu Hause aus. Die Qualität der Beratung bleibt dabei gleich hoch.'
    },
    {
      question: 'Was ist der Unterschied zwischen Beratung und Psychotherapie?',
      answer: 'Lebens- und Sozialberatung konzentriert sich auf aktuelle Lebenssituationen und die Entwicklung von Lösungsstrategien. Psychotherapie behandelt psychische Erkrankungen und ist oft längerfristig angelegt. Bei Bedarf können wir Sie an entsprechende Therapeuten vermitteln.'
    }
  ];

  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
          Häufig gestellte Fragen
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Hier finden Sie Antworten auf die häufigsten Fragen zur Lebens- und Sozialberatung.
        </Typography>

        {faqItems.map((item, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
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

        <Box sx={{ mt: 6, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Ihre Frage ist nicht dabei?
          </Typography>
          <Typography variant="body1">
            Kontaktieren Sie uns gerne direkt. Wir beantworten Ihre Fragen persönlich und unverbindlich.
          </Typography>
        </Box>
      </Box>
    </Container>
  );

  return <DynamicPage slug="faq" fallbackContent={fallbackContent} />;
}

export default FAQ;