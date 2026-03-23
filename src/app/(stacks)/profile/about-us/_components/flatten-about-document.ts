import type { AboutDocumentSection, AboutSubsection } from './about-content';

export type AboutRow =
  | {
      type: 'section';
      key: string;
      isFirstSection: boolean;
      sectionId: string;
      title: string;
    }
  | {
      type: 'subsection-title';
      key: string;
      isFirstSubsectionInSection: boolean;
      subsectionId: string;
      title: string;
    }
  | {
      type: 'paragraph';
      key: string;
      isFirstBlockInSubsection: boolean;
      text: string;
    }
  | {
      type: 'bullet-item';
      key: string;
      isFirstBlockInSubsection: boolean;
      isFirstItemInBulletBlock: boolean;
      text: string;
    };

function flattenSubsectionBlocks(params: {
  sectionId: string;
  subsection: AboutSubsection;
}): AboutRow[] {
  const { sectionId, subsection } = params;

  const rows: AboutRow[] = [];

  subsection.blocks.forEach((block, blockIndex) => {
    const isFirstBlockInSubsection = blockIndex === 0;

    if (block.type === 'paragraph') {
      rows.push({
        type: 'paragraph',
        key: `paragraph:${sectionId}:${subsection.id}:${blockIndex}`,
        isFirstBlockInSubsection,
        text: block.text,
      });

      return;
    }

    block.items.forEach((item, itemIndex) => {
      rows.push({
        type: 'bullet-item',
        key: `bullet:${sectionId}:${subsection.id}:${blockIndex}:${itemIndex}`,
        isFirstBlockInSubsection,
        isFirstItemInBulletBlock: itemIndex === 0,
        text: item,
      });
    });
  });

  return rows;
}

export function flattenAboutDocument(
  sections: AboutDocumentSection[]
): AboutRow[] {
  const rows: AboutRow[] = [];

  sections.forEach((section, sectionIndex) => {
    rows.push({
      type: 'section',
      key: `section:${section.id}`,
      isFirstSection: sectionIndex === 0,
      sectionId: section.id,
      title: section.title,
    });

    section.subsections.forEach((subsection, subsectionIndex) => {
      rows.push({
        type: 'subsection-title',
        key: `subsection:${section.id}:${subsection.id}`,
        isFirstSubsectionInSection: subsectionIndex === 0,
        subsectionId: subsection.id,
        title: subsection.title,
      });

      rows.push(
        ...flattenSubsectionBlocks({
          sectionId: section.id,
          subsection,
        })
      );
    });
  });

  return rows;
}
