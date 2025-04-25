import React from 'react';
import Image from 'next/image';
import Button from './Button';

interface DateIdea {
  title: string;
  description: string;
  imageUrl?: string;
}

interface DateIdeaCardProps {
  idea: DateIdea;
}

const DateIdeaCard: React.FC<DateIdeaCardProps> = ({ idea }) => {
  const displayImageUrl = idea.imageUrl || '/mochi.png'; // tODO: add placeholder image instead

  const handleReadMore = () => {
    // TODO: Implement action for "Read more" (e.g., show modal, navigate)
    console.log("Read more clicked for:", idea.title);
  };

  return (
    // --- Card Container ---
    <div className="card w-72 bg-white shadow-xl rounded-lg overflow-hidden border border-base-300 flex flex-col">

      {/* --- Image Section --- */}
      <figure className="relative h-36 w-full flex-shrink-0">
        <Image
          src={displayImageUrl}
          alt={idea.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 72vw, 288px"
        />
      </figure>

      {/* --- Content Section --- */}
      <div className="card-body items-center text-center p-4 flex flex-col flex-grow">
        <h2 className="card-title font-bold text-lg mb-1 text-background flex-shrink-0">{idea.title}</h2>
        <p className="text-sm opacity-80 mb-2 text-background flex-grow">{idea.description}</p>
        <div className="card-actions justify-center mt-auto w-full flex-shrink-0">
          <Button text="Read more" onClick={handleReadMore} />
        </div>
      </div>
    </div>
  );
};

export default DateIdeaCard;