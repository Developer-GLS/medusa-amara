import React from 'react';
import { ParagraphElement } from 'types/strapi/paragraph';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

const Paragraph: React.FC<ParagraphElement> = ({
  ParagraphContent,
  ParagraphCssClasses = '',
  ParagraphImg
}) => {
  return (
    <div className={`prose max-w-none pb-8 flex gap-6 ${ParagraphCssClasses}`}>
      {ParagraphImg && (
        <div className="flex-shrink-0 w-1/3 mb-4 md:mb-0 relative">
          <Image
            src={ParagraphImg}
            alt="Paragraph Image"
            layout="responsive"
            width={300} // Sostituisci con la larghezza reale o un valore dinamico
            height={200} // Sostituisci con l'altezza reale o un valore dinamico
            objectFit="cover"
            className="rounded-md" // Aggiunge angoli arrotondati se necessario
          />
        </div>
      )}
      <div className="flex-1">
        <ReactMarkdown
          components={{
            h1: ({ children, ...props }) => <h1 className="text-4xl font-extrabold text-ui-fg-base" {...props}>{children}</h1>,
            h2: ({ children, ...props }) => <h2 className="text-3xl font-semibold text-ui-fg-base" {...props}>{children}</h2>,
            h3: ({ children, ...props }) => <h3 className="text-2xl font-bold text-ui-fg-base" {...props}>{children}</h3>,
            h4: ({ children, ...props }) => <h4 className="text-lg font-bold text-ui-fg-base" {...props}>{children}</h4>,
            p: ({ children, ...props }) => <p className="text-base leading-relaxed text-ui-fg-base" {...props}>{children}</p>,
            strong: ({ children, ...props }) => <strong className="text-base leading-relaxed font-bold text-ui-fg-base" {...props}>{children}</strong>,
            li: ({ children, ...props }) => <li className="text-ui-fg-base" {...props}>{children}</li>,
          }}
        >
          {ParagraphContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Paragraph;
