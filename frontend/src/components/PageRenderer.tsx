import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './sections/HeroSection';
import CardGrid from './sections/CardGrid';
import Timeline from './sections/Timeline';
import ImageGallery from './sections/ImageGallery';
import VideoSection from './sections/VideoSection';
import FeatureSection from './sections/FeatureSection';
import CTASection from './sections/CTASection';
import TestimonialSection from './sections/TestimonialSection';
import FAQSection from './sections/FAQSection';

interface ContentBlock {
  id: number;
  block_type: string;
  order: number;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  image_alt?: string;
  video_url?: string;
  link_url?: string;
  link_text?: string;
  link_target?: string;
  icon_name?: string;
  icon_color?: string;
  metadata?: any;
  is_visible: boolean;
}

interface Section {
  id: number;
  section_type: string;
  title?: string;
  subtitle?: string;
  order: number;
  background_type: string;
  background_color?: string;
  background_image?: string;
  padding_top: number;
  padding_bottom: number;
  is_full_width: boolean;
  is_visible: boolean;
  content_blocks: ContentBlock[];
}

interface PageLayout {
  id: number;
  name: string;
  display_name: string;
  layout_type: string;
  description?: string;
  sections: Section[];
}

interface PageRendererProps {
  layout: PageLayout;
}

const PageRenderer: React.FC<PageRendererProps> = ({ layout }) => {
  const renderSection = (section: Section) => {
    if (!section.is_visible) return null;

    const blocks = section.content_blocks.filter(b => b.is_visible);
    const paddingY = (section.padding_top + section.padding_bottom) / 16;

    switch (section.section_type) {
      case 'hero':
        const heroButton = blocks.find(b => b.block_type === 'button');
        return (
          <HeroSection
            key={section.id}
            title={section.title || ''}
            subtitle={section.subtitle}
            backgroundImage={section.background_image}
            backgroundColor={section.background_color}
            ctaText={heroButton?.title}
            ctaLink={heroButton?.link_url}
            height="70vh"
          />
        );

      case 'features':
        const features = blocks
          .filter(b => b.block_type === 'feature')
          .map(b => ({
            id: b.id,
            title: b.title,
            content: b.content,
            iconName: b.icon_name,
            iconColor: b.icon_color
          }));
        return (
          <FeatureSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            features={features}
            paddingY={paddingY}
          />
        );

      case 'cards':
        const cards = blocks
          .filter(b => b.block_type === 'card')
          .map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            content: b.content,
            imageUrl: b.image_url,
            linkUrl: b.link_url,
            linkText: b.link_text
          }));
        return (
          <CardGrid
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            cards={cards}
            paddingY={paddingY}
          />
        );

      case 'timeline':
        const timelineItems = blocks
          .filter(b => b.block_type === 'timeline_item')
          .map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            content: b.content,
            date: b.subtitle
          }));
        return (
          <Timeline
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={timelineItems}
            paddingY={paddingY}
          />
        );

      case 'gallery':
        const images = blocks
          .filter(b => b.block_type === 'image')
          .map(b => ({
            id: b.id,
            url: b.image_url || '',
            alt: b.image_alt || b.title,
            title: b.title
          }));
        return (
          <ImageGallery
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            images={images}
            paddingY={paddingY}
          />
        );

      case 'video':
        const videoBlock = blocks.find(b => b.block_type === 'video');
        if (!videoBlock?.video_url) return null;
        return (
          <VideoSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            videoUrl={videoBlock.video_url}
            paddingY={paddingY}
          />
        );

      case 'testimonials':
        const testimonials = blocks
          .filter(b => b.block_type === 'testimonial')
          .map(b => ({
            id: b.id,
            content: b.content,
            name: b.title,
            role: b.subtitle,
            imageUrl: b.image_url
          }));
        return (
          <TestimonialSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            testimonials={testimonials}
            paddingY={paddingY}
          />
        );

      case 'cta':
        const primaryBtn = blocks.find(b => b.block_type === 'button' && b.order === 1);
        const secondaryBtn = blocks.find(b => b.block_type === 'button' && b.order === 2);
        return (
          <CTASection
            key={section.id}
            title={section.title || ''}
            subtitle={section.subtitle}
            primaryButtonText={primaryBtn?.title}
            primaryButtonLink={primaryBtn?.link_url}
            secondaryButtonText={secondaryBtn?.title}
            secondaryButtonLink={secondaryBtn?.link_url}
            backgroundColor={section.background_color}
            paddingY={paddingY}
          />
        );

      case 'faq':
        const faqItems = blocks
          .filter(b => b.block_type === 'text' || b.block_type === 'faq_item')
          .map(b => ({
            id: b.id,
            question: b.title,
            answer: b.content
          }));
        return (
          <FAQSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={faqItems}
            paddingY={paddingY}
            backgroundColor={section.background_color}
          />
        );

      case 'text':
        return (
          <Box
            key={section.id}
            sx={{
              py: paddingY,
              backgroundColor: section.background_color || 'transparent'
            }}
          >
            {blocks.map(block => (
              <Box key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {layout.sections
        .sort((a, b) => a.order - b.order)
        .map(section => renderSection(section))}
    </Box>
  );
};

export default PageRenderer;
